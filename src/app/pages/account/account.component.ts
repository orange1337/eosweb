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

  constructor(private route: ActivatedRoute, protected http: HttpClient){}

  getBlockData(accountId){
      this.spinner = true;
  		this.http.get(`/api/v1/get_account/${accountId}`)
  				 .subscribe(
                      (res: any) => {
                          this.mainData = res;
                          this.time = this.moment(this.mainData.created).format('MMMM Do YYYY, h:mm:ss a');
                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  };

  getBalance(accountId){
      this.http.get(`/api/v1/get_currency_balance/eosio.token/${accountId}`)
           .subscribe(
                      (res: any) => {
                          this.balance = res;
                      },
                      (error) => {
                          console.error(error);
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