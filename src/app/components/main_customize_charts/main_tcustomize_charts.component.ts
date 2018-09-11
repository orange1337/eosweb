import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ng-socket-io';
import * as shape from 'd3-shape';
import { MainService } from '../../services/mainapp.service';
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
  selector: 'main-tcustomize-charts',
  templateUrl: './main_tcustomize_charts.component.html',
  styleUrls: ['./main_tcustomize_charts.component.css'],
})
export class MainCustomizeChartsComponent implements OnInit{
	 currencyObj;
   mainCurrencyChartDataRes;
   ngxChartOptions = {
      colorScheme : {
          domain: ['#44a264']
      },
      view : [130, 70],
      showXAxis : false,
      showYAxis : false,
      gradient : true,
      showLegend : false,
      showXAxisLabel : false,
      xAxisLabel : 'Country',
      showYAxisLabel : false,
      yAxisLabel : 'Population',
      autoScale : true,
  }; 
  curve = shape.curveCardinal;
  blockchainData;
  aggragationData;
  ramPrice;
  //eos = this.MainService.getGlobalNetConfig();
  //TPSliveTimeUpdate = 1000;
  TPSliveTx = 0;

  constructor(private http: HttpClient, private socket: Socket, private MainService: MainService){}

  getData() {
        this.http.get('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=EOS&tsyms=USD')
                  .subscribe(
                      (res: any) => {
                           this.currencyObj = res;
                           this.MainService.setEosPrice(this.currencyObj);
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  getChart() {
        this.http.get('https://min-api.cryptocompare.com/data/histohour?fsym=EOS&tsym=USD&limit=24&aggregate=3&e=CCCAGG')
                  .subscribe(
                      (res: any) => {
                           this.mainCurrencyChartDataRes = this.createChartArr(res.Data);
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  getBlockchainData(){
        this.http.get('/api/v1/get_info')
                  .subscribe(
                      (res: any) => {
                           this.blockchainData = res;
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  getAggregationData(){
        this.http.get('/api/v1/get_aggregation_stat')
                  .subscribe(
                      (res: any) => {
                           this.aggragationData = res;
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  createChartArr(data){
    let result = [];
      data.forEach(elem => {
          result.push({ name: new Date(elem.time * 1000), value: elem.close});
      });
    return result;
  }

  getRam(){
      this.http.get(`/api/v1/get_table_rows/eosio/eosio/rammarket/10`)
          .subscribe((res: any) => {
                          this.countRamPrice(res);
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  countRamPrice(res){
        if (!res || !res.rows || !res.rows[0] || !res.rows[0].quote || !res.rows[0].base){
                return console.error('data error', res);
        }
        let data = res.rows[0];
        let quoteBalance  = Number(data.quote.balance.split(' ')[0]);
        let baseBalance   = Number(data.base.balance.split(' ')[0]);
        this.ramPrice = (quoteBalance / baseBalance * 1024).toFixed(5);
  }

/*  getTPSlive(){
      this.eos.getInfo({})
           .then((stat: any) => { 
             if (!stat.head_block_num){
                 return console.error('Cant get info from blockchain!');
             }
             let start = stat.head_block_num - 1;
             let end = stat.head_block_num;
             this.getBlocksInfo(start, end).then(block => {
                 //console.log(block);
                 if (block.start.transactions && block.end.transactions.length){
                     this.TPSliveTx = block.start.transactions.length + block.end.transactions.length;
                 }
                 setTimeout(() => { this.getTPSlive() }, this.TPSliveTimeUpdate);
             }).catch(err => {
                 setTimeout(() => { this.getTPSlive() }, this.TPSliveTimeUpdate);
                 console.error(err);
             });
           })
           .catch(err => {
               setTimeout(() => { this.getTPSlive() }, this.TPSliveTimeUpdate);
               console.error(err);
           });
  }

  async getBlocksInfo(block_start, block_end){
      let startPromise = this.eos.getBlock({ block_num_or_id: block_start });
      let endPromise   = this.eos.getBlock({ block_num_or_id: block_end });
      let start = await startPromise;
      let end   = await endPromise;
      return {
         start: start,
         end: end
      }
  }*/

  ngOnInit() {
      this.getData();
      this.getChart();
      this.getBlockchainData();
      this.getAggregationData();
      this.getRam();
      //this.getTPSlive();

      this.socket.on('get_ram', res => {
          this.countRamPrice(res);
      });

      this.socket.on('get_info', res => {
          this.blockchainData = res;
      });

      this.socket.on('get_tps', res => {
          this.TPSliveTx = res;
      });

      this.socket.on('get_aggregation', res => {
          this.aggragationData = res;
      });
  }
}
