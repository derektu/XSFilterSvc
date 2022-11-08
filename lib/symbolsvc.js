"use strict";

const fetch = require('node-fetch');
const _ = require('lodash');
const iconv = require('iconv-lite');
var DOMParser = require('xmldom').DOMParser;

const logger = require('./logger').getLogger('[SymbolSvc]');

class SymbolSvc {
    /**
     * construct SymbolSvc object
     * 
     * 實際的位置在
     *  TFN = 192.168.152.30
     *  SEEDNET = 192.168.162.20
     *  SD-ASPUAT = 192.168.160.15
     * 
     * 在203.67.19.129上面架了1個proxy
     * 
     *  http://203.67.19.129/symbolsvc 指向192.168.160.15
     * 
     * @param {string} server symbolsvc server location, for example "http://203.67.19.129/symbolsvc/"
     */

    constructor(server) {
        this.server = server || 'http://203.67.19.129/symbolsvc/';
        if (!this.server.endsWith('/'))
            this.server = this.server + '/';
    }

    /**
     * 回傳某個exchange的股票清單
     * 
     * @param {number} exch 交易所編號 
     */
    async getSymbolList(exch) {
        let url = `${this.server}jds/5/getidnamebasic.jdxml?a=${exch}`;

        try {
            let response = await fetch(url);
            let buffer = await response.buffer();
            let xmltext = iconv.decode(buffer, 'Big5');
            return this._parseXmlResult(xmltext);    
        }
        catch(exception) {
            logger.error(`Calling [${url}] fails:${exception}`);
            throw exception;
        }
    }

    _parseXmlResult(xml) {
		/*
			<Result Expires="...">
                <Symbol ExchID=".." ExchCode="TW">
                    <Item ID="1101" Name="台泥" ST="1" SST="0" .. />
                </Symbol>
			</Result>

		*/
		var doc = new DOMParser().parseFromString(xml);
        var nodeSymbol = doc.documentElement.getElementsByTagName("Symbol")[0];
        var exchSuffix = nodeSymbol.getAttribute("ExchCode");
        var nodeItems = nodeSymbol.getElementsByTagName("Item");
        var symbols = [];
        for (var i = 0; i < nodeItems.length; i++) {
            var nodeItem = nodeItems[i];
            var id = nodeItem.getAttribute("ID").trim();
            var name = nodeItem.getAttribute("Name").trim();
            var st = parseInt(nodeItem.getAttribute("ST"));
            var sst = parseInt(nodeItem.getAttribute("SST"));
            // TODO: 目前只支援台股(股票)
            if (st == 1 && sst == 0) {
                symbols.push({id: `${id}.${exchSuffix}`, name: name});
            }
        }
        return symbols;
    }


}

module.exports = SymbolSvc;
