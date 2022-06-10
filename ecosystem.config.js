module.exports = {
    apps : [{
      name   : "xsfiltersvc",
      script : "./lib/app.js",
      args : "",
      watch : true,
      ignore_watch : [ "node_modules", "logs" ]    
    }]
  }
  