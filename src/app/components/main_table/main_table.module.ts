import { NgModule, PLATFORM_ID,  Inject } from '@angular/core';
import { MainTableComponent } from '../../components/main_table/main_table.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
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


