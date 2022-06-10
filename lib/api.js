"use strict"

const express = require('express');
const logger = require('./logger').getLogger('[API]');
const XSDocDB = require('../lib/xsdocdb');
const XSService = require('../lib/xsservice');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

class API {
    constructor(servicelocator) {
        this.xsdocdb = servicelocator['xsdocdb'];
        this.xsservice = servicelocator['xsservice'];
    }

    getRouter() {
        var router = express.Router();
        router.get('/fields', (req, res)=> this.getFields(req, res));
        router.get('/symboldata', (req, res)=> this.getSymbolData(req, res));
        router.use('/docs', swaggerUi.serve);
        router.get('/docs', swaggerUi.setup(swaggerDocument));
        return router;
    }    

    handleErr(req, res, err) {
        logger.error('Error::' + err.toString());
        res.status(500).send('Error occurred:' + err.toString());
    }

    /**
     * http://<server>/api/fields
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async getFields(req, res) {
        try {
            let fields = await this.xsdocdb.getFilterFields();
            res.json(fields);                
        }
        catch(exception) {
            this.handleErr(req, res, exception);
        }
    }

    /**
     * http://<server>/api/symboldata?symbol=2330.TW&freq=8&fields=外資買賣超;1234&count=20
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async getSymbolData(req, res) {
        try {
            let symbol = req.query.symbol;
            if (!symbol)
                throw `Missing argument: symbol`;
            symbol = symbol.toUpperCase();
    
            let freq = req.query.freq;
            if (!freq)
                throw `Missing argument: freq`;
    
            let fields = req.query.fields;
            if (!fields)
                throw `Missing argument: fields`;
    
            let count = req.query.count || '20';
            let records = await this.xsservice.queryFieldData(symbol, freq, fields, count);
            res.json({symbol, freq, records});    
        }
        catch(exception) {
            this.handleErr(req, res, exception);
        }
    }
}

module.exports = API;