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

  ngOnInit() {
     this.getAccounts();
  }
}







