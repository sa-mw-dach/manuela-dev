import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    websocketHost;
    websocketPath;
    SERVER_TIMEOUT = 1000;

    constructor(public http: HttpClient) {}

    async loadConfigurationData() {
        console.debug('loadConfigurationData');

        const data = await this.http.get<any>('conf/config.json').toPromise();

        console.debug('App config loaded: ' + JSON.stringify(data));
        this.websocketHost = data.websocketHost;
        this.websocketPath = data.websocketPath;
        this.SERVER_TIMEOUT = data.SERVER_TIMEOUT;
    }

}