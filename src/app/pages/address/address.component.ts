import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { MainService } from '../../services/mainapp.service';

@Component({
  selector: 'address-page',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressPageComponent implements OnInit, OnDestroy{
  address;
  addressBlock;
  mainData;
  moment = moment;
  spinner = false;
  subscription;
  displayedColumnsPermissiopn = ['Permission', 'Address', 'Threshold', 'Weight'];
  dataSourcePermission;

  constructor(private route: ActivatedRoute, protected http: HttpClient, private MainService: MainService){}

  getAddressData(address){
      this.spinner = true;
  		this.http.get(`/api/v1/get_key_accounts/${address}`)
  				 .subscribe((res: any) => {
                          this.mainData = res;
                          //let ELEMENT_DATA: Element[] = this.mainData.permissions;
                          //this.dataSourcePermission = new MatTableDataSource<Element>(ELEMENT_DATA);

                          this.spinner = false;
                      },
                      (error) => {
                          console.error(error);
                          this.spinner = false;
                      });
  };


  ngOnInit() {
    this.addressBlock = this.route.params.subscribe(params => {
       this.address = params['id'];
       this.getAddressData(this.address);
    });
  }

  ngOnDestroy() {
    this.addressBlock.unsubscribe(); 
  }	
}