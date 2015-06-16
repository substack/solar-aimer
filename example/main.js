var suncalc = require('suncalc');

navigator.geolocation.getCurrentPosition(function (pos) {
    var spos = suncalc.getPosition(
        new Date(pos.timestamp),
        pos.coords.latitude,
        pos.coords.longitude
    );
    console.log(spos);
})
