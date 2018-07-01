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

    constructor(public dialog: MatDialog){}


    openDialogMemo(e, data){
        this.dialog.open(DialogDataMemo, {
          data: {
             result: JSON.parse(data)
          }
        });
    }

    ngOnInit(){
      this.dataString = JSON.stringify(this.data)
    }
}

@Component({
  selector: 'dialog-data-memo',
  template: `
  <h1 mat-dialog-title>Data</h1>
  <div mat-dialog-content>
      <ngx-json-viewer [json]="data.result"></ngx-json-viewer>
  </div>
`,
})
export class DialogDataMemo {
  constructor(@Inject(MAT_DIALOG_DATA) public data) {}
}



















