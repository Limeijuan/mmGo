const http = require('http');

http.get('http://www.v5kf.com/public/api_dkf/get_chat_siteinfo?sid=148176&aid=242d00302bec5&channel=web', (res) => {
	let datas = '';

	res.on('data', (chunk) => {
		datas += chunk;
	});

	res.on('end', () => {
		let result = JSON.parse(datas);
		console.log(`result: ${result.state}`)
	})
})