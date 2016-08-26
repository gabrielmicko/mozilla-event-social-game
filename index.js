var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var fs = require('fs');
var randomstring = require('randomstring');
var qr = require('qr-image');

function getRS() {
	return randomstring.generate({
	  length: 12,
	  charset: 'alphabetic'
	});
}

app.use(bodyParser.json({
	'limit': '50mb'
}));

app.use(bodyParser.urlencoded({
  'extended': true,
	'limit': '50mb'
}));

app.use(express.static('public'));

app.get('/result', function(req, resp) {
	resp.sendFile(__dirname + '/public/result.html');
});

app.get('*', function(req, resp) {
	resp.sendFile(__dirname + '/public/index.html');
});

app.post('/savecanvas', function(req, resp) {
	var base64Data = req.body.canvas.replace(/^data:image\/png;base64,/, "");
	var randomString = getRS();

	fs.writeFile('./public/img/generated/pic/' + randomString + '.png', base64Data, 'base64', function(err) {
		var qr_svg = qr.image('https://mozilla.webrtc.rocks/img/generated/pic/' + randomString + '.png', { type: 'svg' });
		qr_svg.pipe(fs.createWriteStream('./public/img/generated/qr/' + randomString + '.svg'));
		resp.send({
			'hash': randomString,
		});
	});
});
app.listen(3000, function () {
  console.log('Running Mozilla VR Social plugin on port 3000!');
});
