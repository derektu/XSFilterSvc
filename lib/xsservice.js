"use strict";

const fetch = require('node-fetch');
const _ = require('lodash');

const XSRequest = require('./xsrequest');
const logger = require('./logger').getLogger('[XSFilterDataSvc]');

class XSService {
    /**
     * construct XSService object
     * 
     * 實際的hub位置在
     *  http://192.168.99.153 (測試環境)
     *  http://sd-xshubuat/2019/index.html (UAT環境)
     * 
     *  管理介面 <hub>/2019/index.html
     * 
     * 在203.67.19.128上面架了兩個proxy
     * 
     *  http://203.67.19.128/xsservicetest 指向192.168.99.153
     *  http://203.67.19.128/xsserviceutat 指向sd-xshubuat
     * 
     * @param {string} server xshub server location, for example "http://203.67.19.128/xsserviceuat/"
     */
    constructor(server) {
        this.server = server || 'http://203.67.19.128/xsserviceuat/';
        if (!this.server.endsWith('/'))
            this.server = this.server + '/';
    }

    /**
     * 查詢商品某個頻率的欄位資料
     * 
     * @param {string} symbol 商品代碼, 例如"2330.TW"
     * @param {string} freq 欲查詢的頻率, 例如"8" for 日線, 或是CONST.Freq.D
     * @param {*} fields array of fields, 請傳入要查詢的欄位的TAID or 欄位名稱 
     * @param {integer} count 欲查詢的最新筆數
     * 
     * @returns {*} 回傳 array of {date, field1, field2, ..}
     */
    async queryFieldData(symbol, freq, fields, count) {
        if (!Array.isArray(fields))
            fields = fields.split(";");

        fields = fields.filter((field)=> {
            return field != '日期' && field != '3';
        })
        if (fields.length == 0)
            throw `查詢欄位是空的(扣除日期欄位)`;

        var postXml = this._composeHistDataRequestXml(symbol, freq, fields, count);

        var version = 1;
        var action = 3;

        let xmldoc = await new XSRequest().postXmlRequst(this.server, version, action, postXml);
        return this._parseFieldData(xmldoc, fields, count);
    }

    _composeHistDataRequestXml(symbolID, freq, fields, count) {
        /*
         <?xml version='1.0' encoding='utf-8' ?>
         <Symbol ID='2330.TW' Freq='8' Fields='收盤價;成交量' Limit='<count>' Order='desc'/>
         */
        let xml = '';
        let fs = fields.join(';');
        xml = xml + '<?xml version="1.0" encoding="UTF-8"?>';
        xml = xml + `<Symbol ID='${symbolID}' Freq='${freq}' Fields='${fs}' From='-1' Limit='${count}' Order='desc'/>`
        return xml;
    }

    _parseFieldData(doc, fields, count) {
        /*
            xmldoc的格式如下:

            <Ret status="0">
                <Fields><![CDATA[field1;field2;日期;內建欄位1;內建欄位2;內建欄位3;..]]></Fields>
                <Symbol ID="2330.TW" Freq="8" Count="全部筆數">
                    <val idx=".." value="value1;value2;20110103;內建欄位數值1;內建欄位數值2;內建欄位數值3;.." />
                    <val idx=".." value="value1;value2;20110102;內建欄位數值1;內建欄位數值2;內建欄位數值3;.." />
                    <..>
                </Symbol>
            </Ret>

            我們想要轉成
            [
                { date:日期1, field1:value1, field2:value2},
                { date:日期1, field1:value1, field2:value2},
            ]
        */

        let fieldNode = doc.documentElement.getElementsByTagName("Fields")[0];
        let {dateIndex, fieldIndices} = this._getFieldIndices(fieldNode.childNodes[0].data, fields);

        let valNodeList = doc.documentElement.getElementsByTagName("val");
        let records = [];

        for (let i = 0; i < valNodeList.length; i++) {
            let node = valNodeList.item(i);
            let values = node.getAttribute('value');
            let record = this._parseNodeValue(values, dateIndex, fields, fieldIndices);
            if (record)
                records.push(record);
        }
        return records;
    }

    _parseNodeValue(valueString, dateIndex, fields, fieldIndices) {
        let values = valueString.split(';');
        
        let date = values[dateIndex];
        let record = {};
        _.each(fields, (field, index)=> {
            let value = '';
            if (fieldIndices[index] >= 0) {
                value = values[fieldIndices[index]];
                if (value == 'N/A')
                    value = '';
            }
            if (value) {
                record[field] = value;
            }
        })
        if (_.isEmpty(record))
            return null;

        record['date'] = date;
        return record;
    }

    /**
     * 從server回應的欄位名稱內找到我們想要查詢的欄位的對應順序.
     * 
     * @param {string} fieldsString server回傳的結果欄位名稱序列, e.g. 收盤價;成交量;日期;開盤價;收盤價;最低價;最高價;.., 這裡面會包含我們要查詢的欄位名稱/代碼, 以及"日期"等內建欄位
     * @param {*} fields array of fields, 我們要查詢的欄位代碼/名稱陣列 
     * 
     * @returns {*} {dateIndex:.., fieldIndices:[..]}, dateIndex是日期的位置, fieldIndices則是我們要查詢的欄位的對應位置
     */
    _getFieldIndices(fieldsString, fields) {
        let retFields = fieldsString.split(';');

        // 先找'日期'
        //
        let dateIndex = _.indexOf(retFields, '日期');
        if (dateIndex < 0)
            throw `Cannot find 日期欄位的位置`;    

        let fieldIndices = [];
        fields.forEach((field)=> {
            fieldIndices.push(_.indexOf(retFields, field));
        })
        return {dateIndex, fieldIndices};
    }

}

module.exports = XSService;