var suncalc = require('suncalc');
var wsock = require('websocket-stream');
var ws = wsock('ws://' + location.host);

window.addEventListener('deviceorientation', function (ev) {
    write(['orientation',ev.alpha,ev.beta,ev.gamma]);
});

setInterval(check, 5000);
function check () {
    navigator.geolocation.getCurrentPosition(onpos);
}

function onpos (pos) {
    var spos = suncalc.getPosition(
        new Date(pos.timestamp),
        pos.coords.latitude,
        pos.coords.longitude
    );
    /*
    if (typeof pos.coords.heading === 'number' && !isNaN(pos.coords.heading)) {
        var azd = spos.azimuth * 180 / Math.PI;
        var raz = spos.coords.heading - azd;
        log('raz=', raz);
    }
    */
    write(['sun',spos.azimuth,spos.altitude]);
}

function write (msg) {
    console.log(msg);
    ws.write(JSON.stringify(msg) + '\n');
}
