import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import * as moment from 'moment';
import { forkJoin } from "rxjs/observable/forkJoin";
import { MainService } from '../../services/mainapp.service';

@Component({
  selector: 'producers-page',
  templateUrl: './producers.component.html',
  styleUrls: ['./producers.component.css']
})
export class ProducersPageComponent implements OnInit{
  mainData;
  spinner = false;
  displayedColumns = ['#', 'Name', 'Status', 'Url', 'Location', 'Total Votes', 'Rate', 'Rewards'];
  dataSource;
  eosToInt = Math.pow(10, 13);
  totalProducerVoteWeight;
  sortedArray;
  votesToRemove;

  constructor(private route: ActivatedRoute, protected http: HttpClient, private MainService: MainService){}

  getBlockData(){
      this.spinner   = true;
  		let producers  = this.http.get(`/api/custom/get_table_rows/eosio/eosio/producers/500`);
      let global     = this.http.get(`/api/v1/get_table_rows/eosio/eosio/global/1`);
      let bpInfo     = this.http.get(`/api/v1/get_producers_bp_json`);

      forkJoin([producers, global, bpInfo])
  				 .subscribe(
                      (results: any) => {
                          this.mainData = results[0].rows;
                          this.totalProducerVoteWeight = results[1].rows[0].total_producer_vote_weight;
                          let ELEMENT_DATA: Element[] = this.joinOtherProducerInfo(this.MainService.countRate(this.MainService.sortArray(this.mainData), this.totalProducerVoteWeight), results[2]);
                          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  };

  joinOtherProducerInfo(sortedArr, joinArr){
      let result = [];
      let joinObj = {};
      if (!joinArr){
          return sortedArr;
      }  
      joinArr.forEach(elem => {
           joinObj[elem.name] = {
              location: elem.location,
              image: elem.image
           };
      });
      sortedArr.forEach(elem => {
            if(joinObj[elem.owner]){
               elem.location = joinObj[elem.owner].location.toLowerCase(); 
               elem.image = joinObj[elem.owner].image; 
            }
      });
      return sortedArr;
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
     this.getBlockData();
  }
}







