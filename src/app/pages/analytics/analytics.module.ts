import { NgModule } from '@angular/core';
import { AnalyticsPageComponent } from './analytics.component';
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
    AnalyticsPageComponent
  ],
  imports:  imports,
  providers: [],
  bootstrap: [ AnalyticsPageComponent ]
})
export class AnalyticsPageModule {}


