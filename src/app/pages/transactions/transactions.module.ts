import { NgModule } from '@angular/core';
import { TransactionPageComponent, DialogDataMemo } from './transactions.component';
import { MatAutocompleteModule,
         MatButtonModule,
         MatInputModule,
         MatPaginatorModule,
         MatProgressSpinnerModule,
         MatProgressBarModule,
         MatSelectModule,
         MatSortModule,
         MatTableModule,
         MatFormFieldModule,
         MatExpansionModule,
         MatTabsModule,
         MatDialogModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { appRoutes } from '../../main.router';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { MainService } from '../../services/mainapp.service';


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
    MatExpansionModule,
    NgxJsonViewerModule,
    MatTabsModule,
    MatDialogModule ];

@NgModule({
  declarations: [
    TransactionPageComponent,
    DialogDataMemo
  ],
  entryComponents: [TransactionPageComponent, DialogDataMemo],
  imports:  imports,
  providers: [MainService],
  bootstrap: [ TransactionPageComponent ]
})
export class TransactionPageModule {}


