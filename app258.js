
/**
 * Module dependencies.
 * 模块依赖
 */

var express = require('express')
  , routes = require('./routes');
//express.createServer()实例化Express服务器，该服务器 <--（继承自）ConnectHTTP服务器 <-- Node HTTP服务器
var app = module.exports = express.createServer();//express() 表示创建express应用程序  object is not a function

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings'); 


// Configuration
// 配置

app.configure(function(){
  app.set('views', __dirname + '/views');//将 views 设为模板文件的根
  app.set('view engine', 'ejs');//将 view engine 设为 ejs （HTML模板语言），另一个是Jade
  //设置中间件组件
  app.use(express.bodyParser());//Connect主体解析中间件
  app.use(express.methodOverride());//方法重载中间件，让只能使用GET或POST请求的浏览器貌似能够使用其他方法

  app.use(express.cookieParser()); //cookie解析器中间件
  app.use(express.session({ //会话中间件
    secret: settings.cookieSecret, 
    store: new MongoStore({ 
      db: settings.db 
    }) ,
    maxAge:1000*60*60*24
  })); 

  app.use(express.router(routes));
  //app.use(app.router);
  app.use(express.static(__dirname + '/public'));//静态文件服务器中间件
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//// Routes
//// 路由
//
//app.get('/', routes.index);
//app.get('/hello', routes.hello);

//会话路由
app.dynamicHelpers({ 
  user: function(req, res) { 
    return req.session.user; 
  }, 
  error: function(req, res) { 
    var err = req.flash('error'); 
    if (err.length) 
      return err; 
    else 
      return null; 
  }, 
  success: function(req, res) { 
    var succ = req.flash('success'); 
    if (succ.length) 
      return succ; 
    else 
      return null; 
  }, 
}); 

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
