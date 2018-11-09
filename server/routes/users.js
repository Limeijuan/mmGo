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
				// req.session.user = doc；
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
      			console.log(doc.cartList);
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


module.exports = router;
