import { Component, ViewChild, OnInit, Input, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'action-viewer',
  templateUrl: './action_viewer.component.html',
  styleUrls: ['./action_viewer.component.css']
})
export class ActionsViewerComponent implements OnInit {
    @Input() data;
    @Input() length;

    dataString: string = '';
    dataObj = {};

    constructor(public dialog: MatDialog){}


    openDialogMemo(e, data){
        let result = data;
        let json = false;
        if (data.indexOf('{') >= 0 && data.indexOf('}') >= 0){
            result = JSON.parse(data);
            json = true;
        }
        this.dialog.open(DialogDataMemo, {
          data: {
             result: result,
             json: json
          }
        });
    }

    ngOnInit(){
      this.dataString = (this.data) ? JSON.stringify(this.data.data) : '';
      this.dataObj = (this.data) ? this.data.data : '';
    }
}

@Component({
  selector: 'dialog-data-memo',
  template: `
  <h1 mat-dialog-title>Data</h1>
  <div mat-dialog-content>
      <ngx-json-viewer [json]="data.result" *ngIf="data.json"></ngx-json-viewer>
      <small *ngIf="!data.json">{{data.result}}</small>
  </div>
`,
})
export class DialogDataMemo {
  constructor(@Inject(MAT_DIALOG_DATA) public data) {}
}



















