import { WebsocketService } from './../providers/websocket.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import * as HighCharts from 'highcharts';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, OnDestroy {

  static temperatureData = [];
  static vibrationData = [];
  subscriptions: Subscription[] = [];
  decoder = new TextDecoder('utf-8');
  initData = [];
  myChart;

  constructor(
    public websocketService: WebsocketService,
    public toastController: ToastController
  ) {
      this.initData = [
      {x: 1576490068905, y: 57.53614202057015},
      {x: 1576490073920, y: 59.12077526534332},
      {x: 1576490078916, y: 60.63785172413473},
      {x: 1576490083905, y: 61.217594340554065},
      {x: 1576490088905, y: 62.99350430050431},
      {x: 1576490093902, y: 63.63078508969773},
      {x: 1576490098904, y: 64.08698690678989},
      {x: 1576490103913, y: 64.33692665621716}
      ];
  }

  plotDynamicSplineChart() {
    this.myChart = HighCharts.chart('dynamicSpline', {
      chart: {
        type: 'areaspline',
        animation: true, // don't animate in old IE
        marginRight: 10,
        events:  {
          load: function () {
            const series = this.series[0];
            const series1 = this.series[1];
            setInterval(function() {
               if (ListPage.temperatureData.length > 0) {
                // series.addPoint(ListPage.temperatureData[ListPage.temperatureData.length - 1], true, true);
                series.setData(ListPage.temperatureData, true, true, true);
               }
               if (ListPage.vibrationData.length > 0) {
                series1.setData(ListPage.vibrationData);
               }
            }, 1000);
          }
        }
      },

      time: {
        useUTC: false
      },

      title: {
        text: 'Sensor iot-78-tv'
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
        enabled: true
      },
      exporting: {
        enabled: false
      },
      plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: false
        }
      },
      series: [{
        name: 'temperature',
        type: undefined,
        data: this.initData
      },
      {
        name: 'vibration',
        type: undefined,
        data: this.initData
      }
      ]

    });
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Temperature ALERT!',
      message: 'Please take immediate action',
      position: 'top',
      color: 'danger',
      buttons: [
        {
          side: 'start',
          icon: 'snow',
          text: 'Start Cooling System',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
    console.debug('*** presentToastWithOption ');
  }

  // ArrayBuffer to String conversion
  private ab2str(buf) {
    return this.decoder.decode(new Uint8Array(buf));
  }

  ionViewDidEnter() {
    this.plotDynamicSplineChart();
  }

  ngOnInit() {
    console.log('init websocketService in  list.page.ts');
    this.websocketService.init(null);

    let sub = this.websocketService.observeGpsEvents().pipe().subscribe(data => {
      // console.debug(`received observeGpsEventsn: `, this.ab2str(data));
    });
    this.subscriptions.push(sub);

    sub = this.websocketService.observeTemperatureAlerts().pipe().subscribe(data => {
      this.presentToastWithOptions();
      console.debug('*** received observeTemperatureAlerts', this.ab2str(data));
    });
    this.subscriptions.push(sub);

    sub = this.websocketService.observeTemperatureEvents().pipe().subscribe(data => {
      // console.debug('received observeTemperatureEvents: ', this.ab2str(data));
      const tmp = this.ab2str(data);
      const elements = tmp.split(',');
      ListPage.temperatureData.push({
        x: new Date().getTime(),
        y: Number(elements[2])
      });
      // console.log(ListPage.temperatureData);
    });
    this.subscriptions.push(sub);

    sub = this.websocketService.observeVibrationEvents().pipe().subscribe(data => {
      // console.debug(`received observeVibrationEvents: `, this.ab2str(data));
      const tmp = this.ab2str(data);
      const elements = tmp.split(',');
      ListPage.vibrationData.push({
        x: new Date().getTime(),
        y: Number(elements[2])
      });
      // console.log(ListPage.vibrationData);
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
