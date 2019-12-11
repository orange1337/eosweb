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

import { ActionsViewerModule } from '../actions_view/action_viewer.module';

import { MainService } from '../../services/mainapp.service';

import { ProducersPageModule } from '../../pages/producers/producers.module';

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
    ActionsViewerModule,
    ProducersPageModule ];

@NgModule({
  declarations: [
    MainTableComponent
  ],
  imports:  imports,
  exports: [ MainTableComponent ],
  providers: [ MainService ],
  bootstrap: [ MainTableComponent ]
})
export class MainTableModule {}


