var ecstatic = require('ecstatic');
var st = ecstatic(__dirname);

var http = require('http');
var server = http.createServer(st);
server.listen(8080);

var wsock = require('websocket-stream');
wsock.createServer({ server: server }, function (stream) {
    stream.on('error', function () {});
    stream.pipe(process.stdout);
});
