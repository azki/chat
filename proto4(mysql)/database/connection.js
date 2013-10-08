/*global exports,require,getConnection*/

var mysql = require('mysql');

exports.connection = getConnection('dev');

function getConnection(env) {
    // 개발
    var dev = {
    	host : 'localhost',
        user : 'root',
        password : 'root',
        database : 'chat'
    },
    prd = {
        host : 'localhost',
        user : 'root',
        password : 'root',
        database : 'chat'
    },
    property = env === 'dev' ? dev : prd;
    return mysql.createConnection(property);
}

