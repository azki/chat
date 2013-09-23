/*jslint regexp:false,nomen:false,white:false*/
/*global exports,require,process,__dirname*/

var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server, {
    log: true
});
server.listen(12345);
app.get('/', function(req, res){
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.header('Content-Type', 'text/html');
    fs.readFile(__dirname + '/index.html', function(err, data){
        if (err) {
            console.log('cannot read html file', err);
            return;
        }
        res.end(data);
    });
});
app.get('/chat.js', function(req, res){
    res.header('Content-Type', 'application/x-javascript');
    fs.readFile(__dirname + '/io.js', function(err, data1){
        if (err) {
            console.log('cannot read io.js file', err);
            return;
        }
        fs.readFile(__dirname + '/ui.js', function(err, data2){
            if (err) {
                console.log('cannot read ui.js file', err);
                return;
            }
            res.send([data1, data2].join("\n"));
        });
    });
});

var socketMap = {};

function broadcast(name, value){
    for (var id in socketMap) {
        if (socketMap.hasOwnProperty(id)) {
            try {
                socketMap[id].emit(name, value);
            } 
            catch (err) {
                console.error("webSockets emit error", err);
            }
        }
    }
}

io.of('/chat').on('connection', function(socket){
    var sockId = socket.id, addr = socket.handshake.address.address;
    socketMap[sockId] = socket;
    broadcast('join', {
        writer: addr
    });
    socket.on('msg', function(msg){
        broadcast('msg', {
            writer: addr,
            text: msg.text
        });
    });
    socket.on('disconnect', function(){
        delete socketMap[sockId];
        broadcast('leave', {
            writer: addr
        });
    });
});
