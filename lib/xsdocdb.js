"use strict";

const fetch = require('node-fetch');

const logger = require('./logger').getLogger('[XSDocDB]');

class XSDocDB {
    /**
     * construct XSDocDB service object by passing xsdocdb server location
     * 
     * @param {string} server XSDocDB server location, for example "http://203.67.19.128/xsdocdb/"
     */
    constructor(server) {
        this.server = server || 'http://203.67.19.128/xsdocdb/';
        if (!this.server.endsWith('/'))
            this.server = this.server + '/';
    }

    /**
     * 回傳所有的選股欄位.
     * 
     * @returns {*} 回傳array of object, each object = {id, name, taid, unit, markets:[{market, freq}]}
     */
    async getFilterFields() {
        let url = `${this.server}api/fields?type=3`;
        let response = await fetch(url);
        let json = await response.json();
        let items = [];
        json.forEach(field => {
            if (!field.disabled) {
                items.push({id: field.id, name: field.name, unit: field.unit, taid: field.xqtaid, markets: field.markets});
            }
        });
        return items;
    }

}

module.exports = XSDocDB;