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
  charts = [];
  displayCharts = new Set();
  machineData = [];

  constructor(
    public websocketService: WebsocketService,
    public toastController: ToastController
  ) { }

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
        }
      },
      series: [series]
    });
  }

  // ArrayBuffer to String conversion
  private ab2str(buf) {
    return this.decoder.decode(new Uint8Array(buf));
  }

  private handleMachineData(data, metricType: string) {
    const dataset = this.ab2str(data).split(',');
    const chartTitle = dataset[0] + ',' +dataset[1] + ',' + metricType;
    // used in UI to setup divs
    this.displayCharts.add(chartTitle);
    // save metric
    this.machineData.push(
      {
        machineId: dataset[0], 
        sensorId: dataset[1], 
        metricType: metricType, 
        value: Number(dataset[2]), 
        timestamp: Number(dataset[3])
      }
    );

    // check if chart exists (one chart per machine)
    const m = this.charts.filter(el => el.userOptions.title.text === chartTitle);
    if (m.length === 0) {
      const unit = metricType === 'vibration' ? 'mm/s' : 'Celsius';
      const series = {
        name: metricType,
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

  this.displayCharts.forEach(data => {
    // console.log(data);
    const indexChart = this.charts.map(d => d.userOptions.title.text).indexOf(data);
    // console.log(indexChart);
    const tmp = this.charts[indexChart].userOptions.title.text.split(',');
    // console.log(tmp);
    const series = this.machineData.filter(data => data.machineId === tmp[0]
    && data.sensorId === tmp[1] && data.metricType === tmp[2]);
    // console.log(series);
    series.forEach(element => {
      this.charts[indexChart].series[0].addPoint({x: element.timestamp, y: element.value});
    });
    
  });
    
  

}

ngOnInit() {
  console.log('init websocketService');
  this.websocketService.init(null);

  let sub = this.websocketService.observeGpsEvents().pipe().subscribe(data => {
    // TODO
  });
  this.subscriptions.push(sub);

  sub = this.websocketService.observeLightEvents().pipe().subscribe(data => {
    // TODO
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

  // ALERTS
  sub = this.websocketService.observeTemperatureAlerts().pipe().subscribe(data => {
    // TODO
  });
  this.subscriptions.push(sub);

  setInterval(()=>{
    this.updateChartData();
  }, 3000);

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
