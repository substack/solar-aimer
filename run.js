var Serial = require('serialport').SerialPort;
var serial = new Serial('/dev/ttyUSB0', { baudrate: 9600 });

process.once('exit', reset);
process.stdin.setRawMode(true);

process.stdin.on('data', function (buf) {
    if (buf[0] === 3 || buf[0] === 4) process.exit();
    if (buf[0] === 0x20) {
        serial.write(' ');
    }
    else if (buf[0] === 0x1b && buf[1] === 0x5b && buf[2] === 0x41) {
        serial.write('F')
    }
    else if (buf[0] === 0x1b && buf[1] === 0x5b && buf[2] === 0x42) {
        serial.write('B')
    }
});
process.stdin.resume();

function reset () {
    process.stdin.setRawMode(false);
}
