var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Goods = require('../models/goods.js');
var dateFormat = require('../util/dateFormat.js');

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
					maxAge: 1000*60*60*24
				});
				res.cookie('userName', doc.userName, {
					path: '/',
					maxAge: 1000*60*60*24
				});
				// req.session.user = doc;
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
});
// 判断 是否在登陆有效期
router.get("/checkLogin", function (req,res,next) {
  if(req.cookies.userId){
      res.json({
        status:'0',
        msg:'',
        result:req.cookies.userName || ''
      });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});
// 购物车商品数量
router.post("/getCartCount", function(req,res,next) {
	if(req.cookies.userId) {
		var userId = req.cookies.userId;
		User.findOne({userId: userId},function(err, doc) {
	      	if(err) {
	      		res.json({
	      			status: '1',
	      			msg: err.massage,
	      			result: ''
	      		})
	      	}else {
	      		if(doc.cartList) {
	      			res.json({
		      			status: '0',
		      			msg: 'success',
		      			result: {
		      				cartCount : doc.cartList.length
		      			}
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
});
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
						item.checked = '1';
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
								// gooods列表必须有对应字段不然加不上，或者如下写法
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
});
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
});
// 删除购物车商品
router.post('/removePro', function(req, res, next) {
	var productId = req.body.productId, 
		userId = req.cookies.userId; 
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
});
// 修改商品数量
router.post('/cartEdit', function(req, res, next) {
	var userId = req.cookies.userId,
		productId = req.body.productId,
		productNum = req.body.productNum
		checked = req.body.checked;
	User.update({
		userId: userId,
		'cartList.productId': productId
	},{
		'cartList.$.productNum': productNum,
		'cartList.$.checked': checked
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
});
// 全选-批量修改选中
router.post('/selectAllEdit', function(req, res, next) {
	var userId = req.cookies.userId
		selectAll = req.body.selectAll ? '1' : '0' ;
	User.findOne({userId: userId}, function(err, userDoc) {
		if(err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		}else {
			userDoc.cartList.forEach((item) => {
				item.checked = selectAll
			});
			userDoc.save(function(err2, doc) {
				if(err2) {
					res.json({
						status: '1',
						msg: err2.message,
						result: ''
					});
				}else {
					res.json({
						status: '0',
						msg: '',
						result: doc
					});
				}
			})
		}
	})
});
// 查询用户地址等信息
router.get('/addressList', function(req, res, next) {
	var userId = req.cookies.userId;
	User.findOne({userId: userId}, function(err, doc) {
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
				result: doc.addressList
			});
		}
	})
});
// 设置用户默认地址
router.post('/setDefault', function(req, res, next) {
	var userId = req.cookies.userId
		addressId = req.body.addressId;

	if(!addressId) {
		res.json({
			status: '1',
			msg: 'addressId is null',
			result: ''
		});
	}else {
		User.findOne({userId: userId}, function(err, userDoc) {
			if(err) {
				res.json({
					status: '1',
					msg: err.message,
					result: ''
				});
			}else {
				userDoc.addressList.forEach((item) => {
					if(item.addressId == addressId) {
						item.isDefault = true
					}else {
						item.isDefault = false
					}
					
				});
				userDoc.save(function(err2, doc) {
					if(err2) {
						res.json({
							status: '1',
							msg: err2.message,
							result: ''
						});
					}else {
						res.json({
							status: '0',
							msg: '',
							result: doc
						});
					}
				})
			}
		})
	}
});
// 删除地址
router.post('/delAddress', function(req, res, next) {
	var userId = req.cookies.userId
		addressId = req.body.addressId;
	if(userId) {
		User.update({
			userId: userId
		},{
			$pull:{
				'addressList': {
					addressId: addressId
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
});
// 订单支付-保存订单
router.post('/payMent', function(req, res, next) {
	var userId = req.cookies.userId,
		addressId = req.body.addressId,
		priceDetails = req.body.priceDetails

	if(userId) {
		User.findOne({userId: userId},function(err, doc) {
	      	if(err) {
	      		res.json({
	      			status: '1',
	      			msg: err.massage,
	      			result: ''
	      		})
	      	}else {
	      		if(doc) {
	      			var address = '', goodsList = [];
	      			//获取当前用户地址信息
	      			doc.addressList.forEach((item) => {
	      				if(addressId == item.addressId) {
	      					address = item;
	      				}
	      			});
	      			//获取当前用户购物车购买商品
	      			doc.cartList.forEach((item) => {
	      				if(item.checked == '1') {
	      					goodsList.push(item);
	      				}
	      			});
	      			var platForm = '688'; //当做系统平台 码
	      			var  o1 = Math.floor(Math.random()*10);
	      			var  o2 = Math.floor(Math.random()*10);
	      			var sysDate = new Date().Format('yyyyMMddhhmmss');
	      			var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
	      			var orderId = platForm + o1 + sysDate + o2;
	      			// 创建保存订单
	      			let order = {
	      				orderId : orderId,
			            orderTotal : priceDetails.orderTotal,
			            orderStatus : 1,
			            createDate : createDate,
			            goodsList:  goodsList
	      			}
	      			doc.orderList.push(order);
	      			doc.save(function(err2,doc2) {
	      				if(err2) {
	      					res.json({
				      			status: '1',
				      			msg: err.massage,
				      			result: ''
				      		})
	      				}else {
	      					res.json({
				      			status: '0',
				      			msg: '',
				      			result: {
				      				orderId: order.orderId,
				      				orderTotal: order.orderTotal
				      			}
				      		})
	      				}
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
});
// 根据订单id查询订单
router.get('/orderDefault', function(req, res, next) {
	var userId = req.cookies.userId,
		orderId = req.query.orderId

	if(userId) {
		User.findOne({userId: userId},function(err, doc) {
	      	if(err) {
	      		res.json({
	      			status: '1',
	      			msg: err.massage,
	      			result: ''
	      		})
	      	}else {
	      		if(doc.orderList) {
	      			if(doc.orderList.length > 0) {
	      				var orderTotal = 0;
	      				doc.orderList.forEach((item) => {
	      					if(item.orderId == orderId) {
	      						orderTotal = item.orderTotal;
	      					}
	      				})
	      				if(orderTotal > 0) {
	      					res.json({
				      			status: '0',
				      			msg: '',
				      			result: {
				      				orderId: orderId,
				      				orderTotal: orderTotal
				      			}
				      		})
	      				}else {
	      					res.json({
				      			status: '1',
				      			msg: '查无此单',
				      			result: ''
				      		})
	      				}
	      			}else {
	      				res.json({
			      			status: '1',
			      			msg: '当前用户未创建订单',
			      			result: ''
			      		})
	      			}
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
});
module.exports = router;
