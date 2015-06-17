var split = require('split2');
var through = require('through2');

var ecstatic = require('ecstatic');
var st = ecstatic(__dirname);

var http = require('http');
var target = { x: 0, y: 0, z: 0 };

var server = http.createServer(function (req, res) {
    var parts = req.url.split('/').slice(1);
    if (/^(x|y|z)$/.test(parts[0]) && parts[1]) {
        target[parts[0]] = Number(parts[1]);
        res.end('ok\n');
    }
    else if (req.url === '/target') {
        res.end(JSON.stringify(target) + '\n');
    }
    else st(req, res)
});
server.listen(8080);

var Serial = require('serialport').SerialPort;
var serial = new Serial('/dev/ttyUSB0', { baudrate: 9600 });

var wsock = require('websocket-stream');
var last = {};

wsock.createServer({ server: server }, function (stream) {
    stream.on('error', function () {});
    var sp = split(JSON.parse)
    sp.once('error', function () { stream.destroy() });
    stream.pipe(sp).pipe(through.obj(function (row, enc, next) {
        last[row[0]] = row;
        console.log(row);
        next();
    }));
});

setInterval(function () {
    if (!last.orientation) return;
    
    var a = target.x;
    var b = last.orientation[1];
    
    if (a > b) {
        serial.write('F');
    }
    else {
        serial.write('B');
    }
}, 200);
