import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import * as moment from 'moment';
import { tileLayer, latLng, marker, circle, polygon } from 'leaflet';
import { MainService } from '../../services/mainapp.service';
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
  selector: 'producer',
  templateUrl: './producer_page.component.html',
  styleUrls: ['./producer_page.component.css']
})
export class ProducerComponent implements OnInit, OnDestroy{
  spinner = false;
  displayedColumns = ['#', 'Name', 'Key', 'Url', 'Votes', 'Rate'];
  dataSource;
  eosToInt = Math.pow(10, 13);
  totalProducerVoteWeight;
  producer;
  producerId;
  mainElement: any = {};
  bpData;
  rateProducersArr;
  supply;

  options = {
    layers: [
       tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 18, attribution: 'EOSweb' })
    ],
    zoom: 1,
    center: latLng(0, 0)
  };
  
  layers = [];

  constructor(private route: ActivatedRoute, protected http: HttpClient, private MainService: MainService){}

  getData(){
      this.spinner = true;
  		let producers = this.http.get(`/api/custom/get_table_rows/eosio/eosio/producers/500`)
      let global     = this.http.get(`/api/v1/get_table_rows/eosio/eosio/global/1`);
      let stat       = this.http.get(`/api/v1/get_table_rows/eosio.token/TLOS/stat/1`);

      forkJoin([producers, global, stat])
  				 .subscribe(
                      (res: any) => {
                          this.totalProducerVoteWeight = res[1].rows[0].total_producer_vote_weight;
                          this.supply = Number(res[2].rows[0].supply.replace(/[^0-9.-]+/g,""));
                          this.mainElement = this.findProducer(this.MainService.countRate(this.MainService.sortArray(res[0].rows), this.totalProducerVoteWeight, this.supply));
                          this.getBP(this.mainElement);
                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  };

  findProducer(data) {
      if(!data){
        return;
      }
      let result = {};
      data.forEach((elem, index) => {
          if (elem.owner === this.producerId){
              result = elem;
          }
      });
      return result;
  }

  getBP(elem){
    if (!elem || !elem.url){
      return console.log(elem);
    }
      this.http.post(`/api/producer`, { url: `${elem.url}/bp.json` })
               .subscribe(
                (res: any) => {
                   this.bpData = res;
                   if (res.nodes && res.nodes.length){
                       res.nodes.forEach(elem => {
                         if (elem.location && elem.location.latitude && elem.location.longitude){
                            this.layers.push(circle([ elem.location.latitude, elem.location.longitude ], { radius: 1000 }));
                         }
                       });
                   }
                },
                (err) => {
                  console.error(err);
                });
  }

  ngOnInit() {
     this.producer = this.route.params.subscribe(params => {
       this.producerId = params['id'];
       console.log(this.producerId);
       this.getData();
    });
  }

  ngOnDestroy() {
    this.producer.unsubscribe(); 
    //this.subscription.unsubscribe();
  }
}







