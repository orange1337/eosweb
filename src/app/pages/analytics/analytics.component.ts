import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import * as moment from 'moment';
import * as shape from 'd3-shape';

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
  ramPrice;
  globalStat;
  curve = shape.curveBasis;

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
  }; 
  mainCurrencyChartDataRes;


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

  getRam(){
      this.http.get(`/api/v1/get_table_rows/eosio/eosio/rammarket/10`)
          .subscribe((res: any) => {
                          if (!res || !res.rows || !res.rows[0] || !res.rows[0].quote || !res.rows[0].base){
                              return console.error('data error', res);
                          }
                          let data = res.rows[0];
                          let quoteBalance  = Number(data.quote.balance.split(' ')[0]);
                          let baseBalance   = Number(data.base.balance.split(' ')[0]);
                          this.ramPrice = (quoteBalance / baseBalance * 1024).toFixed(8);
                      },
                      (error) => {
                          console.error(error);
                      });
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

  getChart() {
    let Datefrom = new Date(+new Date() - 24 * 60 * 60 * 1000);
        this.http.post(`/api/v1/get_chart_ram`, { from: Datefrom } )
                  .subscribe(
                      (res: any) => {
                           this.mainCurrencyChartDataRes = this.createChartArr(res);
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

  ngOnInit() {
     this.getAccounts();
     this.getRam();
     this.getGlobal();
     this.getChart();
  }
}







