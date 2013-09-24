/*jslint regexp:false,nomen:false,white:false*/
/*global exports,require,process,__dirname*/

var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, {
	log: true
});
server.listen(8080);
app.get('/', function(req, res) {
	res.header('Content-Type', 'text/html');
	fs.readFile(__dirname + '/index.html', function(err, data) {
		if (err) {
			console.log('Error loading index.html', err);
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
		res.writeHead(200);
		res.end(data);
	});
});
app.get('/chat.js', function(req, res) {
	res.header('Content-Type', 'application/x-javascript');
	fs.readFile(__dirname + '/io.min.js', function(err, data1) {
		if (err) {
			console.log('cannot read io.js file', err);
			res.writeHead(500);
			return res.end('Error loading chat.js');
		}
		fs.readFile(__dirname + '/ui.js', function(err, data2) {
			if (err) {
				console.log('cannot read ui.js file', err);
				res.writeHead(500);
				return res.end('Error loading chat.js');
			}
			res.writeHead(200);
			res.end([data1, data2].join("\n"));
		});
	});
});

var socketMap = {};

function broadcast(name, value) {
	for (var id in socketMap) {
		if (socketMap.hasOwnProperty(id)) {
			try {
				socketMap[id].emit(name, value);
			} 
			catch (err) {
				console.error("webSockets emit error", err);
			}
		}
	}
}

io.of('/chat').on('connection', function(socket) {
	var sockId = socket.id, addr = socket.handshake.address.address;
	console.log(new Date());
	console.log('onconnection', sockId);
	console.log('socket.handshake:', socket.handshake);
	socketMap[sockId] = socket;
	broadcast('join', {
		writer: addr
	});
	socket.on('disconnect', function() {
		console.log(new Date());
		console.log('ondisconnect', sockId);
		delete socketMap[sockId];
		broadcast('leave', {
			writer: addr
		});
	});
	
	socket.on('msg', function(msg) {
		if (!msg) { return; }
		broadcast('msg', {
			writer: addr,
			text: msg.text
		});
	});
});
