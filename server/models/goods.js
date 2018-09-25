var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productSchema = new Schema({
	"commodityId": String,
	"commodityName": String,
	"commodityPrice": Number,
	"commodityImg": String
});