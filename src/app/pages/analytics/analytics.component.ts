import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import * as moment from 'moment';

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
  }
}







