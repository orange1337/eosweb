import { Component, ViewChild, OnInit, Inject, Optional, PLATFORM_ID  } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';
import { Socket } from 'ng-socket-io';


export interface Element {
  Name: string;
  Price: number;
  high: number;
  low: number;
  Market_cap: string;
  Change: number;
  Vol: string;
  Volume: string;
}
@Component({
  selector: 'main-table',
  templateUrl: './main_table.component.html',
  styleUrls: ['./main_table.component.css']
})
export class MainTableComponent implements OnInit{
  
  curve;
  currMap: any;
  currencyName = 'USD'; //(isPlatformBrowser(this.platformId)) ? this.getCookie('currencyName'): ;
  selected = this.currencyName;

  mainData;
  displayedColumns = ['Number', 'Hash', 'Transactions', 'Producer', 'Time'];
  displayedColumnsTx = ['Number', 'Transactions', 'Producer', 'NET'];
  dataSource;
  dataSourceTrx;
  moment = moment;
  trxObj = {};
  spinner = false;

  /*@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;*/

  constructor(protected http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: Object, private socket : Socket) {
  }

  getData() {
      this.spinner = true;
        this.http.get('/api/v1/get_last_blocks/20')
                  .subscribe(
                      (res: any) => {
                          this.mainData = res;
                          let ELEMENT_DATA: Element[] = this.mainData;
                          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

                          let ELEMENT_DATA_TX: Element[] = this.createTransactionsArray(this.mainData);
                          this.dataSourceTrx = new MatTableDataSource<Element>(ELEMENT_DATA_TX);

                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  }
  
  createTransactionsArray(data) {
      if (!data){
          return;
      }
      let transactions = [];
      let displayBlocks = [];

      data.forEach(elem => {
          if (elem.transactions && elem.transactions.length > 0){
              this.trxObj[elem.block_num] = elem.transactions;
          }
      });

      Object.keys(this.trxObj).forEach(key => {
            Array.prototype.push.apply(transactions, this.trxObj[key]);
      });
      transactions.reverse();

      if (transactions.length >= 20){
          let blocks = Object.keys(this.trxObj);
          blocks.forEach((key, index) => {
              if (index < blocks.length - 20){
                  delete this.trxObj[key];
              }
          });
          return transactions.slice(0, 20);
      }

      return transactions;
  }

  ngOnInit() {
      this.getData();
      this.socket.on('get_last_blocks', (data) => {
          this.mainData = data;
          let ELEMENT_DATA: Element[] = this.mainData;
          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

          let ELEMENT_DATA_TX: Element[] = this.createTransactionsArray(this.mainData);
          this.dataSourceTrx = new MatTableDataSource<Element>(ELEMENT_DATA_TX);

      });
  }
}





















