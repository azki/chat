/**
 * Module dependencies.
 */

var express = require('express'), 
    routes = require('./routes'), 
    http = require('http'), 
    path = require('path'), 
    fs = require('fs'), 
    app = express(), 
    server = http.createServer(app), 
    socket = require('./socket/socket.js');

//소캣 초기화 
socket.init(server);

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
app.configure('development', function() {
	app.use(express.errorHandler());
});

//처음 메인
app.get('/', routes.index);

//채팅 접속
app.get('/chat', routes.chat);
app.get('/test', routes.test);

//아이디 확인
app.get('/checkId', routes.checkId);

//방만들기 관련 
app.get('/makeRoom', routes.makeRoom);
app.get('/cancle', routes.roomChat);
app.get('/make', routes.make);
app.get('/joinRoom', routes.joinRoom);

server.listen(3000, function() {
	console.log("Express server listening on port 3000 ");
});
