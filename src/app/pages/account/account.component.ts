import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'account-page',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountPageComponent implements OnInit, OnDestroy{
  accountId;
  block;
  mainData;
  moment = moment;
  time;
  spinner = false;
  balance = [];
  actions = [];
  code;
  tables = [];

  constructor(private route: ActivatedRoute, protected http: HttpClient){}

  getBlockData(accountId){
      this.spinner = true;
  		this.http.get(`/api/v1/get_account/${accountId}`)
  				 .subscribe((res: any) => {
                          this.mainData = res;
                          this.time = this.moment(this.mainData.created).format('MMMM Do YYYY, h:mm:ss a');
                          this.getActions(this.mainData.account_name);
                          this.getCode(this.mainData.account_name);
                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  };

  getBalance(accountId){
      this.http.get(`/api/v1/get_currency_balance/eosio.token/${accountId}`)
           .subscribe((res: any) => {
                          this.balance = res;
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  getActions(accountName){
      this.http.get(`/api/v1/get_actions/${accountName}/1/100`)
           .subscribe((res: any) => {
                          this.actions = res.actions;
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  getCode(accountName){
      this.http.get(`/api/v1/get_code/${accountName}`)
           .subscribe((res: any) => {
                          delete res.wast;
                          delete res.wasm;
                          this.code = res;
                          this.createTables(this.code, accountName);
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  createTables(data, accountName){
      if (!data.abi && data.abi.tables.length === 0){
          return;
      }
      data.abi.tables.forEach(elem => {
          this.http.get(`/api/v1/get_table_rows/${accountName}/${accountName}/${elem.name}/20`)
              .subscribe((res: any) => {
                              this.tables.push({ name: elem.name, data: res });
                          },
                          (error) => {
                              console.error(error);
                          });
      });
  }


  ngOnInit() {
    this.block = this.route.params.subscribe(params => {
       this.accountId = params['id'];
       this.getBlockData(this.accountId);
       this.getBalance(this.accountId);
    });
  }

  ngOnDestroy() {
    this.block.unsubscribe(); 
  }	
}