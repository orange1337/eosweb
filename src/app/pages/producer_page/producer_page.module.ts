import { NgModule } from '@angular/core';
import { ProducerComponent } from './producer_page.component';
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

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

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
    appRoutes,
    LeafletModule ];

@NgModule({
  declarations: [
    ProducerComponent
  ],
  imports:  imports,
  providers: [],
  bootstrap: [ ProducerComponent ]
})
export class ProducerModule {}


