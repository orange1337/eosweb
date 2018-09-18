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
  displayedColumns = ['#', 'Name', 'Status', 'Url', 'Total Votes', 'Rate', 'Rewards'];
  dataSource;
  eosToInt = Math.pow(10, 13);
  totalProducerVoteWeight;
  sortedArray;
  votesToRemove;
  supply;

  constructor(private route: ActivatedRoute, protected http: HttpClient, private MainService: MainService){}

  getBlockData(){
      this.spinner   = true;
  		let producers  = this.http.get(`/api/custom/get_table_rows/eosio/eosio/producers/500`)
      let global     = this.http.get(`/api/v1/get_table_rows/eosio/eosio/global/1`);
      let stat       = this.http.get(`/api/v1/get_table_rows/eosio.token/TLOS/stat/1`);

      forkJoin([producers, global, stat])
  				 .subscribe(
                      (results: any) => {
                          this.mainData = results[0].rows;
                          this.totalProducerVoteWeight = results[1].rows[0].total_producer_vote_weight;
                          this.supply = Number(results[2].rows[0].supply.replace(/[^0-9.-]+/g,""));
                          let ELEMENT_DATA: Element[] = this.MainService.countRate(this.MainService.sortArray(this.mainData), this.totalProducerVoteWeight, this.supply);
                          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
                          this.dataSource.filterPredicate = (data, filter) => data.owner.toLowerCase().indexOf(filter) > -1 || data.url.toLowerCase().indexOf(filter) > -1;
                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  };


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
     this.getBlockData();
  }
}







