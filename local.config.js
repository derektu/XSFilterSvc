// For local development
module.exports = {
    apps : [
        {
            name   : "xsfiltersvc",
            script : "./lib/app.js",
            args : "--port=8888 --xsdocdb=http://203.67.19.129/xsdocdb --xsservice=http://203.67.19.129/xsserviceuat",
            watch : true,
            ignore_watch : [ "node_modules", "logs" ]    
        },
        {
            name   : "xsfiltersvc.test",
            script : "./lib/app.js",
            args : "--port=8887 --xsdocdb=http://203.67.19.129/xsdocdb.test --xsservice=http://203.67.19.129/xsservicetest",
            watch : true,
            ignore_watch : [ "node_modules", "logs" ]    
        }
    ]
  }
  