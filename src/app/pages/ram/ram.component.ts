import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import * as moment from 'moment';
import * as shape from 'd3-shape';
import { Socket } from 'ng-socket-io';
import { MainService } from '../../services/mainapp.service';

import { environment } from '../../../environments/environment';
import { ScatterService } from '../../services/scatter.service';
import { LoginEOSService } from 'eos-ulm';

@Component({
  selector: 'ram-page',
  templateUrl: './ram.component.html',
  styleUrls: ['./ram.component.css']
})
export class RamPageComponent implements OnInit{
  
  spinner = false;
  displayedColumns = ['Tx', 'Type', 'Price', 'Amount', 'Date'];
  eosToInt = Math.pow(10, 13);
  globalStat;
  curve = shape.curveMonotoneX;
  moment = moment;
  ngxChartOptions = {
      colorScheme : {
          domain: ['#44a264']
      },
      view : [900, 400],
      showXAxis : true,
      showYAxis : true,
      gradient : true,
      showLegend : false,
      showXAxisLabel : false,
      xAxisLabel : 'EOS',
      showYAxisLabel : true,
      yAxisLabel : 'EOS',
      autoScale : true,
      timeline: true,
      fitContainer : true
  }; 
  mainCurrencyChartDataRes;
  defaultTimeName = 'Day';
  timeArray = ['Week'];
  dateFrom = new Date(+new Date() - 24 * 60 * 60 * 1000);
  frontConfig = environment.frontConfig;

  constructor(protected http: HttpClient, 
              private socket: Socket,
              private MainService: MainService,
              public scatterService: ScatterService,
              public loginEOSService: LoginEOSService){
  }

  getGlobal(){
      this.http.get(`/api/v1/get_table_rows/eosio/eosio/global/10`)
          .subscribe((res: any) => {
                          if (!res || !res.rows){
                              return console.error('data error', res);
                          }
                          this.globalStat = res.rows[0];
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  getChart(dateFrom) {
    this.spinner = true;
        this.http.post(`/api/v1/get_chart_ram`, { from: dateFrom } )
                  .subscribe(
                      (res: any) => {
                           this.mainCurrencyChartDataRes = this.createChartArr(res);
                           this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  createChartArr(data){
    let result = [];
      data.forEach(elem => {
          let quoteBalance  = Number(elem.quote.split(' ')[0]);
          let baseBalance   = Number(elem.base.split(' ')[0]);
          result.push({ name: new Date(elem.date), value: (quoteBalance / baseBalance * 1024).toFixed(8) });
      });
    return result;
  }

  selectDay(name){
      this.timeArray.push(this.defaultTimeName);
      this.timeArray.splice(this.timeArray.indexOf(name), 1);
      this.defaultTimeName = name;
      let date;
      if (name === 'Day'){
          date = +new Date() - 24 * 3600000;
      } else if (name === 'Week'){
          date = +new Date() - 7 * 24 * 3600000;
      } else if (name === 'Month'){
          date = +new Date() - 30 * 7 * 24 * 3600000;
      }
      this.getChart(date);
  }

  buyChangeEOS(e) {
      this.scatterService.buyRAM.kb = this.scatterService.buyRAM.eos / this.scatterService.ramPrice;
  }
  buyChangeKB(e) {
      this.scatterService.buyRAM.eos = this.scatterService.ramPrice * this.scatterService.buyRAM.kb;
  }
  sellChangeEOS(e) {
      this.scatterService.sellRAM.kb = this.scatterService.sellRAM.eos / this.scatterService.ramPrice;
  }
  sellChangeKB(e) {
      this.scatterService.sellRAM.eos = this.scatterService.ramPrice * this.scatterService.sellRAM.kb;
  }  


  parseNumber(number) {
      if (!number){
        return 0;
      }
      return parseFloat(number).toFixed(4);
  }

  
  ngOnInit() {
     this.getGlobal();
     this.scatterService.getRam();
     this.getChart(this.dateFrom);

     this.loginEOSService.loggedIn.subscribe(res => {
           this.scatterService.getOrderHistory();
     });

     this.socket.on('get_ram', res => {
          this.scatterService.countRamPrice(res);
     });
  }
}







