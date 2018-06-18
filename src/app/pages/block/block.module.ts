import { NgModule } from '@angular/core';
import { BlockPageComponent } from './block.component';
import { MatAutocompleteModule,
         MatButtonModule,
         MatInputModule,
         MatPaginatorModule,
         MatProgressSpinnerModule,
         MatSelectModule,
         MatSortModule,
         MatTableModule,
         MatFormFieldModule,
         MatExpansionModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { appRoutes } from '../../main.router';
import { NgxJsonViewerModule } from 'ngx-json-viewer';


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
    NgxJsonViewerModule,
    MatExpansionModule ];

@NgModule({
  declarations: [
    BlockPageComponent
  ],
  imports:  imports,
  providers: [],
  bootstrap: [ BlockPageComponent ]
})
export class BlockPageModule {}


