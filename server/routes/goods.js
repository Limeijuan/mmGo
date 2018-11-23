var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods.js');


// // 连接MongoDB数据库
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

// 查询商品列表
router.get('/', function(req,res,next) {
	// get 取参： req.query
	let page = req.query.page;
	let pageSize = parseInt(req.query.pageSize);
	let sort = parseInt(req.query.sort);
	let skip = (page - 1)*pageSize;
	let listParams = {};

	/*实现---查询不同价格范围商品*/
	let priceLevel = req.query.priceLevel;
	let priceGt = '', priceLte = '';
	if(priceLevel != 'all') {
		switch (priceLevel) {
			case '0': priceGt = 0; priceLte = 500; break;
			case '1': priceGt = 500; priceLte = 1000; break;
			case '2': priceGt = 1000; priceLte = 1500; break;
			case '3': priceGt = 1500; priceLte = 2000; break;
		};
		listParams = {
			'salePrice':{
				$gt: priceGt,
				$lte: priceLte
			}
		}
	}

	// 分页排序
	let goodsModel = Goods.find(listParams).skip(skip).limit(pageSize);
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