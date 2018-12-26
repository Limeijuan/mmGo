var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);// 引入mongo用来保存session

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
app.use(session({
    secret:'Wilson', //加密字符串也可以写数组
    name: 'sessionId',
    resave:false,     //强制保存session 建议设置成false
    saveUninitialized:true,  //强制保存未初始化的内容
    rolling:true, //动态刷新页面cookie存放时间
    cookie:{maxAge:24*60*60*1000}, //保存时效
    store: new MongoStore({   //将session存进数据库  用来解决负载均衡的问题
        url:'mongodb://47.98.167.40:27017/sesssionText',
        touchAfter:24*3600 //通过这样做，设置touchAfter:24 * 3600，您在24小时内只更新一次会话，不管有多少请求(除了在会话数据上更改某些内容的除外)
    })
}))

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	if(req.cookies.userId) {
		next();
	}else {
		// console.log("req.originalUrl:"+req.originalUrl)
		// console.log("req.path:"+ req.path)
		if(req.originalUrl=='/users/login' || req.originalUrl=='/users/loginOut' || req.path=='/goods') {
			next();
		}else {
			req.session.originalUrl = req.originalUrl?req.originalUrl:null;//记录用户的请求路径
        	// console.log(req.session.originalUrl);
			// console.log(req.cookies.userId);
        	// res.redirect('/users/login');
			res.json({
				status: '1',
				msg: '当前未登录',
				result: ''
			})
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
