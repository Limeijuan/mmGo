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
	"addressList": [{
		"addressId" : String,
        "userName" : String,
        "streetName" : String,
        "postCode" : String,
        "tel" : String,
        "isDefault" : Boolean
	}]
});

module.exports = mongoose.model('User', userSchema, 'user');
