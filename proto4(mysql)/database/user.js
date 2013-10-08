/*global exports,require*/

var connection = require('./connection.js').connection;

exports.login = function (req, res, next) {
	var email = req.body.email,
	    password = req.body.password,
	    stmt = 'SELECT * from user_info where email=? and password=?';
	
	connection.query(stmt, [email, password], function (err, rows, fields) {
		if (err) {
			throw new Error(err);
		} else {
			if (rows.length === 1) {
				res.locals.result = true;
			}
		}
		next();
	});
};

exports.join = function (req, res, next) {
	var userInfo = req.body;
	delete userInfo.passwordCheck;
	connection.query('INSERT INTO user_info SET ?', userInfo, function (err, result) {
		if (err) {
			console.error(err);
			res.locals.err = err;
		}
		next();
	});
};

exports.findPassword = function (req, res, next) {
	var email = req.body.email,
		stmt = 'SELECT password from user_info where email=?';
	
	connection.query(stmt, [email], function (err, rows, fields) {
		if (err) {
			console.error(err);
			res.locals.err = err;
		} else {
			res.locals.result = rows.length > 0 ? rows[0].password : false;
			res.locals.email = email;
		}
		next();
	});
};

exports.checkDuplicateEmail = function (req, res, next) {
	var value = req.query.email,
		stmt = 'SELECT count(*) AS count FROM user_info where email=?';
	
	connection.query(stmt, [value], function (err, rows, fields) {
		if (err) {
			throw new Error(err);
		} else {
			console.dir(rows);
			res.locals.count = rows[0].count;
		}
		next();
	});
};
