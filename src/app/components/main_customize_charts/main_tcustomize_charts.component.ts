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
          domain: ['#D9632C']
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
  blockchainData: any = {};
  aggragationData;
  ramPrice;
  //eos = this.MainService.getGlobalNetConfig();
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

  countTPS(data){
      if (!data || data.length < 2){
           console.log("Data error TPS", data);
           return null;
      }
      let start = data[0].transactions.length;
      let end = data[1].transactions.length;
      return start + end;
  }


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

      this.socket.on('get_last_blocks', res => {
          this.TPSliveTx = this.countTPS(this.MainService.sortBlocks(res));
      });

      this.socket.on('get_aggregation', res => {
          this.aggragationData = res;
      });
  }
}
