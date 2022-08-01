module.exports = {
    apps : [
        {
            name   : "xsfiltersvc",
            script : "./lib/app.js",
            args : "",
            watch : true,
            ignore_watch : [ "node_modules", "logs" ]    
        },
        {
            name   : "xsfiltersvc.test",
            script : "./lib/app.js",
            args : "--port=8887 --xsdocdb=http://203.67.19.128/xsdocdb.test --xsservice=http://203.67.19.128/xsservicetest",
            watch : true,
            ignore_watch : [ "node_modules", "logs" ]    
        }
    ]
  }
  