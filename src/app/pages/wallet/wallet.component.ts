import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { MainService } from '../../services/mainapp.service';
import { NotificationsService } from 'angular2-notifications';


@Component({
  selector: 'wallet-page',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletPageComponent implements OnInit {
  transactionId;
  block;
  mainData;
  moment = moment;
  time;
  trxArr = [];
  dataSource;
  displayedColumns = ['actions'];
  spinner = false;
  unstaked = 0;
  staked = 0;
  balance = 0;
  
  identity;
  WINDOW: any = window;
  eosNetwork = {
            blockchain: 'eos',
            host: 'api.eosweb.net',
            port: '',
            chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  };
  eosOptions = {
            broadcast: true,
            sign: true,
            chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
  };

  transfer = {
      to: '',
      amount: '',
      memo: '',
      symbol: 'EOS'
  };
  contract;
  contractName = 'eosio';
  contractKeys = {};
  contractMethod = '';
  contractField = {};
  contractFieldsRender = [];

  constructor(private route: ActivatedRoute, 
              protected http: HttpClient,
              public dialog: MatDialog,
              private notifications: NotificationsService){}

  getAccount(name){
      this.spinner = true;
      this.http.get(`/api/v1/get_account/${name}`)
           .subscribe((res: any) => {
                          this.mainData = res;
                          this.getBalance(name);
                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  }

  getBalance(accountId){
      this.http.get(`/api/v1/get_currency_balance/eosio.token/${accountId}/EOS`)
           .subscribe((res: any) => {
                          this.unstaked = (!res[0]) ? 0 : Number(res[0].split(' ')[0]); 
                          if (this.mainData.voter_info && this.mainData.voter_info.staked){
                              this.staked = this.mainData.voter_info.staked / 10000;
                          }
                          this.balance = this.unstaked + this.staked;
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  getContract(name){
      this.spinner = true;
      this.http.get(`/api/v1/get_code/${name}`)
           .subscribe((res: any) => {
                          console.log(res);
                          if (res && res.abi && res.abi.structs){
                              this.contract = res.abi.structs;
                              this.contract.forEach(elem => {
                                  this.contractKeys[elem.name] = elem.fields;
                              });
                          }
                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  }

  selectContractMethod(method) {
    if (this.contractKeys[method]){
       this.contractField = {};
       this.contractFieldsRender = this.contractKeys[method];
      }
  }

  loginScatter(){
    if (!this.WINDOW.scatter){
        console.error('Please install scatter wallet !');
    }
    this.WINDOW.scatter.getIdentity({
       accounts: [this.eosNetwork]
    }).then(identity => {
        this.identity = identity;
        if (identity && identity.accounts[0] && identity.accounts[0].name){
            this.getAccount(identity.accounts[0].name);
        }
    }).catch(err => {
        console.error(err);
    });
  }

  generateTransaction(){
    if(!this.identity){
        return this.notifications.create('Identity error!!!', '', 'error');
    }
    if (! this.transfer.to.length || !this.transfer.amount.length){
        return this.notifications.create('Error', 'Please type account To and Amount', 'error');
    }
        let amount = Number(`${this.transfer.amount}`).toFixed(4) + ` ${this.transfer.symbol}`;
        let eos = this.WINDOW.scatter.eos(this.eosNetwork, this.WINDOW.Eos, this.eosOptions, "https");
        eos.transfer(this.identity.accounts[0].name, this.transfer.to, amount, this.transfer.memo)
           .then(result => {
                this.getAccount(this.identity.accounts[0].name);
                this.notifications.create('Transaction Success', 'Please check your account page', 'success');
                this.transfer = {
                    to: '',
                    amount: '',
                    memo: '',
                    symbol: ''
                };
           }).catch(err => {
                console.error(err);
                this.notifications.create('Transaction Fail', '', 'error');
           });  
  }

  generateContractTransaction(fields, method) {
      //console.log(fields, method, this.contractFieldsRender);
      let types = {};
      this.contractFieldsRender.forEach(elem => {
           types[elem.name] = elem.type; 
      });
      Object.keys(fields).forEach(key => {
            if (types[key] && types[key].indexOf('uint') >= 0 || types[key].indexOf('bool') >= 0 || types[key].indexOf('int') >= 0){
                fields[key] = parseInt(fields[key]);
            }
            if (types[key] && types[key].indexOf('float') >= 0){
                fields[key] = parseFloat(fields[key]);
            }
            if (types[key] && types[key].indexOf('asset') >= 0){
                let elem = fields[key].split(' ');
                fields[key] = `${Number(elem[0]).toFixed(4)} ${elem[1]}`;
            }
            if (types[key] && types[key].indexOf('[]') >= 0){
                fields[key] = fields[key].split(',').map(elem => { return elem.replace(' ', '') });
            }
            if (types[key] && types[key].indexOf('bytes') >= 0){
                fields[key] = this.convertToBytes(types[key]);
            }
            if (types[key] && types[key].indexOf('time_point_sec') >= 0){
                fields[key] = Number(fields[key]);
            }
      });
      console.log(fields, method, this.contractFieldsRender);
      if(!this.identity){
          return console.error('Identity error!!!');
      }
        let requiredFields = {
            accounts: [this.eosNetwork]
        }
        let eos = this.WINDOW.scatter.eos(this.eosNetwork, this.WINDOW.Eos, this.eosOptions, "https");
        eos.contract(this.contractName, {
            requiredFields
        }).then(contract => {
            if (!contract[method]){
                return this.notifications.create('Transaction Fail', 'Incorrect Contract Method', 'error');
            }
            contract[method](fields).then(trx => {
                 console.log(trx);
                 this.getAccount(this.identity.accounts[0].name);
                 this.contractField = {};
                 this.notifications.create('Transaction Success', 'Please check your account page', 'success');
            }).catch(err => {
                 console.error(err);
                 this.notifications.create('Transaction Fail', '', 'error');
            });  
        }).catch(err => {
            console.error(err);
            this.notifications.create('Transaction Fail', '', 'error');
        });
  }

  convertToBytes(string){
      let bytes = [];
      for (let i = 0; i < string.length; ++i) {
          bytes.push(string[i].charCodeAt());
      }
      return bytes;
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