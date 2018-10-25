import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
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
export class ProducersPageComponent implements OnInit, OnDestroy{
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
  bpJson;
  globalTable;
  chainPercentage;
  chainNumber;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, protected http: HttpClient, private MainService: MainService, private socket: Socket){}

  getBlockData(){
      this.spinner   = (this.firstLoad) ? true : false;
  		let producers  = this.http.get(`/api/custom/get_table_rows/eosio/eosio/producers/500`);
      let global     = this.http.get(`/api/v1/get_table_rows/eosio/eosio/global/1`);
      let bpInfo     = this.http.get(`/api/v1/get_producers_bp_json`);

      forkJoin([producers, global, bpInfo])
  				 .subscribe(
                      (results: any) => {
                          this.totalProducerVoteWeight = results[1].rows[0].total_producer_vote_weight;
                          this.bpJson = results[2];
                          this.globalTable = results[1];
                          this.calculateTotalVotes(this.globalTable);
                          this.createTable(results[0], this.totalProducerVoteWeight, this.bpJson);

                          this.socket.on('producers', (data) => {
                            if (!data) return;
                            this.createTable(data, this.totalProducerVoteWeight, this.bpJson);
                          });

                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  };

  createTable(table, totalVotes, bpJson){
      if (this.filterVal.length > 0){
          return console.log('filter val');
      }
      this.mainData = table.rows;
      this.globalTableData = this.joinOtherProducerInfo(this.MainService.countRate(this.MainService.sortArray(this.mainData), totalVotes), bpJson);
      let ELEMENT_DATA: Element[] = this.globalTableData;
      this.dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
  }

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

  calculateTotalVotes(global){
      if (!global || !global.rows || !global.rows[0] || !global.rows[0].total_activated_stake){
          return;
      }
      this.chainPercentage = (global.rows[0].total_activated_stake / 10000 / 1000011818 * 100).toFixed(2);
      this.chainNumber = global.rows[0].total_activated_stake / 1000011818 * 100000;
  }

  applyFilter(filterValue: string) {
    this.filterVal = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
     this.getBlockData();
     this.firstLoad = false;
     this.MainService.currentMessage.subscribe(message => this.producer = message)
  }
  ngOnDestroy() {
     this.socket.removeAllListeners('producers');
  }
}







