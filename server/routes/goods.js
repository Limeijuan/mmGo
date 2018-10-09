var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods.js');

// 连接MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/text');

// 连接成功
mongoose.connection.on('connected', function() {
	console.log('MongoDB connected success.');
});
// 连接失败
mongoose.connection.on('error', function() {
	console.log('MongoDB connected fail.');
});
// 断开连接
mongoose.connection.on('disconnected', function() {
	console.log('MongoDB connected disconnected.');
});

router.get('/', function(req,res,next) {
	let page = req.param('page');
	let pageSize = parseInt(req.param('pageSize'));
	let sort = parseInt(req.param('sort'));
	let skip = (page - 1)*pageSize;
	let params = {};
	let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
	goodsModel.sort({'salePrice': sort});
	goodsModel.exec(function(err,doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message
			});
		}else {
			res.json({
				status: '0',
				msg: '',
				result: {
					count: doc.length,
					list: doc
				}
			})
		}
	})
});

module.exports = router;