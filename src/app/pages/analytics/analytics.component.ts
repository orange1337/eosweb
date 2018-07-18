import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import * as moment from 'moment';
import * as shape from 'd3-shape';
import { Socket } from 'ng-socket-io';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'analytics-page',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsPageComponent implements OnInit{
  mainData;
  spinner = false;
  displayedColumns = ['#', 'Name', 'Balance', 'Staked', 'Unstaked', 'Currencies Array'];
  dataSource;
  eosToInt = Math.pow(10, 13);
  allvotes;
  globalStat;
  curve = shape.curveMonotoneX;
  moment = moment;

  ngxChartOptions = {
      view : [600, 370],
      showXAxis : true,
      showYAxis : true,
      gradient : true,
      showLegend : false,
      showXAxisLabel : false,
      xAxisLabel : '',
      showYAxisLabel : true,
      yAxisLabel : '',
      autoScale : true,
      timeline: true,
      fitContainer : true
  }; 

  trx;
  actions;


  constructor(private route: ActivatedRoute, protected http: HttpClient){}

  getAccounts(){
      this.spinner = true;
  		this.http.get(`/api/v1/get_accounts_analytics/200`)
  				 .subscribe(
                      (res: any) => {
                          this.mainData = res;
                          
                          let ELEMENT_DATA: Element[] = this.mainData;
                          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  };

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

  getChart(){
      this.http.post(`/api/v1/get_trx_actions`, { date: +new Date() - 24 * 60 * 60 * 1000 })
          .subscribe((res: any) => {
                          this.createChart(res);
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  /// [{ name: 'trx', series: mainCurrencyChartDataRes || [{name: '0', value: 1}] }]
  createChart(data){
     if (!data){
         return console.log('========= data error chart', data);
     }
     this.trx = [];
     this.actions = [];
     data.forEach(elem => {
           this.trx.push({name: new Date(elem.date), value: elem.transactions });
           this.actions.push({name: new Date(elem.date), value: elem.actions });
     });
     //console.log(this.trx, this.actions)
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


  ngOnInit() {
     this.getAccounts();
     this.getGlobal();
     this.getChart();
  }
}







