import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import {MatDialog, MAT_DIALOG_DATA, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MainService } from '../../services/mainapp.service';

@Component({
  selector: 'block-page',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockPageComponent implements OnInit, OnDestroy{
  blockId;
  block;
  mainData;
  moment = moment;
  time;
  trxArr = [];
  dataSource;
  displayedColumns = ['expiration', 'cpu', 'net', 'id', 'status', 'actions'];
  spinner = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
   /*@ViewChild(MatSort) sort: MatSort;*/

  constructor(private route: ActivatedRoute, 
              protected http: HttpClient,
              public dialog: MatDialog){}

  getBlockData(blockId){
      this.spinner = true;
  		this.http.get(`/api/v1/get_block/${blockId}`)
  				 .subscribe(
                      (res: any) => {
                          this.mainData = res;
                          this.time = this.moment(this.mainData.timestamp).format('MMMM Do YYYY, h:mm:ss a');
                          if (this.mainData.transactions && this.mainData.transactions.length){
                              this.trxArr = this.createTransactionsArray(this.mainData.transactions);
                              
                              let ELEMENT_DATA: Element[] = this.trxArr;
                              console.log(ELEMENT_DATA.length)
                              this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
                              setTimeout(() => this.dataSource.paginator = this.paginator);
                              //console.log(this.trxArr);                              
                          }
                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  };

  createTransactionsArray(data){
        let result = [];
      
        data.forEach( elem => {
            if (typeof elem.trx === 'string'){
                return;
            }
              result.push({
                  cpu: elem.cpu_usage_us,
                  net: elem.net_usage_words,
                  status: elem.status,
                  hash: elem.trx.id,
                  actions: elem.trx.transaction.actions,
                  expiration: elem.trx.transaction.expiration
              });
        });
        return result;
  }

  openDialogMemo(event, data){
    let result = data;
    let json = false;
    if (data.indexOf('{') >= 0 && data.indexOf('}') >= 0){
        result = JSON.parse(data);
        json = true;
    }
    this.dialog.open(DialogDataMemo, {
      data: {
         result: result,
         json: json
      }
    });
  }

  ngOnInit() {
    this.block = this.route.params.subscribe(params => {
       this.blockId = params['id'];
       this.getBlockData(this.blockId);
    });
  }

  ngOnDestroy() {
    this.block.unsubscribe(); 
  }	
}

@Component({
  selector: 'dialog-data-memo',
  template: `
  <h1 mat-dialog-title>Memo</h1>
  <div mat-dialog-content>
      <ngx-json-viewer [json]="data.result" *ngIf="data.json"></ngx-json-viewer>
      <div *ngIf="!data.json">{{ data.result }}</div>
  </div>
`,
})
export class DialogDataMemo {
  constructor(@Inject(MAT_DIALOG_DATA) public data) {}
}

