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

    observeGpsEvents() {
        console.debug('observeGpsEvents');
        const observable = new Observable(observer => {
            this.socket.on('gps-event', (data) => {
                console.debug('gps-event -> Received playlist update');
                observer.next(data);
            });
        });
        return observable;
    }

    observeVibrationEvents() {
        console.debug('observeVibrationEvents');
        const observable = new Observable(observer => {
            this.socket.on('vibration-event', (data) => {
                console.debug('vibration-event -> Received event update');
                observer.next(data);
            });
        });
        return observable;
    }

    observeTemperatureEvents() {
        console.debug('observeTemperatureEvents');
        const observable = new Observable(observer => {
            this.socket.on('temperature-event', (data) => {
                console.debug('temperature-event -> Received event update');
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