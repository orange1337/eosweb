import { Injectable, EventEmitter, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../environments/environment';

@Injectable()
export class MainService {

  //eosRateReady: EventEmitter<any> = new EventEmitter();
  eosRateReady = {};
  votesToRemove;

  WINDOW: any = window;

  eosConfig = {
    chainId: "",
    httpEndpoint: "",
    expireInSeconds: 60,
    broadcast: true,
    debug: false,
    sign: true,
    /*logger: {
      log: console.log,
      error: console.error
    }*/
  };
  ungerKey = "EOS1111111111111111111111111111111114T1Anm";
  liveTXHide = localStorage.getItem('liveTXHide') ? true : false;
  frontConfig = environment.frontConfig;

  private messageSource = new BehaviorSubject("");
  currentMessage = this.messageSource.asObservable();

  changeMessage(message: string) {
      this.messageSource.next(message)
  }

  constructor() {}

  setEosPrice(data){
      this.eosRateReady = data;
  }
  getEosPrice(){
      return this.eosRateReady;
  }

  sortArray(data) {
      if(!data){
        return;
      }
      let result = [];
      data.sort((a, b) => {
          return b.total_votes - a.total_votes;
      }).forEach((elem, index) => {
          if (elem.producer_key === this.ungerKey){
              return;
          }
          let eos_votes = Math.floor(this.calculateEosFromVotes(elem.total_votes));
          elem.all_votes = elem.total_votes;
          elem.total_votes = Number(eos_votes).toLocaleString();
          
          result.push(elem);
      });
      return result;
  }

  countRate(data, totalProducerVoteWeight){
      if(!data){
        return;
      }
      this.votesToRemove = data.reduce((acc, cur) => {
            const percentageVotes = cur.all_votes / totalProducerVoteWeight * 100;
            if (percentageVotes * 200 < 100) {
              acc += parseFloat(cur.all_votes);
            }
            return acc;
      }, 0);
      data.forEach((elem, index) => {
        elem.index   = index + 1;
        elem.rate    = (!totalProducerVoteWeight) ? 0 : (elem.all_votes / totalProducerVoteWeight * 100).toLocaleString();
        elem.rewards = (!totalProducerVoteWeight) ? 0 : this.countRewards(elem.all_votes, elem.index, totalProducerVoteWeight);
      });
      
      return data;
  }

  countRewards(total_votes, index, totalProducerVoteWeight){
    let position = index;
    let reward = 0;
    let percentageVotesRewarded = total_votes / (totalProducerVoteWeight - this.votesToRemove) * 100;
     
     if (position < 22) {
       reward = (this.frontConfig.coin === 'EOS') ? reward + 443 : 4909;
     }
     if (this.frontConfig.coin === 'EOS'){
       reward += percentageVotesRewarded * 200;
     }
     if (reward < 100) {
       reward = 0;
     }
     return Math.floor(reward).toLocaleString();
  }

  calculateEosFromVotes(votes){
      let date = +new Date() / 1000 - 946684800; // 946... start timestamp
      if (this.frontConfig.coin === 'WAX'){
        let weight = parseInt(`${ date / (86400 * 7) }`, 10) / 13;
        return votes / (2 ** weight) / 100000000;
      }
      let weight = parseInt(`${ date / (86400 * 7) }`, 10) / 52; // 86400 = seconds per day 24*3600
      return votes / (2 ** weight) / 10000;
  };
 

  getGlobalNetConfig(){
    if (!this.getCookie("netsConf")){
      this.eosConfig.chainId = "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906";
      this.eosConfig.httpEndpoint = "http://bp.cryptolions.io";
      return this.WINDOW.Eos(this.eosConfig);
    }
      let cookie = JSON.parse(this.getCookie("netsConf"));
      let net = localStorage.getItem("netName") || "mainNet";
      this.eosConfig.chainId = cookie[net].chainId;
      this.eosConfig.httpEndpoint = cookie[net].httpEndpoint;
      return this.WINDOW.Eos(this.eosConfig);
  }

  getCookie(name) {
      let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  sortBlocks(data){
       if (!data){
           return null;
       }
       data.sort((a, b) => {
           if (a.block_num < b.block_num){
               return 1;
           } else {
               return -1;
           }
       });
       return data;
  }

// end service export
}