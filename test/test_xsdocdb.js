"use strict";

const XSDocDB = require('../lib/xsdocdb');

describe("Test XSDocDB", ()=> {
    it.skip("test getFilterFields", async()=> {
        let svc = new XSDocDB();

        let fields = await svc.getFilterFields();

        console.dir(fields, {depth: null});
    })
});

