import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'producers-page',
  templateUrl: './producers.component.html',
  styleUrls: ['./producers.component.css']
})
export class ProducersPageComponent implements OnInit{
  mainData;
  spinner = false;
  displayedColumns = ['#', 'Name', 'Key', 'Url', 'Votes', 'Rate'];
  dataSource;
  eosToInt = Math.pow(10, 13);

  constructor(private route: ActivatedRoute, protected http: HttpClient){}

  getBlockData(){
      this.spinner = true;
  		this.http.get(`/api/v1/get_table_rows/eosio/eosio/producers/300`)
  				 .subscribe(
                      (res: any) => {
                          this.mainData = res.rows;
                          let ELEMENT_DATA: Element[] = this.sortArray(this.countRate(this.mainData));
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
      }).map(elem => {
          elem.total_votes = Number(elem.total_votes).toLocaleString();
          return elem;
      });
      return result;
  }

  countRate(data){
      if(!data){
        return;
      }
      let allvotes = 0;
      data.forEach((elem) => {
           allvotes += Number(elem.total_votes);
      });
      data.forEach(elem => {
          elem.rate = (elem.total_votes / allvotes * 100).toLocaleString();
      });
      console.log(data);
      return data;
  }

  ngOnInit() {
     this.getBlockData();
  }
}







