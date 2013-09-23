/*
 * GET home page.
 */
var socket = require('../socket/socket.js');

exports.index = function(req, res) {
	res.render('index.html');
};

exports.test = function(req, res) {
	res.render('chat/test.html');
};

exports.chat = function(req, res) {
	res.render('chat/index.html');
};

exports.makeRoom = function(req, res) {
	res.render('chat/makeRoom.html');
};

exports.checkId = function(req, res) {
	if (!socket.connectUsers[req.query.id]) {
		res.send(true);
	} else {
		res.send(false);
	}
};

exports.joinRoom = function(req, res) {
	res.render('chat/chat.html');
}; 