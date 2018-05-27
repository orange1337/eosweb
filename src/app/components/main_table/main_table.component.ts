import { Component, ViewChild, OnInit, Inject, Optional, PLATFORM_ID  } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { isPlatformBrowser } from '@angular/common';

export interface Element {
  Name: string;
  Price: number;
  high: number;
  low: number;
  Market_cap: string;
  Change: number;
  Vol: string;
  Volume: string;
}
@Component({
  selector: 'main-table',
  templateUrl: './main_table.component.html',
  styleUrls: ['./main_table.component.css']
})
export class MainTableComponent implements OnInit{
  
  ngxChartOptions = {
      colorScheme : {domain: ['#7697ed']},
      view : [160, 60],
      showXAxis : false,
      showYAxis : false,
      gradient : false,
      showLegend : false,
      showXAxisLabel : false,
      xAxisLabel : 'Country',
      showYAxisLabel : false,
      yAxisLabel : 'Population',
      autoScale : true,
  };
  curve;
  currMap: any;
  currencyName = 'USD'; //(isPlatformBrowser(this.platformId)) ? this.getCookie('currencyName'): ;
  selected = this.currencyName;
  currencies = ['USD', 'EUR', 'GBP', 'RUB'];
  symbolsMap = {
    'USD': '<i class="fas fa-dollar-sign"></i>',
    'EUR': '€',
    'GBP': '£',
    'RUB': '₽',    
  };



  mainData;
  mainChartDataRes;
  counterChartLoading = 0;
  displayedColumns = ['Name',  'Marketcap', 'Price', 'High/Low', 'Vol/Volume', 'Change (24H)', 'Chart (7D)'];
  dataSource;
  dataLoaded = false;
  counter = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(protected http: HttpClient,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getData() {
        this.http.get('/api/v1/ex/coinstock/pairs/stats/all')
                  .subscribe(
                      (res: any) => {
                          let data = res.response.coinstock.pairsStats;
                          this.mainData = data;
                          //this.MainPageService.setData(data);

                          let self = this;

                          this.getChartData();

                          let ELEMENT_DATA: Element[] = this.sortByMarketCap(this.createArray(data));
                          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
                          this.dataSource.paginator = this.paginator;
                          this.dataSource.sort = this.sort;
                      },
                      (error) => {
                          console.error(error);
                      });
  }
  
  
  getChartData(){
       this.http.get('/api/v1/ex/coinstock/pairs/chart/all')
                .subscribe(
                      (res: any) => {
                          this.mainChartDataRes = res.response.coinstock.pairChart;
                      },
                      (error) => {
                          console.error(error);
                      }); 
  }

  createArray(data: Object){
    let result = [];
    let self = this;
    Object.keys(data).forEach(function(key){
          if (key.split('_')[1] !== self.currencyName){
            return;
          }
          let vol = Number(data[key].volume) * Number(data[key].price);
          let name = key.split('_')[0];
          result.push({ Name: name, 
                        Price: Number(data[key].price).toFixed(2),
                        high: Number(data[key].high).toFixed(2),
                        low: Number(data[key].low).toFixed(2),
                        Vol: self.numberStyle(vol.toFixed(0)),
                        Market_cap: self.numberStyle(Number(data[key].marketCap)),
                        Change: Number(data[key].change).toFixed(2),
                        Volume: self.numberStyle(data[key].volume.toFixed(0))
                      });
    });
    return result;
  }


  numberStyle(number){
    var string = String(number);
    var array = string.split('');
      for (var i = array.length - 3; i > 0 ; i -= 3) {
            array[i] = ' ' + array[i]; 
      }
    return array.join('');
  }

  sortByMarketCap(dataObj){
    dataObj.sort(function (a, b) {
      let sa = Number(a.Market_cap.split(" ").join(""));
      let sb = Number(b.Market_cap.split(" ").join(""));
      if (sa > sb) { return -1; }
      if (sa < sb) { return 1; }
      return 0;
    });
    return dataObj;
  }

  selectCurrency(event, currName){
      event.preventDefault();
      document.cookie = 'currencyName=' + currName;
      this.currencyName = currName;
      this.getData();
  }

  getCookie(name) {
      let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  ngOnInit() {
      this.getData();
  }
}





















