"use strict";

const fetch = require('node-fetch');
const _ = require('lodash');

const XSRequest = require('./xsrequest');
const logger = require('./logger').getLogger('[SymbolSvc]');

class SymbolSvc {

    constructor(server) {
        // TFN = 192.168.152.30
        // SEEDNET = 192.168.162.20
        //
        this.server = server || 'http://192.168.162.20/';
        if (!this.server.endsWith('/'))
            this.server = this.server + '/';
    }

    /**
     * 回傳某個exchange的股票清單
     * 
     * @param {number} exch 交易所編號 
     */
    async getSymbolList(exch) {
        // TODO: 先return stub data
        return [
            {id: '1101.TW', name:'台泥'},
            {id: '1216.TW', name:'統一'},
            {id: '1301.TW', name:'台塑'},
            {id: '1303.TW', name:'南亞'},
            {id: '1326.TW', name:'台化'},
            {id: '2002.TW', name:'中鋼'},
            {id: '2303.TW', name:'聯電'},
            {id: '2317.TW', name:'鴻海'},
            {id: '2330.TW', name:'台積電'},
        ];
    }


}

module.exports = SymbolSvc;
