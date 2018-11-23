var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 登陆
router.post('/login', function(req, res, next) {
	var param = {
		userName: req.body.userName,
		userPwd: req.body.userPwd
	};
	User.findOne(param, function(err,doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message
			})
		}else {
			if(doc) {
				res.cookie('userId', doc.userId, {
					path: '/',
					maxAge: 1000*60*60
				});
				req.session.user = doc;
				res.json({
					status: '0',
					msg: '',
					result: {
						userName: doc.userName
					}
				})
			}
		}
	})
})
// 退出
router.post('/loginOut', function(req, res, next) {
	res.cookie('userId', '', {
		path: '/',
		maxAge: -1
	})
	res.json({
		status: '0',
		msg: '',
		result: ''
	})
})
// 加入购物车
router.post('/addCart', function(req,res,next) {
	// 需用户登录；取id,
	// post取参 req.body
	var userId = req.cookies.userId, productId = req.body.productId;
	User.findOne({userId:userId},function(err, userDoc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message
			})
		}else {
			if(userDoc) {
				let goodsItem = ''
				userDoc.cartList.forEach((item) => {
					if(item.productId == productId) {
						goodsItem = item;
						item.productNum ++;
					}
				})
				
				if(goodsItem) {
					userDoc.save(function(saveErr,saveDoc) {
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
				}else {
					Goods.findOne({productId: productId}, function(err, doc) {
						if(err) {
							res.json({
								status:'1',
								msg: err.message
							})
						}else {
							if(doc) {
								var docs = JSON.parse(JSON.stringify(doc));
								docs.productNum = '1';
								docs.checked = '1';
								userDoc.cartList.push(docs);
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
		}
	})
})
// 查询当前用户购物车数据
router.post('/cartList', function(req, res, next) {
	if(req.cookies.userId){
      var userId = req.cookies.userId;
      User.findOne({userId: userId},function(err, doc) {
      	if(err) {
      		res.json({
      			status: '1',
      			msg: err.massage,
      			result: ''
      		})
      	}else {
      		if(doc) {
      			res.json({
      			status: '0',
      			msg: 'success',
      			result: doc.cartList || ''
      		})
      		}
      	}
      })
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
})
// 删除购物车商品
router.post('/removePro', function(req, res, next) {
	var productId = req.body.productId, userId = req.cookies.userId; 
	if(userId) {
		User.update({
			userId: userId
		},{
			$pull:{
				'cartList': {
					productId: productId
				}
			}
		},function(err,doc) {
			if(err) {
				res.json({
					status: '1',
					msg: err.message,
					result: ''
				})
			}else {
				res.json({
					status: '0',
					msg: '',
					result: 'success'
				})
			}
		})
	}else{
	    res.json({
			status:'1',
			msg:'未登录',
			result:''
	    });
	}
})
// 修改商品数量
router.post('/cartEdit', function(req, res, next) {
	var userId = req.cookies.userId,
		productId = req.body.productId,
		productNum = req.body.productNum;
	User.update({
		userId: userId,
		'cartList.productId': productId
	},{
		'cartList.$.productNum': productNum
	}, function(err,doc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		}else {
			res.json({
				status: '0',
				msg: '',
				result: doc
			})
		}
	})
})
module.exports = router;
