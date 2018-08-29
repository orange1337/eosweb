import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import * as moment from 'moment';
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
  selector: 'producers-page',
  templateUrl: './producers.component.html',
  styleUrls: ['./producers.component.css']
})
export class ProducersPageComponent implements OnInit{
  mainData;
  spinner = false;
  displayedColumns = ['#', 'Name', 'Status', 'Url', 'Total Votes', 'Rate', 'Rewards'];
  dataSource;
  eosToInt = Math.pow(10, 13);
  allvotes;
  sortedArray;
  votesToRemove;

  constructor(private route: ActivatedRoute, protected http: HttpClient){}

  getBlockData(){
      this.spinner   = true;
  		let producers  = this.http.get(`/api/custom/get_table_rows/eosio/eosio/producers/500`)
      let global     = this.http.get(`/api/v1/get_table_rows/eosio/eosio/global/1`);

      forkJoin([producers, global])
  				 .subscribe(
                      (results: any) => {
                          this.mainData = results[0].rows;
                          this.allvotes = results[1].rows[0].total_producer_vote_weight;
                          let ELEMENT_DATA: Element[] = this.countRate(this.sortArray(this.mainData));
                          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  };

  sortArray(data) {
      if(!data){
        return;
      }
      let result = data.sort((a, b) => {
          return b.total_votes - a.total_votes;
      }).map((elem, index) => {
          let eos_votes = Math.floor(this.calculateEosFromVotes(elem.total_votes));
          elem.all_votes = elem.total_votes;
          elem.total_votes = Number(eos_votes).toLocaleString();
          elem.index = index + 1;
          return elem;
      });
      return result;
  }

  countRate(data){
      if(!data){
        return;
      }
      this.votesToRemove = data.reduce((acc, cur) => {
            const percentageVotes = cur.all_votes / this.allvotes * 100;
            if (percentageVotes * 200 < 100) {
              acc += parseFloat(cur.all_votes);
            }
            return acc;
      }, 0);
      data.forEach((elem) => {
        elem.rate    = (elem.all_votes / this.allvotes * 100).toLocaleString();
        elem.rewards = this.countRewards(elem.all_votes, elem.index);
      });
      
      return data;
  }

  calculateEosFromVotes(votes){
      let date = +new Date() / 1000 - 946684800;
      let weight = parseInt(`${ date / (86400 * 7) }`, 10) / 52; // 86400 = seconds per day 24*3600
      return votes / (2 ** weight) / 10000;
  };

  countRewards(total_votes, index){
    let position = index;
    let reward = 0;
    let percentageVotesRewarded = total_votes / (this.allvotes - this.votesToRemove) * 100;
     
     if (position < 22) {
       reward += 318;
     }
     reward += percentageVotesRewarded * 200;
     if (reward < 100) {
       reward = 0;
     }
     return Math.floor(reward).toLocaleString();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
     this.getBlockData();
  }
}







