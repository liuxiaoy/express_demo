
/**
 * Module dependencies.
 * 模块依赖
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
/**
 * 添加的模块
 */
var partials = require('express-partials');//用ejs模板时使用这个中间件
var flash = require('connect-flash');//req.flash()中间件
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings'); 

var routes = require('./routes/index');
var posts = require('./routes/posts');


var app = express();//实例化Express服务器，该服务器 <--（继承自）ConnectHTTP服务器 <-- Node HTTP服务器
// view engine setup
app.set('views', path.join(__dirname, 'views'));//将 views 设为模板文件的根
app.set('view engine', 'ejs');//将 view engine 设为 ejs （HTML模板语言），另一个是Jade
app.use(partials());//用ejs模板时使用这个中间件

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());//Connect主体解析中间件
app.use(bodyParser.urlencoded({ extended: false }));//Connect主体解析中间件
app.use(methodOverride());//方法重载中间件，让只能使用GET或POST请求的浏览器貌似能够使用其他方法
app.use(flash());//req.flash('error');需要自行添加模块了
app.use(cookieParser('123'));
app.use(session({ //会话中间件
    secret: settings.cookieSecret, 
    store: new MongoStore({ 
      db: settings.db 
    }) ,
    maxAge:1000*60*60*24
  })); 
app.use(express.static(path.join(__dirname, 'public')));//静态文件服务器中间件,express4唯一保留的中间件

//会话路由
app.use(function(req, res, next){
   console.log("app.locals");
   res.locals.user = req.session.user;
   //res.locals.posts = req.session.posts;
   var error = req.flash('error');
   res.locals.error = error.length ? error : null;
  
   var success = req.flash('success');
   res.locals.success = success.length ? success : null;
   next();
 });

// Routes
// 路由
app.use('/posts', posts);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	console.log("app locals 404");
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	console.log("app locals 500");
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;