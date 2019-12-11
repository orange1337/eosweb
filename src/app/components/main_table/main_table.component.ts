import { Component, ViewChild, OnInit, Inject, Optional, PLATFORM_ID, OnDestroy  } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';
import { Socket } from 'ng-socket-io';
import { MainService } from '../../services/mainapp.service';

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
export class MainTableComponent implements OnInit, OnDestroy{
  
  curve;
  currMap: any;
  currencyName = 'USD'; //(isPlatformBrowser(this.platformId)) ? this.getCookie('currencyName'): ;
  selected = this.currencyName;

  mainData;
  displayedColumns = ['Number', /*'Hash',*/ 'Transactions', 'Producer', 'Time'];
  displayedColumnsTx = ['Number', 'Name', 'Data'];
  dataSource;
  dataSourceTrx;
  moment = moment;
  trxObj = {};
  spinner = false;
  offsetPageElems = 6;

  /*@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;*/

  constructor(protected http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: Object, private socket : Socket, public mainService: MainService) {
  }

  getData() {
      this.spinner = true;
        this.http.get('/api/v1/get_last_blocks/6')
                  .subscribe(
                      (res: any) => {
                          this.mainData = res;
                          let ELEMENT_DATA: Element[] = this.mainService.sortArray(this.mainData);
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
              elem.transactions.forEach(tr => {
                  if (!this.trxObj[elem.block_num]){
                      this.trxObj[elem.block_num] = [];
                  }
                  let actions = [];
                  if (tr.trx && tr.trx.transaction && tr.trx.transaction.actions){
                      actions = tr.trx.transaction.actions.map(act => { 
                          act.block_num = tr.trx.id;
                      });
                      Array.prototype.push.apply(this.trxObj[elem.block_num], tr.trx.transaction.actions);
                  }
              });
          }
      });

      Object.keys(this.trxObj).forEach(key => {
            Array.prototype.push.apply(transactions, this.trxObj[key]);
      });
      transactions.reverse();

      if (transactions.length >= this.offsetPageElems){
          let blocks = Object.keys(this.trxObj);
          blocks.forEach((key, index) => {
              if (index < blocks.length - this.offsetPageElems){
                  delete this.trxObj[key];
              }
          });
          return transactions.slice(0, this.offsetPageElems);
      }

      
      return transactions;
  }

  ngOnInit() {
      this.getData();
      this.socket.on('get_last_blocks', (data) => {
          this.mainData = data;
          let ELEMENT_DATA: Element[] = this.mainService.sortArray(this.mainData);
          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

          let ELEMENT_DATA_TX: Element[] = this.createTransactionsArray(this.mainData);
          this.dataSourceTrx = new MatTableDataSource<Element>(ELEMENT_DATA_TX);

      });
  }

  ngOnDestroy(){
    this.socket.removeAllListeners('get_last_blocks');
  }
}





















