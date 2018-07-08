import { NgModule } from '@angular/core';
import { RamPageComponent } from './ram.component';
import { MatAutocompleteModule,
         MatButtonModule,
         MatInputModule,
         MatPaginatorModule,
         MatProgressSpinnerModule,
         MatProgressBarModule,
         MatSelectModule,
         MatSortModule,
         MatTableModule,
         MatFormFieldModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { appRoutes } from '../../main.router';
import { NgxChartsModule } from '@swimlane/ngx-charts';


let imports = [
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    CommonModule,
    appRoutes,
    NgxChartsModule ];

@NgModule({
  declarations: [
    RamPageComponent
  ],
  imports:  imports,
  providers: [],
  bootstrap: [ RamPageComponent ]
})
export class RamPageModule {}


