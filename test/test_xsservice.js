"use strict";

const moment = require('moment');

const XSService = require('../lib/xsservice');

describe("Test XSService", ()=> {
    it.skip("queryFieldData(日)", async()=> {
        let svc = new XSService();

        let fields = ['3054', '3055'];  // 3054=外資買賣超, 3055=投信買賣超
        let startDate = '20230101';
        let endDate = moment().format("YYYYMMDD");

        let data = await svc.queryFieldData('2330.TW', '8', fields, startDate, endDate);

        console.dir(data, {depth: null});
    })

    it.skip("queryFieldData(日)_with_日期", async()=> {
        let svc = new XSService();

        let fields = ['3', '8', '3054'];    //3=日期, 8=收盤價, 3054=外資買賣超

        let startDate = '20230101';
        let endDate = moment().format("YYYYMMDD");
        let data = await svc.queryFieldData('2330.TW', '8', fields, startDate, endDate);

        console.dir(data, {depth: null});
    })

    it.skip("test queryFieldData(月)", async()=> {
        let svc = new XSService();

        let fields = ['3091', '3093'];  //3091=月營收, 3093=月營收年增率

        let startDate = '20230101';
        let endDate = moment().format("YYYYMMDD");
        let data = await svc.queryFieldData('2330.TW', '10', fields, startDate, endDate);

        console.dir(data, {depth: null});
    })
});

