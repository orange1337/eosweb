import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

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

  /*@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;*/

  constructor(private route: ActivatedRoute, protected http: HttpClient){}

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
                              this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

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