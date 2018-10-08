var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods.js');

// 连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/mmGo');

// 连接成功
mongoose.connection.on('connected', function() {
	console.log('MongoDB connected success.');
})
// 连接失败
mongoose.connection.on('error', function() {
	console.log('MongoDB connected fail.');
})
// 断开连接
mongoose.connection.on('disconnected', function() {
	console.log(MongoDB connected disconnected);
})

router.get('/', function(req,res,next) {
	res.send('hello Goods list!!!');
})

module.exports = router;