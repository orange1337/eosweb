import { NgModule } from '@angular/core';
import { MainPageComponent } from './main_page.component';
import { MainTableModule } from '../../components/main_table/main_table.module';
import { MatAutocompleteModule,
         MatButtonModule,
         MatInputModule,
         MatPaginatorModule,
         MatProgressSpinnerModule,
         MatSelectModule,
         MatSortModule,
         MatTableModule,
         MatFormFieldModule } from '@angular/material';
//import { MainPageService } from '../../services/main_page.service';
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
    appRoutes,
    MainTableModule ];

@NgModule({
  declarations: [
    MainPageComponent
  ],
  imports:  imports,
  providers: [ /*MainPageService*/ ],
  bootstrap: [ MainPageComponent ]
})
export class MainPageModule {}


