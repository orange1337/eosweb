import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { MainService } from '../../services/mainapp.service';

@Component({
  selector: 'tokens-page',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.css']
})
export class TokensPageComponent implements OnInit{
  blockId;
  block;
  mainData;
  moment = moment;
  time;
  trxArr = [];
  dataSource;
  displayedColumns = ['name', 'description', 'url', 'сreator', 'status', 'date'];
  spinner = false;

  /*@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;*/

  constructor(protected http: HttpClient){}
	
  ngOnInit(){

  }
}

