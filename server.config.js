// For deploy to 203.67.19.129
module.exports = {
    apps : [
        {
            name   : "xsfiltersvc",
            script : "./lib/app.js",
            args : "--port=8888 --xsdocdb=http://127.0.0.1/xsdocdb --xsservice=http://127.0.0.1/xsserviceuat --symbolsvc=http://192.168.162.20/",
            watch : true,
            ignore_watch : [ "node_modules", "logs" ]    
        },
        {
            name   : "xsfiltersvc.test",
            script : "./lib/app.js",
            args : "--port=8887 --xsdocdb=http://127.0.0.1/xsdocdb.test --xsservice=http://127.0.0.1/xsservicetest --symbolsvc=http://192.168.162.20/",
            watch : true,
            ignore_watch : [ "node_modules", "logs" ]    
        }
    ]
  }
  