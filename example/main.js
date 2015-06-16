var suncalc = require('suncalc');
var inspect = require('object-inspect');
var wsock = require('websocket-stream');
var ws = wsock('ws://' + location.host);

navigator.geolocation.watchPosition(function (pos) {
    var spos = suncalc.getPosition(
        new Date(pos.timestamp),
        pos.coords.latitude,
        pos.coords.longitude
    );
    log(spos);
    if (typeof pos.coords.heading === 'number' && !isNaN(pos.coords.heading)) {
        var azd = spos.azimuth * 180 / Math.PI;
        var raz = spos.coords.heading - azd;
        log('raz=', raz);
    }
});

function log () {
    console.log.apply(console, arguments);
    
    var msg = [];
    for (var i = 0; i < arguments.length; i++) {
        msg.push(inspect(arguments[i]));
    }
    ws.write(msg.join(' ') + '\n');
}
