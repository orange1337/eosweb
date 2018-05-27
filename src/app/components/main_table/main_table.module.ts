import { NgModule, PLATFORM_ID,  Inject } from '@angular/core';
import { MainTableComponent } from '../../components/main_table/main_table.component';
import { MatAutocompleteModule,
         MatButtonModule,
         MatInputModule,
         MatPaginatorModule,
         MatProgressSpinnerModule,
         MatSelectModule,
         MatSortModule,
         MatTableModule,
         MatFormFieldModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { appRoutes } from '../../main.router';

import { environment } from '../../../environments/environment';

let imports = [
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    CommonModule,
    appRoutes ];

@NgModule({
  declarations: [
    MainTableComponent
  ],
  imports:  imports,
  exports: [ MainTableComponent ],
  providers: [ ],
  bootstrap: [ MainTableComponent ]
})
export class MainTableModule {}


