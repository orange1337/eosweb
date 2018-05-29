import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'block-page',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css']
})
export class BlockPageComponent implements OnInit, OnDestroy{
  blockId;
  block;
  mainData;

  constructor(private route: ActivatedRoute, protected http: HttpClient){}

  getBlockData(blockId){
  		this.http.get(`/api/v1/get_block/${blockId}`)
  				 .subscribe(
                      (res: any) => {
                          this.mainData = res;
                      },
                      (error) => {
                          console.error(error);
                      });
  };

  ngOnInit() {
    this.block = this.route.params.subscribe(params => {
       this.blockId = params['id'];
       this.getBlockData(this.blockId);
    });
  }

  ngOnDestroy() {
    this.block.unsubscribe(); 
  }	
}