import { NgModule, PLATFORM_ID,  Inject } from '@angular/core';
import { ActionsViewerComponent, DialogDataMemo } from './action_viewer.component';
import { MatAutocompleteModule,
         MatButtonModule,
         MatInputModule,
         MatPaginatorModule,
         MatProgressSpinnerModule,
         MatSelectModule,
         MatSortModule,
         MatTableModule,
         MatFormFieldModule, 
         MatDialogModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { appRoutes } from '../../main.router';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

let imports = [
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    CommonModule,
    appRoutes,
    NgxJsonViewerModule ];

@NgModule({
  declarations: [
    ActionsViewerComponent, DialogDataMemo
  ],
  entryComponents: [ ActionsViewerComponent, DialogDataMemo ],
  imports:  imports,
  exports: [ ActionsViewerComponent, DialogDataMemo ],
  providers: [ ],
  bootstrap: [ ActionsViewerComponent, DialogDataMemo ]
})
export class ActionsViewerModule {}


