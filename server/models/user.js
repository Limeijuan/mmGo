var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	"userId": String,
	"userName": String,
	"userPwd": String,
	"orderList": Array,
	"cartList": [{
		"productId": String,
		"productName": String,
		"salePrice": String,
		"productImage": String,
		"productNum": String,
		"checked": String
	}],
	"addressList": Array
});

module.exports = mongoose.model('user', userSchema, 'user_list');