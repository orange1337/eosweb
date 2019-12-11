import { NgModule, PLATFORM_ID,  Inject } from '@angular/core';
import { ActionsViewerComponent, DialogDataMemo } from './action_viewer.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
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


