import { NgModule } from '@angular/core';
import { ProducersPageComponent } from './producers.component';
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
import { MainService } from '../../services/mainapp.service';


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
    ProducersPageComponent
  ],
  imports:  imports,
  providers: [MainService],
  bootstrap: [ ProducersPageComponent ]
})
export class ProducersPageModule {}


