import { NgModule } from '@angular/core';
import { WalletPageComponent } from './wallet.component';
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
import { ActionsViewerModule } from '../../components/actions_view/action_viewer.module';
import { FormsModule } from '@angular/forms';


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
    MatDialogModule,
    ActionsViewerModule,
    FormsModule ];

@NgModule({
  declarations: [
    WalletPageComponent,
  ],
  entryComponents: [WalletPageComponent],
  imports:  imports,
  providers: [MainService],
  bootstrap: [ WalletPageComponent ]
})
export class WalletPageModule {}


