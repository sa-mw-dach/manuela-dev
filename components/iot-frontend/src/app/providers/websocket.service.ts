import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable()
export class WebsocketService {

    // Our socket connection
    private socket = null;

    constructor(private confService: ConfigService) {}

    // TODO: Add "query" parameter with event ID to be received by server:
    init(eventID: string) {
        console.debug('init ws -> eventID=%s', eventID);

        // Use /event/<EventID> as socket.io Namespace, which must be added to host parameter:
        const hostStr = this.confService.websocketHost; // + '/event/' + eventID;
        const pathStr = this.confService.websocketPath;
        console.debug('create ws host=%s, path=%s', hostStr, pathStr);

        this.socket = io(hostStr, {
            reconnectionAttempts: Infinity,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            randomizationFactor: 0.5,
            timeout: this.confService.SERVER_TIMEOUT,
            path: pathStr
        });

        this.socket.on('connect', (socket) => {
            console.debug('connected!');
        });

        console.debug('init(): connect');
        this.connect();
    }

    observeNttValuesEvents() {
        console.debug('observeNttValuesEvents');
        const observable = new Observable(observer => {
            this.socket.on('ntt-values', (data) => {
                // console.debug('gps-event -> Received gps sensor data');
                observer.next(data);
            });
        });
        return observable;
    }

    observeNttAlarmEvents() {
        console.debug('observeNttAlarmEvents');
        const observable = new Observable(observer => {
            this.socket.on('ntt-alarm', (data) => {
                // console.debug('gps-event -> Received gps sensor data');
                observer.next(data);
            });
        });
        return observable;
    }

    observeGpsEvents() {
        console.debug('observeGpsEvents');
        const observable = new Observable(observer => {
            this.socket.on('gps-event', (data) => {
                // console.debug('gps-event -> Received gps sensor data');
                observer.next(data);
            });
        });
        return observable;
    }

    observeLightEvents() {
        console.debug('observeLightEvents');
        const observable = new Observable(observer => {
            this.socket.on('light-event', (data) => {
                // console.debug('light-event -> Received light sensor data');
                observer.next(data);
            });
        });
        return observable;
    }

    observeVibrationEvents() {
        console.debug('observeVibrationEvents');
        const observable = new Observable(observer => {
            this.socket.on('vibration-event', (data) => {
                // console.debug('vibration-event -> Received vibration sensor data');
                observer.next(data);
            });
        });
        return observable;
    }

    observeTemperatureEvents() {
        console.debug('observeTemperatureEvents');
        const observable = new Observable(observer => {
            this.socket.on('temperature-event', (data) => {
                // console.debug('temperature-event -> Received temperature sensor data');
                observer.next(data);
            });
        });
        return observable;
    }

    observeTemperatureAlerts() {
        console.debug('observeTemperatureAlerts');
        const observable = new Observable(observer => {
            this.socket.on('temperature-alert', (data) => {
                // console.debug('temperature-alert -> Received sensor temperature event');
                observer.next(data);
            });
        });
        return observable;
    }

    observeVibrationAlerts() {
        console.debug('observeTemperatureAlerts');
        const observable = new Observable(observer => {
            this.socket.on('vibration-alert', (data) => {
                // console.debug('vibration-alert -> Received sensor vibration event');
                observer.next(data);
            });
        });
        return observable;
    }

    isConnected() {
        return this.socket.connected;
    }

    disconnect() {
        console.info('disconnect');
        return this.socket.disconnect();
    }

    connect() {
        console.info('connect');
        return this.socket.connect();
    }

}
