/*jslint regexp:false,nomen:false*/
/*global exports,require,__dirname,process*/

var fs = require('fs');
var email = require('../email/emailSender.js');
var path = {
	memberPath : __dirname + "/../data/member/",
	keyPath : __dirname + "/../data/keys/"
},
crypto = require('crypto');

exports.index = function (req, res) {
	res.render('index.html');
};

function registSessionLoginInfo(req, email) {
	req.session.email = email;
}

exports.login = function (req, res) {
	var fileName = crypto.createHash('md5').update(req.body.email).digest('hex') + ".json", 
		checkPassword = crypto.createHash('md5').update(req.body.password).digest('hex'), 
		userInfo, 
		result = {
			success : false,
			massage : ''
		};

	fs.readFile(path.memberPath + fileName, 'utf8', function (err, data) {
		if (err) {
			result.massage = "로그인에 실패하였습니다 확인하여 주시기 바랍니다.";
			res.send(result);
		} else {
			userInfo = JSON.parse(data);
			if (userInfo.password === checkPassword) {
				registSessionLoginInfo(req, userInfo.email);
				result.success = true;
				res.send(result);
			}
		}
	});
};

exports.join = function (req, res) {
	var fileName = crypto.createHash('md5').update(req.body.email).digest('hex') + ".json", 
		userInfo = {
			email : req.body.email,
			password : crypto.createHash('md5').update(req.body.password).digest('hex'),
			keys : []
		}, 
		result = {
			message : '',
			success : false
		};

	fs.readFile(path.memberPath + fileName, 'utf8', function (err, data) {
		if (err) {
			fs.writeFile(path.memberPath + fileName, JSON.stringify(userInfo), function (err) {
				if (err) {
					result.message = '가입할 수 업습니다.';
					res.send(result);
				} else {
					result.success = true;
					registSessionLoginInfo(req, userInfo.email);
					res.send(result);
				}
			});
		} else {
			result.message = '이미 존재하는 email입니다.';
			result.success = false;
			res.send(result);
		}
	});
};

exports.findPassword = function (req, res) {
	var fileName = crypto.createHash('md5').update(req.body.email).digest('hex') + ".json", 
		result = {
			success : false,
			message : ''
		};

	fs.readFile(path.memberPath + fileName, 'utf8', function (err, data) {
		if (err) {
			result.message = '가입되지 않은 회원이거나 입력정보가 옳바르지 않습니다.';
			res.send(result);
		} else {
			email.send(req.body.email, req.body.email);
			result.success = true;
			result.message = '회원님의 비밀번호를 email 로 전송하였습니다.';
			res.send(result);
		}
	});
};

exports.checkDuplicateEmail = function (req, res) {
	var fileName = crypto.createHash('md5').update(req.query.email).digest('hex') + ".json", 
		result = true;
	
	fs.readFile(path.memberPath + fileName, 'utf8', function (err, data) {
		if (err) {
			res.send(result);
		} else {
			result = false;
			res.send(result);
		}
	});
};

exports.getKey = function (req, res) {
	var email = req.body.email, 
		keysInfo = [], 
		keyInfo, 
		fileName = crypto.createHash('md5').update(email).digest('hex') + ".json", 
		userInfo,
		data;

	fs.readFile(path.memberPath + fileName, 'utf8', function (err, data) {
		if (err) {
			res.send(false);
		} else {
			userInfo = JSON.parse(data);
			for (var i in userInfo.keys ) {
				if (userInfo.keys.hasOwnProperty(i)) {
					fileName = userInfo.keys[i] + '.json';
					data = fs.readFileSync(path.keyPath + fileName, 'utf8');
					keyInfo = JSON.parse(data);
					keysInfo.push({
						key : userInfo.keys[i],
						domain : keyInfo.domain
					});
				}
			}
			res.send(keysInfo);
		}
	});

};

exports.saveKey = function (req, res) {
	var email = req.body.email, 
		domain = req.body.domain, 
		key = crypto.createHash('md5').update(domain).digest('hex'), 
		memberFile = crypto.createHash('md5').update(email).digest('hex') + ".json", 
		keyInfo = {
			domain : domain,
			user_getter : '',
			skin : ''
		},
		userInfo,
		result  = {
			key : '',
			success : false,
			massage : ''
		};

	fs.readFile(path.memberPath + memberFile, 'utf8', function (err, data) {
		if (err) {
			result.massage = '존재하지 않는 사용자 입니다.';
			res.send(result);
			return;
		} else {
			userInfo = JSON.parse(data);
			for (var i in userInfo.keys) {
				if (userInfo.keys[i] === key) {
					result.massage = '중복되는 도메인입니다. 확인하여주시기 바랍니다.';
					res.send(result);
					return;
				}
			}
			userInfo.keys.push(key);
			fs.writeFile(path.memberPath + memberFile, JSON.stringify(userInfo), function (err) {
				if (err) {
					result.massage = '키등록에 실패하였습니다. 다시 시도해주시기 바랍니다.';
					console.log(err);
					res.send(result);
					return;
				} else {
					console.log('member에 키등록');
				}
			});
			result.success = true;
			result.key = key;
			fs.writeFile(path.keyPath + key + ".json", JSON.stringify(keyInfo), function (err) {
				if (err) {
					result.massage = '키등록에 실패하였습니다. 다시 시도해주시기 바랍니다.';
					console.log(err);
					res.send(result);
				} else {
					result.massage = 'key 등록 완료 ';
					console.log('key 등록 완료 ');
					res.send(result);
				}
			});
		}
	});
};

exports.logout = function (req, res) {
	delete req.session.email;
	res.send(true);
};

