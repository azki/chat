/*jslint regexp:false,nomen:false*/
/*global exports,require,__dirname,process*/


//디렉토리 __dirname 오류가나는 것을 막지못하겠다.. 어떻게해야하지...?

var express = require('express'), 
    routes = require('./routes'), 
    http = require('http'), 
    path = require('path'), 
    fs = require('fs'), 
    app = express(),
    server = http.createServer(app); 

//express관련 정의
app.configure(function () {
	app.set('port', process.env.PORT || 3000);
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
	app.use(express.cookieParser('keyboard cat'));
    app.use(express.session());
    app.use(express.static(path.join(__dirname, '/public')));
	app.use(function (req, res, next) {
		res.locals.session = req.session;
		next();
	});
	app.use(app.router);
});
//개발 정의
app.configure('development', function () {
	app.use(express.errorHandler());
});

//처음 메인
app.get('/', routes.index);

app.post('/login', routes.login);
app.post('/join', routes.join);
app.post('/findPassword', routes.findPassword);
app.post('/getKey', routes.getKey);
app.post('/saveKey', routes.saveKey);
app.post('/savePassword', routes.savePassword);

app.get('/checkDuplicateEmail', routes.checkDuplicateEmail);
app.get('/logout', routes.logout);
app.get('/changePassword', routes.changePassword);

server.listen(3000, function () {
	console.log("Express server listening on port 3000 ");
});
