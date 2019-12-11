import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { MainService } from '../../services/mainapp.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { environment } from '../../../environments/environment';

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
  spinnerActions = false;
  balance = 0;
  unstaked;
  actions;
  dataSource;
  displayedColumns = [ '#', 'tx', 'date', 'name', 'data'];
  code;
  tables = [];
  eosRate;
  subscription;
  displayedColumnsPermissiopn = ['Permission', 'Address', 'Threshold', 'Weight'];
  dataSourcePermission;
  controlledAccount;
  tokensArray;
  actionsTotal = 0;
  position = 1;
  pageIndex = 0;
  actionsArray = [];
  elementsLimit = 100;
  creator;
  actionsNotSorted;
  frontConfig = environment.frontConfig;


  constructor(private route: ActivatedRoute, 
              protected http: HttpClient, 
              private MainService: MainService,
              public dialog: MatDialog){
  }

  getBlockData(accountId){
      this.spinner = true;
  		this.http.get(`/api/v1/get_account/${accountId}`)
  				 .subscribe((res: any) => {
                          this.mainData = res;
                          this.getBalance(accountId);
                          this.time = this.moment(this.mainData.created).format('MMMM Do YYYY, h:mm:ss a');
                          this.getActions(this.mainData.account_name, this.position);
                          this.getAccountCreator(this.mainData.account_name);
                          this.getCode(this.mainData.account_name);

                          let ELEMENT_DATA: Element[] = res.permissions;
                          this.dataSourcePermission = new MatTableDataSource<Element>(ELEMENT_DATA);

                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  };

  getBalance(accountId){
      this.http.get(`/api/v1/get_currency_balance/${this.frontConfig.tokenContract}/${accountId}/${this.frontConfig.totalBalance}`)
           .subscribe((res: any) => {
                          this.unstaked = (!res[0]) ? 0 : Number(res[0].split(' ')[0]); 
                          let staked = 0;
                          if (this.mainData.voter_info && this.mainData.voter_info.staked){
                              staked = this.mainData.voter_info.staked;
                          }
                          if (this.frontConfig.customBalance){
                            this.balance = this.unstaked;
                          } else {
                            this.balance = (this.frontConfig.coin !== 'WAX') ? this.unstaked + staked / 10000 : this.unstaked + staked / 100000000;
                          } 
                          this.eosRate = this.MainService.getEosPrice();
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  getActions(accountName, pos){
      this.spinnerActions = true;
      pos = (pos === 1) ? -1 : pos;
      this.http.get(`/api/v1/get_actions/${accountName}/${pos}/-${this.elementsLimit}`)
           .subscribe((res: any) => {
                          this.actionsNotSorted = res.actions;
                          if(res.actions[0] && !res.actions[0].action_trace){
                            res.actions = this.createActionsArr(res.actions);
                            this.actionsTotal = res.actionsTotal;
                          } else {
                            res.actions.reverse();
                          }
                          res.actions = this.sortArrayFunctions(res.actions);
                          Array.prototype.push.apply(this.actionsArray, res.actions);

                          this.actions = this.actionsArray;
                          let ELEMENT_DATA: Element[] = this.actionsArray;
                          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

                          this.dataSource.filterPredicate = function(data, filter: string): boolean {
                                      return data.action_trace.act.name.toLowerCase().includes(filter) || 
                                             data.action_trace.act.account.toLowerCase().includes(filter);
                          };

                          this.spinnerActions = false;
                      },
                      (error) => {
                          this.spinnerActions = false;
                          console.error(error);
                      });
  }
  nextPage(pageIndex){
    this.position += pageIndex;
    this.getActions(this.mainData.account_name, this.position * this.elementsLimit);
  }

  getAccountCreator(accountName){
      this.http.get(`/api/v1/get_actions_name/${accountName}/newaccount?sort=1`)
           .subscribe((res: any) => {
                          this.creator = res.actions[0];
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

  sortArrayFunctions(data){
       if (!data){
           return [];
       }
       let uniqieString = [];
       let result = [];
       data.forEach(elem => {
           let unique = elem.action_trace.act.hex_data + elem.action_trace.trx_id;
           if (uniqieString.indexOf(unique) === -1){
               result.push(elem);
               uniqieString.push(unique);
           }
       });
       uniqieString = [];
       return result;
  }

  filterTokens(data){
    let result = data.map();
  }

  createActionsArr(actions){
      actions.forEach(elem => {
           elem.action_trace = {};
           elem.action_trace.receipt = elem.receipt;
           elem.action_trace.act = elem.act;
           elem.action_trace.trx_id = elem.trx_id;
      });
      return actions;
  }


  getControlledAccounts(account){
        this.http.get(`/api/v1/get_controlled_accounts/${account}`)
              .subscribe((res: any) => {
                              this.controlledAccount = (res && !res.controlled_accounts) ? this.createArrayAccounts(res) : res;
                          },
                          (error) => {
                              console.error(error);
                          });
  }

  createArrayAccounts(data){
      let result = {
        controlled_accounts: []
      };
      data.forEach(elem => {
          if (elem.controlled_permission === "active"){
             result.controlled_accounts.push(elem.controlled_account); 
          }  
      });
      return result;
  }

  getAllTokens(account){
        this.http.post(`/api/v1/get_account_tokens`, { account: account })
              .subscribe((res: any) => {
                              this.tokensArray = res;
                          },
                          (error) => {
                              console.error(error);
                          });      
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ngOnInit() {
    this.block = this.route.params.subscribe(params => {
       this.actionsArray = [];
       this.tables = [];
       this.actions = [];
       this.dataSource = [];
       this.accountId = params['id'];
       this.getBlockData(this.accountId);
       this.getControlledAccounts(this.accountId);
       this.getAllTokens(this.accountId);
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














