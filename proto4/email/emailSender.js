/*global exports,require*/

var email = require('emailjs/email.js');

var emailServer = email.server.connect({
	user : "tempemailid01", 
    password : "chat12345678", 
    host : "smtp.gmail.com", 
    ssl : true
});

exports.send = function (to, data) {
	emailServer.send({
		text : "안녕 하세요. chat 관리자 입니다.\n 회원님의 비밀번호는  " + data + " 입니다.",
		from : "<tempemailid01@gmail.com>",
		to : to,
		cc : "",
		subject : "- chat 비밀번호 분실 안내 -" 
	}, function (err, message) {
		console.log(err || message);
	});
};


