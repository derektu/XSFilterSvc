"use strict";

const SymbolSvc = require('../lib/symbolsvc');

describe("Test SymbolSvc", ()=> {
    it("test Exch 1", async()=> {
        let svc = new SymbolSvc();

        let symbols = await svc.getSymbolList('1');

        console.dir(symbols, {depth: null});
    })

});

