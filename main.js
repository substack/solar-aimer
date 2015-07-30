var suncalc = require('suncalc')
var wsock = require('websocket-stream')
var ws = wsock('ws://' + location.host)
//var serial = require('webaudio-serial-tx');
//var port = serial({ baud: 9600, polarity: 1 });
//port.start();
// a adds altitude, d removes altitude
// s adds azimuth, w removes azimuth

var elems = {
  north: null, west: null, east: null, south: null,
  left: null, right: null
}
function show (key) {
  var elem = typeof key === 'string' ? elems[key] : key
  if (elem) elem.style.visibility = 'visible'
}
function hide (key) {
  var elem = typeof key === 'string' ? elems[key] : key
  if (elem) elem.style.visibility = 'hidden'
}

var load = require('load-svg')
load('/aim.svg', function (err, svg) {
  Object.keys(elems).forEach(function (key) {
    elems[key] = svg.getElementById(key)
    elems[key].style.visibility = 'hidden'
  })
  document.body.appendChild(svg)
  window.addEventListener('resize', onresize)
  onresize()

  function onresize () {
    if (window.innerWidth < window.innerHeight) {
      svg.setAttribute('width', window.innerWidth)
    }
    else {
      svg.setAttribute('height', window.innerHeight)
    }
  }
})

var state = {}

setInterval((function f () {
  navigator.geolocation.getCurrentPosition(onpos)
  return f
})(), 1000 * 60)

function onpos (pos) {
  var sun = suncalc.getPosition(
    new Date(pos.timestamp),
    pos.coords.latitude,
    pos.coords.longitude
  );
  state.sun = {
    azimuth: sun.azimuth * 180 / Math.PI,
    altitude: 90 - sun.altitude * 180 / Math.PI
  }
  update(state)
  //var azd = spos.azimuth * 180 / Math.PI + 270 - 360;
  //var alt = 90 - spos.altitude * 180 / Math.PI;
}

function update (state) {
  var a = 360 - state.orientation.alpha
  var b = state.orientation.beta
  var g = state.orientation.gamma
 
  var adist = Math.min(a, 360 - a)
  Object.keys(elems).forEach(hide)

  if (adist > 5 && a < 180) {
    show(elems.left)
  }
  else if (adist > 5 && a >= 180) {
    show(elems.right)
  }

  if (state.sun) {
    var bdiff = state.sun.altitude - b
    var bdist = Math.min(bdiff, 360 - bdiff)
    if (bdist > 5 && bdiff < 180) {
      show(elems.north)
    }
    else if (bdist > 5 && bdiff >= 180) {
      show(elems.south)
    }
  }

  if (state.sun) {
    var gdiff = state.sun.azimuth - g
    var gdist = Math.min(gdiff, 360 - gdiff)
    if (gdist > 5 && gdiff < 180) {
      show(elems.east)
    }
    else if (gdist > 5 && gdiff >= 180) {
      show(elems.west)
    }
  }
  //write(state)
}
function write (msg) {
  console.log(msg)
  ws.write(JSON.stringify(msg, null, 2) + '\n')
}
function abg (obj) {
  if (!obj) return {}
  return {
    alpha: obj.alpha,
    beta: obj.beta,
    gamma: obj.gamma
  }
}

window.addEventListener('deviceorientation', function (ev) {
  state.orientation = abg(ev)
  update(state)
})
window.addEventListener('devicemotion', function (ev) {
  state.motion = {
    acceleration: abg(ev.acceleration),
    accelerationIncludingGravity: abg(ev.accelerationIncludingGravity),
    rotationRate: abg(ev.rotationRate)
  }
  update(state)
})
