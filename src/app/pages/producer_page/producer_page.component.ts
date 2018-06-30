import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import * as moment from 'moment';
import { tileLayer, latLng, marker, circle, polygon } from 'leaflet';

@Component({
  selector: 'producer',
  templateUrl: './producer_page.component.html',
  styleUrls: ['./producer_page.component.css']
})
export class ProducerComponent implements OnInit, OnDestroy{
  mainData;
  spinner = false;
  displayedColumns = ['#', 'Name', 'Key', 'Url', 'Votes', 'Rate'];
  dataSource;
  eosToInt = Math.pow(10, 13);
  allvotes;
  producer;
  producerId;
  mainElement;
  bpData;
  vouteData = 0;

  options = {
    layers: [
       tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 18, attribution: 'EOSweb' })
    ],
    zoom: 1,
    center: latLng(0, 0)
  };
  
  layers = [];

  constructor(private route: ActivatedRoute, protected http: HttpClient){}

  getBlockData(){
      this.spinner = true;
  		this.http.get(`/api/custom/get_table_rows/eosio/eosio/producers/500`)
  				 .subscribe(
                      (res: any) => {
                          this.mainData = this.sortArray(res.rows);
                          this.getBP(this.mainElement);
                          this.getGlobalData();
                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  };

  getGlobalData(){
      this.http.get(`/api/v1/get_table_rows/eosio/eosio/global/1`)
           .subscribe(
                      (res: any) => {
                          this.allvotes = res.rows[0].total_producer_vote_weight;
                          this.vouteData = this.mainElement.total_votes / this.allvotes * 100;
                      },
                      (error) => {
                          console.error(error);
                      });
  };

  sortArray(data) {
      if(!data){
        return;
      }
      let result = data.sort((a, b) => {
          return b.total_votes - a.total_votes;
      }).map((elem, index) => {
          if (elem.owner === this.producerId){
              elem.index = index + 1;
              this.mainElement = elem;
          }
          return elem;
      });
      return result;
  }

  getBP(elem){
    if (!elem.url){
      return console.log(elem);
    }
      this.http.get(`${elem.url}/bp.json`)
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
       this.getBlockData();
    });
  }

  ngOnDestroy() {
    this.producer.unsubscribe(); 
    //this.subscription.unsubscribe();
  }
}







