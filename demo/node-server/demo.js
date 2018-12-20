const user = require('./user');

console.log(`userName:${user.userName}`);
console.log(`I am ${user.userName} : ${user.sayHello()}`);

const http = require('http');
const url = require('url');
const util = require('util');

http.createServer((req,res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type','text/plain; charset=utf-8');
	console.log("url"+ req.url);
	console.log(`parse:${url.parse(req.url)}`)
	console.log(`inspect:${util.inspect(url.parse(req.url))}`)
	res.end(util.inspect(url.parse('http://localhost:3000/demo.html?id=2#lll')));
}).listen(3000,'localhost',() => {
	console.log("服务器已运行，请打开浏览，输入：http:localhost:3000/ 来访问")
})