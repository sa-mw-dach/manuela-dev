import { WebsocketService } from './../providers/websocket.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as HighCharts from 'highcharts';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public items: Array<{ title: string; note: string; icon: string }> = [];

  subscriptions: Subscription[] = [];
  decoder = new TextDecoder("utf-8");

  constructor(
    public websocketService: WebsocketService
  ) {
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  plotDynamicSplineChart() {
    let myChart = HighCharts.chart('dynamicSpline', {
      chart: {
        type: 'spline',
        animation: true, // don't animate in old IE
        marginRight: 10,
        events: {
          load: function () {

            // set up the updating of the chart each second
            var series = this.series[0];
            setInterval(function () {
              var x = (new Date()).getTime(), // current time
                y = Math.random();
              series.addPoint([x, y], true, true);
            }, 1000);
          }
        }
      },

      time: {
        useUTC: false
      },

      title: {
        text: 'Sensor Vibration'
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
      },
      yAxis: {
        title: {
          text: 'Value'
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
      },
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      series: [{
        name: 'Random data',
        type: undefined,
        data: (function () {
          // generate an array of random data
          var data = [],
            time = (new Date()).getTime(),
            i;

          for (i = -19; i <= 0; i += 1) {
            data.push({
              x: time + i * 1000,
              y: Math.random()
            });
          }
          return data;
        }())
      }]

    });
  }

  private ab2str(buf) {
    return this.decoder.decode(new Uint8Array(buf));
  }

  ionViewDidEnter() {
    this.plotDynamicSplineChart();
  }

  tempData = [];

  ngOnInit() {
    console.log('init websocketService');
    this.websocketService.init(null);

    let sub = this.websocketService.observeGpsEvents().pipe().subscribe(data => {
      console.debug(`received observeGpsEventsn: `, this.ab2str(data));
    });
    this.subscriptions.push(sub);

    sub = this.websocketService.observeTemperatureEvents().pipe().subscribe(data => {
      console.debug(`received observeTemperatureEvents: `, this.ab2str(data));
      let tmp = this.ab2str(data);
      let elements = tmp.split(',');
      this.tempData.push(elements[1]);
      console.log(this.tempData);
    });
    this.subscriptions.push(sub);

    sub = this.websocketService.observeVibrationEvents().pipe().subscribe(data => {
      console.debug(`received observeVibrationEvents: `, this.ab2str(data));
    });
    this.subscriptions.push(sub);

    /*
    this.intervalHandle = setInterval(() => {
      this.isConnected = this.websocketService.isConnected();
    }, 2500);
    */
  }

  ngOnDestroy() {
    console.debug('Playlist page destroy');
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
    this.websocketService.disconnect();
  }

}
