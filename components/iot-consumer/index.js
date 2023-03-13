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
// var mqtt_broker = process.env.MQTT_BROKER || "ws://broker-amq-mqtt-all-0-svc";
var mqtt_broker = process.env.MQTT_BROKER || "ws://broker-amq-mqtt-all-0-svc-rte-iotdemo.apps-crc.testing";

var mqtt_user = process.env.MQTT_USER || "iotuser";
var mqtt_password = process.env.MQTT_PASSWORD || "iotuser";

// threshold
const temperature_threshold = process.env.TEMPERATURE_THRESHOLD || 70.0;

const temperature_alert_enabled = ((process.env.TEMPERATURE_ALERT_ENABLED || "false") === 'true');
const vibration_alert_enabled = ((process.env.VIBRATION_ALERT_ENABLED || "false") === 'true');
const vibration_anomaly_enabled = ((process.env.VIBRATION_ANOMALY_ENABLED || "false") === 'true');
const anomaly_detection_url = process.env.ANOMALY_DETECTION_URL || 'http://anomaly-detection-anomaly-detection';
const anomaly_detection_rhods = ((process.env.ANOMALY_DETECTION_RHODS || "false") === 'true');

// setup application
var mqtt = require('mqtt')
const compression = require('compression');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
// const router = new express.Router(vibration_alert_enabled);
const cors = require('cors');
const io = require('socket.io')(http, { origins: '*:*', path: socket_path });
const request = require('request-promise');

// Middleware config
app.use(cors());
app.use(compression());

// health check
app.use('/health', async (_req, res, _next) => {
	const healthcheck = {
		uptime: process.uptime(),
		message: 'OK',
		timestamp: Date.now()
	};
	try {
		res.send(healthcheck);
	} catch (e) {
		healthcheck.message = e;
		res.status(503).send(healthcheck);
	}
});

// var client  = mqtt.connect('mqtt://test.mosquitto.org')

console.log('connecting to ', mqtt_broker);

var client = mqtt.connect(mqtt_broker, { username: mqtt_user, password: mqtt_password });

client.on('connect', function () {
    console.log('connected');
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



// Anomaly Detection

const episode_length = 5
var last_value_array_map = {};

function get_list_last_values(id, value) {
  var array = [];

  if ( last_value_array_map[id] !== undefined) {
    array = last_value_array_map[id]
  }
  array.unshift(value); 

  if (array.length > episode_length) {
    array.pop()
  }
  last_value_array_map[id] = array;
  return array;
}



var last_value_map = {}; 
async function check_anomaly(id, value) {
    var result = false
    var edgeAnomaly = {}
    var anomaly_uri = anomaly_detection_url

    if (vibration_anomaly_enabled) {
        // Call anomaly detection web service for specified pump
        console.log('Anomaly detection for: %s, Val: %d', id, value );

        l = get_list_last_values(id, value)
        
        if (l.length == episode_length) {

            if(!anomaly_detection_rhods) {
                edgeAnomaly = { "data": { "ndarray": [l] },"meta":{"device_metric":id}};
                anomaly_uri = anomaly_detection_url + '/api/v1.0/predictions'


            } else {
                edgeAnomaly = {
                    "inputs": [
                        { "name": "predict", 
                          "shape": [1, 5], 
                          "datatype": "FP32", 
                          "data": [l]
                        }
                    ]
                }
            }

                
            try {
                // console.log('*AD* ID: %s,  Val: %d', id, value );
                // console.log('edgeAnomaly: %s', JSON.stringify(edgeAnomaly));
                const edgeAnomalyResponse = await request({
                method: 'POST',
                uri: anomaly_uri,
                body: edgeAnomaly,
                json: true,
                timeout: 2000
                });
        
                // log.debug("Edge Anomaly Repsonse: " + JSON.stringify(edgeAnomalyResponse)); //DELETE
                // log.debug("Edge Anomaly Repsonse.data: " + JSON.stringify(edgeAnomalyResponse.data)); //DELETE
                // log.debug("Edge Anomaly Repsonse.outputs: " + JSON.stringify(edgeAnomalyResponse.outputs)); //DELETE
        
                if(!anomaly_detection_rhods) {
                    if ( parseInt(edgeAnomalyResponse["data"]["ndarray"][0]) == 1 ){
                    result = true;
                    } else {
                    result = false;
                    }
                } else {
                    if ( parseInt(edgeAnomalyResponse["outputs"][0]["data"][0]) == 1 ){
                        result = true;
                        } else {
                        result = false;
                        }                    
                }

            } catch (err) {
               log.error("check_anomaly failed", err)
            }

        } else {
            console.log('check_anomaly: not enought values for %s', id );
        }

    } else {
        // Basic internal anomaly check (Mock)

        if ( isNaN(last_value_map[id])) {
        result = false
        console.log('Last ID: %s,  Val: NO', id );
        } else {
            console.log('Last ID: %s,  Val: %d', id, last_value_map[id] );
            if (  value > 2 && value > (last_value_map[id] * 1.95) ) {
                result = true
            } else {
                result = false
            }
        }

        console.log('New  ID: %s,  Val: %d', id, value );
        last_value_map[id] = value;
    }
    return result;
}


function handleTemperature(message) {
    console.log('handleTemperature data %s', message);
    var data = ab2str(message);
    const elements = data.split(',');

    // Demo usecase:
    // - Somebody added an unnecessary Celsius in Fahrenheit conversion
    // - Fix it by commenting out the conversion from Celsius in Fahrenheit:

    
    var modifiedValue = (Number(elements[2]) * 9/5) + 32;
    var newData = data.replace(elements[2], modifiedValue);
    message = Buffer.from(newData, 'utf8');
   
  
    io.sockets.emit("temperature-event", message);

    // check for temperature threshold
    if(temperature_alert_enabled) {
        if(Number(elements[2]) > temperature_threshold) {
            console.log('temperature alert!!!');
            io.sockets.emit("temperature-alert", message);
        }
    }
}

async function handleVibration(message) {
    console.log('handleVibration data %s', message);
    io.sockets.emit("vibration-event", message);

    // check for vibration anomaly
    if(vibration_alert_enabled) {
        var data = ab2str(message);
        const elements = data.split(',');

        var id=elements[0]+elements[1]
        var value = parseFloat(elements[2])

        var ano = await check_anomaly(id,value)
        console.log('Ano: %s', ano);

        if(ano) {
            console.log('vibration alert!!!');
            io.sockets.emit("vibration-alert", message);
        }
    }

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