var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require('./routes/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'jade');
app.engine('.html',ejs.__express);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

//这里传入了一个密钥加session id
app.use(cookieParser('Wilson'));
//使用就靠这个中间件
app.use(session({
    name: config.sessionId,
    secret: config.sessionSecret,  // 用来对session id相关的cookie进行签名
    store: new MongoStore({ //创建新的mongodb数据库
        url: config.url, //比如：'mongodb://cha:root@localhost:27017/ch_db'
        collection: config.sessionCollection //比如：'ch_sessions'
    }),
    saveUninitialized: true,  // 是否自动保存未初始化的会话，这里一定是true
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 24*60*60*1000  // 有效期，单位是毫秒
    }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	if(req.cookies.userId) {
		console.log( req.session);
		console.log(req.cookies);
		next();
	}else {
		console.log(req.session.userInfo);
		console.log(req.cookies );
		// console.log(req)
		// console.log("req.originalUrl:"+req.originalUrl)
		// console.log("req.path:"+ req.path)
		if(req.originalUrl=='/users/login' || req.originalUrl=='/users/loginOut' || req.path=='/goods') {
			next();
		}else {
			req.session.originalUrl = req.originalUrl?req.originalUrl:null;//记录用户的请求路径
        	// console.log(req.session);
        	res.redirect('/users/login');
			// res.json({
			// 	status: '1',
			// 	msg: '当前未登录',
			// 	result: ''
			// })
		}
	}
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
