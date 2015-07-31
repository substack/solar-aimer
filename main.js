var suncalc = require('suncalc')
//var wsock = require('websocket-stream')
//var ws = wsock('ws://' + location.host)
var serial = require('webaudio-serial-tx');
var port = serial({ baud: 9600, polarity: 1 });
port.start();

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
load('aim.svg', function (err, svg) {
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

var last = -1
function update (state) {
  if (Date.now() - last < 1000) return
  last = Date.now()
 
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
    // a adds altitude, d removes altitude
    if (bdist > 5 && bdiff < 180) {
      show(elems.north)
      send('a')
    }
    else if (bdist > 5 && bdiff >= 180) {
      show(elems.south)
      send('d')
    }
  }

  if (state.sun) {
    var gdiff = state.sun.azimuth - g
    var gdist = Math.min(gdiff, 360 - gdiff)
    // s adds azimuth, w removes azimuth
    if (gdist > 5 && gdiff < 180) {
      show(elems.east)
      send('s')
    }
    else if (gdist > 5 && gdiff >= 180) {
      show(elems.west)
      send('w')
    }
  }
  //write(state)
}

function send (c) {
  port.write(Array(10+1).join(c))
}

function write (msg) {
  console.log(msg)
  //ws.write(JSON.stringify(msg, null, 2) + '\n')
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
