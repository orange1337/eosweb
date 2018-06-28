import { NgModule } from '@angular/core';
import { AccountPageComponent, DialogDataMemo } from './account.component';
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
         MatToolbarModule,
         MatTooltipModule,
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
    NgxJsonViewerModule,
    MatExpansionModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule ];

@NgModule({
  declarations: [
    AccountPageComponent,
    DialogDataMemo
  ],
  entryComponents: [AccountPageComponent, DialogDataMemo],
  imports:  imports,
  providers: [MainService],
  bootstrap: [ AccountPageComponent ]
})
export class AccountPageModule {}


