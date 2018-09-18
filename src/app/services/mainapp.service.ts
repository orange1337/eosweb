import { Injectable, EventEmitter, Inject } from '@angular/core';

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
      let result = data.sort((a, b) => {
          return b.total_votes - a.total_votes;
      }).map((elem, index) => {
          // let eos_votes = Math.floor(this.calculateEosFromVotes(elem.total_votes));
          elem.all_votes = elem.total_votes;
          // elem.total_votes = Number(eos_votes).toLocaleString();
          elem.index = index + 1;
          return elem;
      });
      return result;
  }

  countRate(data, totalProducerVoteWeight, supply){
    if(!data){
      return;
    }
    var totalProducers = 0;
    data.forEach(producer => {
      if(producer.is_active){
        totalProducers++;
      }
    });

    data.forEach((producer) => {
      producer.votes    = (producer.all_votes * 100 / totalProducerVoteWeight).toLocaleString();
      producer.rewards = this.countRewards(producer, totalProducers, supply);
    });
    
    return data;
}


countRewards(producer, totalProducers, supply){
  var position = producer.index;
  var totalUnpaidBlocks = producer.unpaid_blocks;
  var reward = (2.5/100 * supply * 1/364) * 40/100;
  var min_unpaid_blocks_threshold = 342;
  var totalShares;
  var numProds;
  var numStandbys;

  if (totalProducers <= 21)
  {
      totalShares = (totalProducers * 2);
      numProds = totalProducers;
      numStandbys = 0;
  } else {
      totalShares = (totalProducers + 21);
      numProds = 21;
      numStandbys = (totalProducers - 21);
  }

  var shareValue = reward/totalShares;
  var pay_amount = 0;
  if (totalUnpaidBlocks > 0)
  {
      if (position <= 21 && totalUnpaidBlocks >= min_unpaid_blocks_threshold) {
          pay_amount = (shareValue * 2);
      } else if (position <= 21 && totalUnpaidBlocks <= min_unpaid_blocks_threshold) {
          pay_amount = shareValue;
      } else if (position >= 22 && position <= 51) {
          pay_amount = shareValue;
      } else {
          pay_amount = 0;
      }
  }
  return pay_amount.toFixed(4);
}

  calculateEosFromVotes(votes){
      let date = +new Date() / 1000 - 946684800;
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