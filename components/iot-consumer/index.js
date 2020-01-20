const log4js = require('log4js')
const log = log4js.getLogger();

// env config variables
const port = process.env.PORT || 3000;
var socket_path = process.env.SOCKET_PATH || "/api/service-web/socket";
log.level = process.env.LOG_LEVEL || "trace";

// topic config
var topic_light = process.env.TOPIC_LIGHT || "iot-sensor/sw/light";
var topic_gps = process.env.TOPIC_GPS || "iot-sensor/sw/gps";
var topic_temperature = process.env.TOPIC_TEMPERATURE || "iot-sensor/sw/temperature";
var topic_vibration = process.env.TOPIC_VIBRATION || "iot-sensor/sw/vibration";

// MQTT connection
var mqtt_broker = process.env.MQTT_BROKER || "ws://broker-amq-mqtt-all-0-svc-rte-oschneid-amq.apps.ocp4.stormshift.coe.muc.redhat.com";
var mqtt_user = process.env.MQTT_USER || "iotuser";
var mqtt_password = process.env.MQTT_PASSWORD || "iotuser";

// threshold
const temperature_threshold = process.env.TEMPERATURE_THRESHOLD || 70.0;

// setup application 
var mqtt = require('mqtt')
const compression = require('compression');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
// const router = new express.Router();
const cors = require('cors');
const io = require('socket.io')(http, { origins: '*:*', path: socket_path });

// Middleware config
app.use(cors());
app.use(compression());

// var client  = mqtt.connect('mqtt://test.mosquitto.org')

var client = mqtt.connect(mqtt_broker, { username: mqtt_user, password: mqtt_password });

client.on('connect', function () {
    client.subscribe(topic_gps, function (err) {});
    client.subscribe(topic_temperature, function (err) {});
    client.subscribe(topic_vibration, function (err) {});
    client.subscribe(topic_light, function (err) {});
})

client.on('message', (topic, message) => {
    switch (topic) {
        case topic_gps:
            return handleGps(message);
        case topic_temperature:
            return handleTemperature(message);
        case topic_vibration:
            return handleVibration(message);
        case topic_light:
            return handleLight(message);
    }
    console.log('No handler for topic %s', topic)
})

function handleGps(message) {
    console.log('handleGps data %s', message);
    io.sockets.emit("gps-event", message);
}

function handleLight(message) {
    console.log('handleLight data %s', message);
    io.sockets.emit("light-event", message);
}

function handleTemperature(message) {
    console.log('handleTemperature data %s', message);
    io.sockets.emit("temperature-event", message);
    // check for temperature threshold
    var data = ab2str(message);
    const elements = data.split(',');
    if(Number(elements[2]) > temperature_threshold) {
        console.log('temperature alert!!!');
        io.sockets.emit("temperature-alert", message);
    }
}

function handleVibration(message) {
    console.log('handleVibration data %s', message);
    io.sockets.emit("vibration-event", message);
}

// convert ArrayBuffer to String
function ab2str(buf) {
    // return decoder.decode(new Uint8Array(buf));
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

async function onWebsocketConnection(socket) {
    log.trace("begin onWebsocketConnection socket.id=%s", socket.id);

        log.debug("Register callbacks");

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