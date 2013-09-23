/*jslint regexp:false,nomen:false*/
/*global exports,require,process,__dirname*/

var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, {
	log: true
});
server.listen(12345);
app.get('/', function (req, res) {
	res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
	res.header('Pragma', 'no-cache');
	res.header('Expires', '0');
	res.header('Content-Type', 'text/html');
	fs.readFile(__dirname + '/index.html', function (err, data) {
		if (err) {
			console.log('cannot read html file', err);
			return;
		}
		res.end(data);
	});
});
app.get('/io.js', function (req, res) {
	res.header('Content-Type', 'application/x-javascript');
	fs.readFile(__dirname + '/io.js', function (err, data) {
		if (err) {
			console.log('cannot read js file', err);
			return;
		}
		res.end(data);
	});
});

//io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile']);
io.of('/socket').on('connection', function (socket) {
	var sockId = socket.id, addr = socket.handshake.address.address;
	console.log('hello');
	socket.emit('hello', 'hello');
	socket.on('hi', function (msg) {
		console.log('hi');
		socket.emit('hi', 'hi');
	});
});
