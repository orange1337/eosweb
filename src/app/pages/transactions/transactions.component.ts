import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'transactions-page',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionPageComponent implements OnInit, OnDestroy{
  transactionId;
  block;
  mainData;
  moment = moment;
  time;
  trxArr = [];
  dataSource;
  displayedColumns = ['actions'];
  spinner = false;

  constructor(private route: ActivatedRoute, protected http: HttpClient){}

  getBlockData(transactionId){
      this.spinner = true;
  		this.http.get(`/api/v1/get_transaction/${transactionId}`)
  				 .subscribe(
                      (res: any) => {
                          this.mainData = res;
                          this.time = this.moment(this.mainData.block_time).format('MMMM Do YYYY, h:mm:ss a');
                          let ELEMENT_DATA: Element[] = [this.mainData.trx.trx];
                          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  };

  ngOnInit() {
    this.block = this.route.params.subscribe(params => {
       this.transactionId = params['id'];
       this.getBlockData(this.transactionId);
    });
  }

  ngOnDestroy() {
    this.block.unsubscribe(); 
  }	
}