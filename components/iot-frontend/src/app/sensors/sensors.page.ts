import { WebsocketService } from './../providers/websocket.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import * as HighCharts from 'highcharts';
import { ConfigService } from './../providers/config.service';


@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.page.html',
  styleUrls: ['./sensors.page.scss'],
})
export class SensorsPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  decoder = new TextDecoder('utf-8');
  charts = [];
  displayCharts = new Set();
  machineData = [];

  constructor(
    public websocketService: WebsocketService,
    public toastController: ToastController,
    private confService: ConfigService
  ) { }

  async presentNttAlarm(message: string) {
      const toast = await this.toastController.create({
        header: 'ALARM!',
        message: message,
        showCloseButton: true,
        position: 'top',
        color: 'danger'
      });
      toast.present();
      // console.debug('*** presentToastTemperature ');
  }

  async presentToastTemperature() {
    const toast = await this.toastController.create({
      header: 'Temperature ALERT!',
      message: 'Please check the pump and submit a ticket.',
      duration: 3000,
      position: 'top',
      color: 'warning'
    });
    toast.present();
    // console.debug('*** presentToastTemperature ');
  }

  async presentToastVibration() {
    const toast = await this.toastController.create({
      header: 'Vibration ALERT!',
      message: 'Please check the pump and and submit a ticket.',
      duration: 3000,
      position: 'bottom',
      color: 'danger'
      /*
      buttons: [
        {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
      */
    });
    toast.present();
    // console.debug('*** presentToastVibration ');
  }

  plotDynamicSplineChart(machineId: string, series: any, unit: string, threshold: number) {
    return HighCharts.chart(machineId, {
      chart: {
        type: 'spline',
        animation: true, // don't animate in old IE
        marginRight: 10,
      },

      time: {
        useUTC: true
      },

      title: {
        text: machineId
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
      },
      yAxis: {
        title: {
          text: unit
        },
        plotLines: [{
          value: threshold,
          width: 2,
          color: '#EE0000'
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
        enabled: true
      },
      plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: false
        },
        spline: {
          marker: {
              radius: 4,
              lineColor: '#666666',
              lineWidth: 2
          }
      }
      },
      series: [series]
    });
  }

  // ArrayBuffer to String conversion
  private ab2str(buf) {
    return this.decoder.decode(new Uint8Array(buf));
  }

  private handleMachineData(data, metricTyp: string) {
    const dataset = this.ab2str(data).split(',');
    const chartTitle = dataset[0] + ',' + dataset[1] + ',' + metricTyp;
    // used in UI to setup divs
    this.displayCharts.add(chartTitle);
    // save metric
    this.machineData.push(
      {
        machineId: dataset[0],
        sensorId: dataset[1],
        metricType: metricTyp,
        value: Number(dataset[2]),
        timestamp: Number(dataset[3])
      }
    );

    // check if chart exists (one chart per machine)
    const m = this.charts.filter(el => el.userOptions.title.text === chartTitle);
    if (m.length === 0) {
      const unit = metricTyp === 'vibration' ? 'mm/s' : 'Celsius';
      const series = {
        name: metricTyp,
        type: undefined,
        data: []
      };
      setTimeout(() => {
        this.charts.push(this.plotDynamicSplineChart(chartTitle, series, unit, 70));
        // console.log(this.charts);
      }, 100);
    }

  }

updateChartData() {
  // console.log('DATA LENGTH: ' + this.machineData.length);
  if (this.machineData.length > this.confService.CHART_BUFFER_ENTRIES) {
    this.machineData = this.machineData.slice(this.machineData.length - this.confService.CHART_BUFFER_ENTRIES, this.machineData.length);
  }

  this.displayCharts.forEach(data => {
    // console.log(data);
    const indexChart = this.charts.map(d => d.userOptions.title.text).indexOf(data);
    // console.log(indexChart);
    const tmp = this.charts[indexChart].userOptions.title.text.split(',');
    // console.log(tmp);
    // console.log(this.machineData);
    const series = this.machineData.filter(el => el.machineId === tmp[0]
    && el.sensorId === tmp[1]);
    // console.log(series);
    let sd = series.map(el => {
      const point = {x: null, y: null};
      point.x = el.timestamp;
      point.y = el.value;
      return point;
    });
    if (sd.length > 20) {
      sd = sd.slice(sd.length - 20, sd.length);
    }
    // console.log(sd);
    series.forEach(element => {
      this.charts[indexChart].series[0].setData(sd, true, false, false);
      /*
      if (series.length > 20) {
        this.charts[indexChart].series[0].addPoint({x: element.timestamp, y: element.value}, false, true);
      } else {
        this.charts[indexChart].series[0].addPoint({x: element.timestamp, y: element.value}, false);
      }*/
    });
    // this.charts[indexChart].redraw(false);
  });

}

ngOnInit() {
  console.log('init websocketService');
  this.websocketService.init(null);

  let sub = this.websocketService.observeGpsEvents().pipe().subscribe(data => {
    console.log("Received GPS data...");
    console.log(data);
  });
  this.subscriptions.push(sub);

  sub = this.websocketService.observeLightEvents().pipe().subscribe(data => {
    console.log("Received Light data...");
    console.log(data);
  });
  this.subscriptions.push(sub);

  sub = this.websocketService.observeTemperatureEvents().pipe().subscribe(data => {
    this.handleMachineData(data, 'temperature');
  });
  this.subscriptions.push(sub);

  sub = this.websocketService.observeVibrationEvents().pipe().subscribe(data => {
    this.handleMachineData(data, 'vibration');
  });
  this.subscriptions.push(sub);

  sub = this.websocketService.observeNttAlarmEvents().pipe().subscribe(data => {
    console.log("Received NTT alarm data...");
    let alarm = JSON.parse(this.ab2str(data));
    console.log(alarm);
    this.presentNttAlarm(this.ab2str(data));
  });
  this.subscriptions.push(sub);

  sub = this.websocketService.observeNttValuesEvents().pipe().subscribe(data => {
      console.log("Received NTT values data...");
      let dataPoint = JSON.parse(this.ab2str(data));
      // console.log(dataPoint);

      const metricTyp = 'vibration';
      const chartTitle = dataPoint.gateway_UUID + ',' + dataPoint.id;
          // used in UI to setup divs
          this.displayCharts.add(chartTitle);
          // save metric
          this.machineData.push(
            {
              machineId: String(dataPoint.gateway_UUID),
              sensorId: String(dataPoint.id),
              metricType: String(metricTyp),
              value: Number(dataPoint.value),
              timestamp: Number(Date.now())
            }
          );

          // check if chart exists (one chart per machine)
          const m = this.charts.filter(el => el.userOptions.title.text === chartTitle);
          if (m.length === 0) {
            const unit = metricTyp === 'vibration' ? 'mm/s' : 'Celsius';
            const series = {
              name: metricTyp,
              type: undefined,
              data: []
            };
            setTimeout(() => {
              this.charts.push(this.plotDynamicSplineChart(chartTitle, series, unit, 70));
              // console.log(this.charts);
            }, 100);
          }
    });
  this.subscriptions.push(sub);

  // ALERTS
  sub = this.websocketService.observeTemperatureAlerts().pipe().subscribe(data => {
    this.presentToastTemperature();
  });
  this.subscriptions.push(sub);

  sub = this.websocketService.observeVibrationAlerts().pipe().subscribe(data => {
    this.presentToastVibration();
  });
  this.subscriptions.push(sub);

  setInterval(() => {
    this.updateChartData();
  }, this.confService.CHART_REFRESH_INTERVAL);

}

ngOnDestroy() {
  console.debug('Playlist page destroy');
  this.subscriptions.forEach((sub) => {
    sub.unsubscribe();
  });
  this.websocketService.disconnect();
  this.charts = [];
  this.displayCharts = new Set();
  this.machineData = [];
}

}
