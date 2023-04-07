"use strict"

const express = require('express');
const moment = require('moment');
const logger = require('./logger').getLogger('[API]');
const XSDocDB = require('../lib/xsdocdb');
const XSService = require('../lib/xsservice');
const SymbolSvc = require('../lib/symbolsvc')

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

class API {
    constructor(servicelocator) {
        this.xsdocdb = servicelocator['xsdocdb'];
        this.xsservice = servicelocator['xsservice'];
        this.symbolsvc = servicelocator['symbolsvc'];
    }

    getRouter() {
        var router = express.Router();
        router.get('/fields', (req, res)=> this.getFields(req, res));
        router.get('/symboldata', (req, res)=> this.getSymbolData(req, res));
        router.get('/symbollist', (req, res)=> this.getSymbolList(req, res));
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
     * http://<server>/api/symboldata?symbol=2330.TW&freq=8&fields=3054;3055&startdate=20210101&enddate=20210131
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
    
            let startDate;
            if (req.query.startdate) {
                startDate = moment(req.query.startdate);
                if (!startDate.isValid())
                    throw `Invalid argument: startdate. Please specify as YYYYMMDD format.`;
            }
            else {
                startDate = moment().startOf('year');
            }

            let endDate;
            if (req.query.enddate) {
                endDate = moment(req.query.enddate);
                if (!endDate.isValid())
                    throw `Invalid argument: enddate. Please specify as YYYYMMDD format.`;
            }
            else {
                endDate = moment();
            }

            if (startDate.isAfter(endDate))
                throw `Invalid argument: startdate is after enddate.`;

            let records = await this.xsservice.queryFieldData(symbol, freq, fields, startDate.format("YYYYMMDD"), endDate.format("YYYYMMDD"));
            res.json({symbol, freq, records});    
        }
        catch(exception) {
            this.handleErr(req, res, exception);
        }
    }

    /**
     * http://<server>/api/symbollist?exch=1
     * 
     * @param {*} req 
     * @param {*} res 
     */
     async getSymbolList(req, res) {
        try {
            let exch = req.query.exch;
            if (!exch)
                throw `Missing argument: exch`;

            exch = parseInt(exch);
            let records = await this.symbolsvc.getSymbolList(exch);
            res.json(records);    
        }
        catch(exception) {
            this.handleErr(req, res, exception);
        }

    }
}

module.exports = API;