var express = require('express');
// var bodyParser = require('body-parser');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods.js');
var User = require('../models/user.js');

// create application/json parser
// var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
// var urlencodedParser = bodyParser.urlencoded({ extended: false })


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


// 加入购物车
router.post('/addCart', function(req,res,next) {
	// post取参 req.body
	var userId = '100000077', productId = req.body.productId;
	User.findOne({userId:userId},function(err, userDoc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message
			})
		}else {
			if(userDoc) {
				Goods.findOne({productId: productId}, function(err, doc) {
					if(err) {
						res.json({
							status:'1',
							msg: err.message
						})
					}else {
						if(doc) {
							console.log(doc);
							doc.productNum = '1';
							doc.checked = '1';
							console.log(doc);
							userDoc.cartList.push(doc);
							userDoc.save(function(saveErr, saveDoc) {
								if(saveErr) {
									res.json({
										status: '1',
										msg: saveErr.message
									})
								}else {
									res.json({
										status: '0',
										msg: '',
										result: 'success'
									})
								}
							})

						}
					}
				})
			}
		}
	})
})

module.exports = router;