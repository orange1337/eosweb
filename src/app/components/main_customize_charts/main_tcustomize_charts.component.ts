import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as shape from 'd3-shape';

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
      view : [135, 70],
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
  curve = shape.curveBasis;

  constructor(private http: HttpClient){}

  getData() {
        this.http.get('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=EOS&tsyms=USD')
                  .subscribe(
                      (res: any) => {
                           this.currencyObj = res;
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

  createChartArr(data){
    let result = [];
      data.forEach(elem => {
          result.push({ name: new Date(elem.time * 1000), value: elem.close});
      });
    return result;
  }

  ngOnInit() {
      this.getData();
      this.getChart();
  }
}
