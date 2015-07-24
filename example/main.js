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
var times = 20;

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
  var azd = spos.azimuth * 180 / Math.PI + 270 - 360;
  var alt = 90 - spos.altitude * 180 / Math.PI;
  
  //write([ 'azd=', azd, 'alt=', alt ]);
  //write([ 'ora=', ori.alpha, 'orb=', ori.beta ]);
  //write([ 'da=', azd - ori.alpha, 'db=', alt - ori.beta ]);
  var dazi = azd - ori.alpha;
  var dalt = alt - ori.beta;
  
  while (dazi < -180) dazi += 360;
  while (dazi > 360) dazi -= 360;
  
  show('AZI:' + dazi + '\n' + 'ALT:' + dalt + '\n');
  
  // a adds altitude, d removes altitude
  if (Math.abs(dalt) < 2) {
    // within 5 deg
  }
  else if (dalt < 0) {
    port.write(Array(times+1).join('a'));
  }
  else if (dalt > 0) {
    port.write(Array(times+1).join('d'));
  }
  
  // s adds azimuth, w removes azimuth
  if (Math.abs(dazi) < 2) {
    // within 5 deg
  }
  else if (dazi < 0) {
    port.write(Array(times+1).join('s'));
  }
  else if (dazi > 0) {
    port.write(Array(times+1).join('w'));
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
