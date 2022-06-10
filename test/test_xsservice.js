"use strict";

const XSService = require('../lib/xsservice');

describe("Test XSService", ()=> {
    it.skip("test queryFieldData(日)", async()=> {
        let svc = new XSService();

        let fields = ['外資買賣超', '投信買賣超'];

        let data = await svc.queryFieldData('2330.TW', '8', fields, 20);

        console.dir(data, {depth: null});
    })

    it.skip("test queryFieldData(日 with 日期)", async()=> {
        let svc = new XSService();

        let fields = ['日期', '3', '收盤價', '外資買賣超'];

        let data = await svc.queryFieldData('2330.TW', '8', fields, 20);

        console.dir(data, {depth: null});
    })

    it.skip("test queryFieldData(月)", async()=> {
        let svc = new XSService();

        let fields = ['月營收', '3093'];

        let data = await svc.queryFieldData('2330.TW', '10', fields, 20);

        console.dir(data, {depth: null});
    })
});

