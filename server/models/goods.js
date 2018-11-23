var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var productSchema = new Schema({
	"productId": String,
	"productName": String,
	"salePrice": Number,
	"productImage": String
});

module.exports = mongoose.model('Good', productSchema);
// 数据库中的集合名称,当我们对其添加数据时如果Good已经存在，则会保存到其目录下，如果未存在，则会创建goods集合，然后在保存数据。
// 默认情况下mongoose会根据我们传入的Model名字来生成collection名字，在上面的代码中就会生成名为goods(全为小写字母)的collection(集合);