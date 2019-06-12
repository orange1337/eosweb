import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { MainService } from '../../services/mainapp.service';
import { NotificationsService } from 'angular2-notifications';
import { environment } from '../../../environments/environment';

import { ScatterService } from '../../services/scatter.service';
import { LoginEOSService } from 'eos-ulm';

@Component({
  selector: 'wallet-page',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletPageComponent implements OnInit {
  
  transfer = {
      to: '',
      amount: '',
      memo: '',
      symbol: 'EOS'
  };
  contractMethod = '';
  contractName = 'eosio';
  contractField = {};
  contractFieldsRender = [];
  frontConfig = environment.frontConfig;

  constructor(public scatterService: ScatterService,
              public loginEOSService: LoginEOSService){
  }

  b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  selectContractMethod(method) {
    if (this.scatterService.contractKeys[method]){
       this.contractField = {};
       this.contractFieldsRender = this.scatterService.contractKeys[method];
      }
  }

  ngOnInit() {}
}
