const http = require('http');
const url = require('url');
const util = require('util');

const fs = require('fs');

http.createServer((req,res) => {
	res.statusCode = 200;
	// res.setHeader('Content-Type','text/plain; charset=utf-8');

	var pathName = url.parse(req.url).pathname;
	console.log(url.parse(req.url).pathname);
	fs.readFile(pathName.substring(1), (err, data) => {
		if(err) {
			res.writeHead(404,{
				'Content-type':'text/html'
			});
		}else {
			res.writeHead(200,{
				'Content-type':'text/html'
			});
			res.write(data.toString());
		}

		res.end();
	});

}).listen(3000,'localhost',() => {
	console.log("服务器已运行，请打开浏览，输入：http:localhost:3000/ 来访问");
})