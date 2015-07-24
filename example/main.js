var suncalc = require('suncalc');
var wsock = require('websocket-stream');
var ws = wsock('ws://' + location.host);
var serial = require('webaudio-serial-tx');
var port = serial({ baud: 9600, polarity: 1 });
port.start();

var ori;
window.addEventListener('deviceorientation', function (ev) {
  ori = ev;
});
var times = 6;

setInterval(check, 1000);
function check () {
    navigator.geolocation.getCurrentPosition(onpos);
}

function onpos (pos) {
  var spos = suncalc.getPosition(
    new Date(pos.timestamp),
    pos.coords.latitude,
    pos.coords.longitude
  );
  var azd = spos.azimuth * 180 / Math.PI + 90;
  var alt = spos.altitude * 180 / Math.PI;
  
  //write([ 'azd=', azd, 'alt=', alt ]);
  //write([ 'ora=', ori.alpha, 'orb=', ori.beta ]);
  //write([ 'da=', azd - ori.alpha, 'db=', alt - ori.beta ]);
  show(
    'AZI:' + (azd - ori.alpha) + '\n'
    + 'ALT:' + (alt - ori.beta) + '\n'
  );
  
  if (Math.abs(azd - ori.alpha) < 5) {
    // within 5 deg
    write([ 'AZD 0' ]);
  }
  else if (azd < ori.alpha) {
    write([ 'W:', azd, ori.alpha ]);
    port.write(Array(times+1).join('w'));
  }
  else {
    write([ 'S:', azd, ori.alpha ]);
    port.write(Array(times+1).join('s'));
  }
  
  if (Math.abs(alt - ori.beta) < 5) {
    // within 5 deg
    write([ 'ALT 0' ]);
  }
  else if (alt < ori.beta) {
    write([ 'A:', alt, ori.beta ]);
    port.write(Array(times+1).join('a'));
  }
  else {
    write([ 'D:', alt, ori.beta ]);
    port.write(Array(times+1).join('d'));
  }
}

var pre = document.createElement('pre');
document.body.appendChild(pre);

function show (msg) {
  pre.textContent = msg;
}

function write (msg) {
  console.log(msg);
  ws.write(JSON.stringify(msg) + '\n');
}
