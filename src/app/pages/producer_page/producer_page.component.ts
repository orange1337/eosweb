import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import * as moment from 'moment';
import { tileLayer, latLng, marker, circle, polygon } from 'leaflet';
import { MainService } from '../../services/mainapp.service';
import { forkJoin } from "rxjs/observable/forkJoin";
import { environment } from '../../../environments/environment';

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
  mainElement;
  bpData;
  rateProducersArr;
  voters;

  options = {
    layers: [
       tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 18, attribution: 'EOSweb' })
    ],
    zoom: 1,
    center: latLng(0, 0)
  };
  layers = [];
  frontConfig = environment.frontConfig;

  constructor(private route: ActivatedRoute, protected http: HttpClient, private MainService: MainService){
  }

  getData(){
      this.spinner = true;
  		let producers = this.http.get(`/api/custom/get_table_rows/eosio/eosio/producers/500`)
      let global     = this.http.get(`/api/v1/get_table_rows/eosio/eosio/global/1`);

      forkJoin([producers, global])
  				 .subscribe(
                      (res: any) => {
                          this.totalProducerVoteWeight = res[1].rows[0].total_producer_vote_weight;
                          this.mainElement = this.findProducer(this.MainService.countRate(this.MainService.sortArray(res[0].rows), this.totalProducerVoteWeight));
                          console.log(this.mainElement)
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

  getLastVotes(accountName){
     this.http.get(`/api/v1/get_voters/${accountName}?limit=20`)
           .subscribe((res: any) => {
                          this.voters = res;
                          if (!res.voters){
                             return;
                          }
                          res.voters.forEach(elem => {
                              this.getStakeBalances(elem);
                          });
                      },
                      (error) => {
                          console.error(error);
                      });
  }

  getStakeBalances(elem){
    if(elem.act && elem.act.data && elem.act.data.voter){
      this.http.get(`/api/v1/get_account/${elem.act.data.voter}`)
           .subscribe((res: any) => {
                           if (res && res.voter_info && res.voter_info.staked){
                                elem.stake = res.voter_info.staked / 10000;
                           }
                      },
                      (error) => {
                          console.error(error);
                      });
    }
  }

  ngOnInit() {
    this.producer = this.route.params.subscribe(params => {
       this.producerId = params['id'];
       this.getData();
       this.getLastVotes(this.producerId);
    });
  }

  ngOnDestroy() {
    this.producer.unsubscribe(); 
  }
}







