import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import * as moment from 'moment';
import { forkJoin } from "rxjs/observable/forkJoin";
import { MainService } from '../../services/mainapp.service';
import { Socket } from 'ng-socket-io';

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
  timeToUpdate = 6000;
  
  firstLoad = true;
  globalTableData;
  producer;
  filterVal = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, protected http: HttpClient, private MainService: MainService, private socket: Socket){}

  getBlockData(){
      if (this.filterVal.length > 0){
          setTimeout(() => { this.getBlockData() }, this.timeToUpdate);
          return console.log('filter val');
      }
      this.spinner   = (this.firstLoad) ? true : false;
  		let producers  = this.http.get(`/api/custom/get_table_rows/eosio/eosio/producers/500`);
      let global     = this.http.get(`/api/v1/get_table_rows/eosio/eosio/global/1`);
      let bpInfo     = this.http.get(`/api/v1/get_producers_bp_json`);

      forkJoin([producers, global, bpInfo])
  				 .subscribe(
                      (results: any) => {
                          this.mainData = results[0].rows;
                          this.totalProducerVoteWeight = results[1].rows[0].total_producer_vote_weight;
                          this.globalTableData = this.joinOtherProducerInfo(this.MainService.countRate(this.MainService.sortArray(this.mainData), this.totalProducerVoteWeight), results[2]);
                          let ELEMENT_DATA: Element[] = this.globalTableData;
                          this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
                          this.dataSource.paginator = this.paginator;
                          this.spinner = false;
                          setTimeout(() => { this.getBlockData() }, this.timeToUpdate);
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                          setTimeout(() => { this.getBlockData() }, this.timeToUpdate);
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
              location: (elem.location.length === 2) ? elem.location : "",
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
    this.filterVal = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
     this.getBlockData();
     this.firstLoad = false;
     
     this.socket.on('get_tps_blocks', (data) => {
       if (!data[1]){
           return;
       }
       if (this.producer === data[1].producer){
           return;
       }
       this.producer = data[1].producer;
     });
  }
}







