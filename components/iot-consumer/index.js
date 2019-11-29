var mqtt = require('mqtt')
const compression = require('compression');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const router = new express.Router();
const cors = require('cors');
const io = require('socket.io')(http, { origins: '*:*', path: '/api/service-web/socket' });

const port = process.env.PORT || 3000;
const log4js = require('log4js')
const log = log4js.getLogger();
log.level = process.env.LOG_LEVEL || "trace";
app.use(cors());
app.use(compression());


// var client  = mqtt.connect('mqtt://test.mosquitto.org')

var client = mqtt.connect('mqtt://broker-amq-mqtt.oschneid-iot.svc.cluster.local', { username: 'iotuser', password: 'iotuser' })

var topic_gps = "iot-ocp/sw/iottest/gps"
var topic_temperature = "iot-ocp/sw/iottest/temperature"
var topic_vibration = "iot-ocp/sw/iottest/vibration"

client.on('connect', function () {
    client.subscribe(topic_gps, function (err) {
    })
    client.subscribe(topic_temperature, function (err) {
    })
    client.subscribe(topic_vibration, function (err) {
    })
})

client.on('message', (topic, message) => {
    // console.log(topic);
    // console.log(JSON.stringify(message));
    switch (topic) {
        case topic_gps:
            return handleGps(message)
        case topic_temperature:
            return handleTemperature(message)
        case topic_vibration:
            return handleVibration(message)
    }
    console.log('No handler for topic %s', topic)
})

function handleGps(message) {
    console.log('handleGps data %s', message);
    io.sockets.emit("gps-event", message);
}

function handleTemperature(message) {
    console.log('handleTemperature data %s', message);
    io.sockets.emit("temperature-event", message);
}

function handleVibration(message) {
    console.log('handleVibration data %s', message);
    io.sockets.emit("vibration-event", message);
}

async function onWebsocketConnection(socket) {
    log.trace("begin onWebsocketConnection socket.id=%s", socket.id);

        log.debug("Register callbacks");

        socket.on('refresh-event', function() {
            // onRefreshEvent(socket);
        });
        socket.on('refresh-playlist', function() {
            // onRefreshPlaylist(socket);
        });

        socket.on('disconnect', function() {
            log.debug("Websocket disconnect...");
        });
}

io.on('connect', onWebsocketConnection);

setImmediate(async function () {
    try {
        http.listen(port, function () {
            log.info('listening on *: ' + port);
        });
    } catch (err) {
        log.fatal("!!!!!!!!!!!!!!!");
        log.fatal("init failed with err %s", err);
        log.fatal("Terminating now");
        log.fatal("!!!!!!!!!!!!!!!");
        process.exit(42);
    }
});