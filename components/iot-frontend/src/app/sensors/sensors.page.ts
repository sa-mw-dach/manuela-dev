import { WebsocketService } from './../providers/websocket.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import * as HighCharts from 'highcharts';


@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.page.html',
  styleUrls: ['./sensors.page.scss'],
})
export class SensorsPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  decoder = new TextDecoder('utf-8');
  machines = [];
  charts = [];

  constructor(
    public websocketService: WebsocketService,
    public toastController: ToastController
  ) { }

  plotDynamicSplineChart(machineId: string, series: any, threshold: number) {
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
          text: 'Value'
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
      series: [series]
    });
  }

  // ArrayBuffer to String conversion
  private ab2str(buf) {
    return this.decoder.decode(new Uint8Array(buf));
  }

  private handleMetrics(data, metricType: string) {
    const metric = this.ab2str(data).split(',');
    const m = this.machines.filter(el => el.machineId === metric[0]);
    if (m.length === 0) {
      console.log('CREATING NEW MACHINE AND CHART');
      // new machine...
      const newMachine = {
        machineId: metric[0],
        sensors: [
          { sensorId: metric[1],
            types: [
              { type: metricType,
                series: [
                  { x: Number(metric[3]), y: Number(metric[2]) }
                ]
               }
            ]
          }
        ]
      };
      this.machines.push(newMachine);
      const series = {
        name: metric[1] + '-' + metricType,
        type: undefined,
        data: [{ x: Number(metric[3]), y: Number(metric[2]) }]
      };
      setTimeout(() => {
        this.charts.push(this.plotDynamicSplineChart(metric[0], series, 70));
      }, 100);
    } else {
      console.log('MACHINE FOUND');
      // Machine found...
      // console.log(this.charts);
      const indexMachine = this.machines.map(d => d.machineId).indexOf(metric[0]);
      const filterSensors = this.machines[indexMachine].sensors.filter(el => el.sensorId === metric[1]);
      const indexChart = this.charts.map(d => d.userOptions.title.text).indexOf(metric[0]);
      // console.log(indexChart);

      if (filterSensors.length === 0) {
        console.log('NEW SENSOR AND SERIES');
        // new sensor...
        const newSensor = { sensorId: metric[1],
          types: [
            { type: metricType,
              series: [
                { x: Number(metric[3]), y: Number(metric[2]) }
              ]
             }
          ]
        };
        this.machines[indexMachine].sensors.push(newSensor);
        const series = {
          name: metric[1] + '-' + metricType,
          type: undefined,
          data: [{ x: Number(metric[3]), y: Number(metric[2]) }]
        };
        if (indexChart !== -1) {
          this.charts[indexChart].addSeries(series);
        }
    } else {
      console.log('SENSOR FOUND');
      const indexSensor = this.machines[indexMachine].sensors.map(d => d.sensorId).indexOf(metric[1]);
      const filterTypes = this.machines[indexMachine].sensors[indexSensor].types.filter(el => el.type === metricType);
      if (filterTypes.length === 0) {
        console.log('SENSOR FOUND -> NEW TYPE');
        // new Metric Type...
        const newType = { type: metricType,
          series: [
            { x: Number(metric[3]), y: Number(metric[2]) }
          ]
         };
        this.machines[indexMachine].sensors[indexSensor].types.push(newType);
        const newSeries = {
          name: metric[1] + '-' + metricType,
          type: undefined,
          data: [{ x: Number(metric[3]), y: Number(metric[2]) }]
        };
        if (indexChart !== -1) {
          this.charts[indexChart].addSeries(newSeries);
        }
      } else {
        console.log('SENSOR AND TYPE FOUND -> ADD DATA');
        const indexTypes = this.machines[indexMachine].sensors[indexSensor].types.map(d => d.type).indexOf(metricType);
        this.machines[indexMachine].sensors[indexSensor].types[indexTypes].series.push({ x: Number(metric[3]), y: Number(metric[2]) });

        const indexS = this.charts[indexChart].series.map(d => d.name).indexOf(metric[1] + '-' + metricType);
        if (indexChart !== -1 && indexS !== -1) {
          this.charts[indexChart].series[indexS].addPoint({ x: Number(metric[3]), y: Number(metric[2]) });
        }
      }

    }
  }
    // console.log(this.charts);
}


ionViewDidEnter() {

}

ngOnInit() {
  console.log('init websocketService');
  this.websocketService.init(null);

  let sub = this.websocketService.observeGpsEvents().pipe().subscribe(data => {
    this.handleMetrics(data, 'gps');
  });
  this.subscriptions.push(sub);

  sub = this.websocketService.observeTemperatureAlerts().pipe().subscribe(data => {
    // TODO
  });
  this.subscriptions.push(sub);

  sub = this.websocketService.observeTemperatureEvents().pipe().subscribe(data => {
    this.handleMetrics(data, 'temperature');
  });
  this.subscriptions.push(sub);

  sub = this.websocketService.observeVibrationEvents().pipe().subscribe(data => {
    this.handleMetrics(data, 'vibration');
  });
  this.subscriptions.push(sub);

}

ngOnDestroy() {
  console.debug('Playlist page destroy');
  this.subscriptions.forEach((sub) => {
    sub.unsubscribe();
  });
  this.websocketService.disconnect();
  this.machines = [];
  this.charts = [];
}

}
