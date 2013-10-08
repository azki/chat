/*global exports,require*/

var email = require('emailjs/email.js');

var emailServer = email.server.connect({
	user : "memchat@azki.org", 
    password : "apacot12", 
    host : "smtp.gmail.com", 
    ssl : true
});

exports.send = function (to, url) {
	emailServer.send({
		text : "안녕 하세요. chat 관리자 입니다.\n 이곳에 접속하여 비밀번호를 변경하시기 바랍니다." + url + " 입니다.",
		from : "<tempemailid01@gmail.com>",
		to : to,
		cc : "",
		subject : "- chat 비밀번호 분실 안내 -" 
	}, function (err, message) {
		console.log(err || message);
	});
};


