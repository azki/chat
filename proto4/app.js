/*jslint regexp:false,nomen:false*/
/*global exports,require,__dirname*/


//디렉토리 __dirname 오류가나는 것을 막지못하겠다.. 어떻게해야하지...?

var express = require('express'), 
    routes = require('./routes'), 
    http = require('http'), 
    path = require('path'), 
    fs = require('fs'), 
    app = express(),
    db = require('./database/user.js'), 
    server = http.createServer(app); 

//express관련 정의
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');
var ejs = require('ejs');
app.engine('.html', ejs.__express);
ejs.open = '<?';
ejs.close = '?>';
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

//개발 정의
app.configure('development', function () {
	app.use(express.errorHandler());
});

//처음 메인
app.get('/', routes.index);

//채팅 접속
app.post('/login', db.login, routes.login);
app.post('/join', db.join, routes.join);
app.post('/findPassword', db.findPassword, routes.findPassword);

app.get('/checkDuplicateEmail', db.checkDuplicateEmail, routes.checkDuplicateEmail);

app.get('/aa', routes.aa);

server.listen(3000, function () {
	console.log("Express server listening on port 3000 ");
});
