import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { MainService } from '../../services/mainapp.service';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { environment } from '../../../environments/environment';

import { ScatterService } from '../../services/scatter.service';
import { LoginEOSService } from 'eos-ulm';

@Component({
  selector: 'vote-page',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VotePageComponent implements OnInit {
  
  vote = {
    voter: '',
    proxy: '',
    producers: ['eoswebnetbp1', 'cryptolions1']
  };

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  frontConfig = environment.frontConfig;

  constructor(public scatterService: ScatterService,
              public loginEOSService: LoginEOSService){
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.vote.producers.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  remove(producer): void {
    const index = this.vote.producers.indexOf(producer);

    if (index >= 0) {
      this.vote.producers.splice(index, 1);
    }
  }



  ngOnInit() {}
}
