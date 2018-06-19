import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { MainService } from '../../services/mainapp.service';

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
  balance = 0;
  unstaked;
  actions;
  dataSource;
  displayedColumns = ['actions'];
  code;
  tables = [];
  eosRate;
  subscription;

  constructor(private route: ActivatedRoute, protected http: HttpClient, private MainService: MainService){}

  getBlockData(accountId){
      this.spinner = true;
  		this.http.get(`/api/v1/get_account/${accountId}`)
  				 .subscribe((res: any) => {
                          this.mainData = res;
                          this.getBalance(accountId);
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
      this.http.get(`/api/v1/get_currency_balance/eosio.token/${accountId}/EOS`)
           .subscribe((res: any) => {
                          this.unstaked = res[0];
                          let staked = 0;
                          if (this.mainData.voter_info && this.mainData.voter_info.staked){
                              staked = this.mainData.voter_info.staked;
                          }
                          this.balance = Number(this.unstaked.split(' ')[0]) + staked / 10000;
                          this.eosRate = this.MainService.getEosPrice();
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  getActions(accountName){
      this.http.get(`/api/v1/get_actions/${accountName}/-1/-20`)
           .subscribe((res: any) => {
                          res.actions.reverse();
                          this.actions = res;
                          let ELEMENT_DATA: Element[] = [res];
                          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
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
      if (!data.abi || !data.abi.tables){
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


  /*getAccountsByKey(key){

  }*/


  ngOnInit() {
    this.block = this.route.params.subscribe(params => {
       this.accountId = params['id'];
       this.getBlockData(this.accountId);
    });
    //this.subscription = this.MainService.getEosPrice().subscribe(item => { this.eosRate = item; console.log(item); });
  }

  ngOnDestroy() {
    this.block.unsubscribe(); 
    //this.subscription.unsubscribe();
  }	
}