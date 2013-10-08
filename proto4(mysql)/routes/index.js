/*global require, exports */

var email = require('../email/emailSender.js');

exports.index = function (req, res) {
	res.render('index.html');
};

exports.login = function (req, res) {
	var result = false;
	if (res.locals.result) {
		//registSession(req, res);
		result = true;
	}
	res.send(result);
};

exports.join = function (req, res) {
	if (res.locals.err) {
		res.send(res.locals.err);
	} else {
		res.render('index.html');
	}
};

exports.findPassword = function (req, res) {
	var to = res.locals.email,
		result = res.locals.result;

	if (result) {
		email.send(to, result);
		res.send('회원님의 비밀번호를 email 로 전송하였습니다.');
	} else {
		res.send('가입되지 않은 회원이거나 입력정보가 옳바르지 않습니다.');
	}
};

exports.checkDuplicateEmail = function (req, res) {
	var result = false;
	if (parseInt(res.locals.count, 10) === 0) {
		result = true;
	}
	res.send(result);
};

//파일저장 
exports.aa = function (req, res) {
	var fs = require('fs');
	fs.writeFile("../file/abcd", "Hey there!", function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("The file was saved!");
		}
	});
};
