import { Injectable, EventEmitter, Inject } from '@angular/core';

@Injectable()
export class MainService {

  //eosRateReady: EventEmitter<any> = new EventEmitter();
  eosRateReady = {};
  constructor() {}

  setEosPrice(data){
      this.eosRateReady = data;
  }
  getEosPrice(){
      return this.eosRateReady;
  }
 
// end service export
}