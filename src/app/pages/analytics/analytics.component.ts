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
  displayedColumns = ['#', 'Name', 'Balance', 'Staked', 'Unstaked'];
  dataSource;
  eosToInt = Math.pow(10, 13);
  allvotes;
  globalStat;
  curve = shape.curveMonotoneX;
  moment = moment;

  ngxChartOptions = {
      view : [1100, 450],
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
  frontConfig = {
      coin: 'EOS'
  };
  trx;
  actions;
  pieChart;


  constructor(private route: ActivatedRoute, protected http: HttpClient){}

  getAccounts(){
      this.spinner = true;
  		this.http.get(`/api/v1/get_accounts_analytics/200`)
  				 .subscribe(
                      (res: any) => {
                          this.mainData = res;
                          this.pieChart = this.createPieChart(this.mainData);
                          
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
      this.http.post(`/api/v1/get_trx_actions`, { date: +new Date() - 7 * 24 * 60 * 60 * 1000 })
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
           this.trx.push({name: new Date(`${elem._id.year}/${elem._id.month}/${elem._id.dayOfMonth}`), 
                          value: elem.transactions[elem.transactions.length - 1] - elem.transactions[0]  });
           this.actions.push({name: new Date(`${elem._id.year}/${elem._id.month}/${elem._id.dayOfMonth}`),
                              value: elem.actions[elem.actions.length - 1] - elem.actions[0] });
     });
     console.log(this.trx, this.actions)
  }


  createPieChart(data){
        if (!data){
            return;
        }
        let result = data.map(elem => {
             return { name: elem.account_name, value: Math.floor(elem.balance_eos) }; 
        });
        result.shift();
        return result;
  }

  ngOnInit() {
     this.getAccounts();
     this.getGlobal();
     this.getChart();
     if (localStorage.getItem('frontConf')){
          this.frontConfig = JSON.parse(localStorage.getItem('frontConf'));
     }
  }
}







