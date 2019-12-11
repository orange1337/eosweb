import { NgModule } from '@angular/core';
import { TokensPageComponent } from './tokens.component';
import { MatAutocompleteModule,
         MatButtonModule,
         MatInputModule,
         MatPaginatorModule,
         MatProgressSpinnerModule,
         MatSelectModule,
         MatSortModule,
         MatTableModule,
         MatFormFieldModule,
         MatExpansionModule,
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
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    CommonModule,
    appRoutes,
    NgxJsonViewerModule,
    MatExpansionModule,
    MatDialogModule,
];

@NgModule({
  declarations: [
    TokensPageComponent
  ],
  entryComponents: [TokensPageComponent],
  imports:  imports,
  providers: [MainService],
  bootstrap: [ TokensPageComponent ]
})
export class TokensPageModule {}


