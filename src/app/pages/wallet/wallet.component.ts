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
            host: '',
            port: '',
            chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  };
  eosOptions = {
            broadcast: true,
            sign: true,
            chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
  };
  protocol = 'https';

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
  ScatterJS;
  eos;
  frontConfig = {
      coin: 'EOS'
  };
  options = { authorization: [''] };

  constructor(private route: ActivatedRoute, 
              protected http: HttpClient,
              public dialog: MatDialog,
              private notifications: NotificationsService){
    this.WINDOW.ScatterJS.plugins(new this.WINDOW.ScatterEOS());
  }

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

  getWalletAPI(){
       this.http.get(`/api/v1/get_wallet_api`)
          .subscribe((res: any) => {
                          this.eosNetwork.host = res.host;
                          this.eosNetwork.port = res.port;
                          this.eosNetwork.chainId = res.chainId;
                          this.protocol = res.protocol;
                          if (localStorage.getItem("scatter") === 'loggedIn'){
                                if (!this.WINDOW.ScatterJS){
                                     document.addEventListener('scatterLoaded', () => {
                                           this.loginScatter();
                                     });
                                } else {
                                  this.loginScatter();
                                }
                          }
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  getContract(name){
      this.spinner = true;
      this.http.get(`/api/v1/get_code/${name}`)
           .subscribe((res: any) => {
                          //console.log(this.b64DecodeUnicode(res.abi));
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

  b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  selectContractMethod(method) {
    if (this.contractKeys[method]){
       this.contractField = {};
       this.contractFieldsRender = this.contractKeys[method];
      }
  }


  loginScatter(){
    if (!this.WINDOW.ScatterJS){
        return this.notifications.error('Scatter error', 'Please install Scatter extension');
    }
    localStorage.setItem("scatter", 'loggedIn');
    this.WINDOW.ScatterJS.scatter.connect('EOSweb').then(connected => {
        if(!connected) {
          return this.notifications.error('Scatter error', 'Can\'t connect to Scatter');
        } 
      
        this.ScatterJS = this.WINDOW.ScatterJS.scatter;
        this.WINDOW.scatter = null;

        this.eos = this.ScatterJS.eos(this.eosNetwork, this.WINDOW.Eos, this.eosOptions, this.protocol);
  
        this.ScatterJS.getIdentity({
           accounts: [this.eosNetwork]
        }).then(identity => {
            if (identity.accounts.length === 0) {
                return;
            }
            let objectIdentity;
            if (this.ScatterJS.identity && this.ScatterJS.identity.accounts){
               objectIdentity = this.ScatterJS.identity.accounts.find(x => x.blockchain === 'eos');
            }
            objectIdentity = { name: identity.accounts[0].name };
            this.identity = (objectIdentity && objectIdentity.name) ? objectIdentity.name : null;
            if (this.identity){
                this.getAccount(this.identity);
            }
            this.options.authorization = [this.identity];
        }).catch(err => {
            console.error(err);
        });
    });
  }

  logoutScatter(){
    if (!this.ScatterJS){
        return this.notifications.error('Scatter error', 'Please install Scatter extension');
    }
    localStorage.setItem('scatter', 'loggedOut');
    this.ScatterJS.forgetIdentity().then(() => {
        location.reload();
        this.notifications.success('Logout success', '');
    }).catch(err => {
        console.error(err);
    });
  }

  generateTransaction(){
    if(!this.identity){
        return this.notifications.error('Identity error!!!', '');
    }
    if (! this.transfer.to.length || !this.transfer.amount.length){
        return this.notifications.error('Error', 'Please type account To and Amount');
    }
        let amount = Number(`${this.transfer.amount}`).toFixed(4) + ` ${this.transfer.symbol}`;
        this.eos.transfer(this.identity, this.transfer.to, amount, this.transfer.memo, this.options)
           .then(result => {
                this.getAccount(this.identity);
                this.notifications.success('Transaction Success', 'Please check your account page');
                this.transfer = {
                    to: '',
                    amount: '',
                    memo: '',
                    symbol: ''
                };
           }).catch(err => {
                console.error(err);
                this.notifications.error('Transaction Fail', '');
           });  
  }

  generateContractTransaction(fields, method) {
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
        this.eos.contract(this.contractName, {
            requiredFields
        }).then(contract => {
            if (!contract[method]){
                return this.notifications.error('Transaction Fail', 'Incorrect Contract Method');
            }
            contract[method](fields, this.options).then(trx => {
                 console.log(trx);
                 this.getAccount(this.identity);
                 this.contractField = {};
                 this.notifications.success('Transaction Success', 'Please check your account page');
            }).catch(err => {
                 console.error(err);
                 this.notifications.error('Transaction Fail', '');
            });  
        }).catch(err => {
            console.error(err);
            this.notifications.error('Transaction Fail', '');
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
     this.getWalletAPI();
     if (localStorage.getItem('frontConf')){
          this.frontConfig = JSON.parse(localStorage.getItem('frontConf'));
     }
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