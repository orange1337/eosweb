import { NgModule } from '@angular/core';
import { P2PageComponent } from './p2p.component';
import { MatAutocompleteModule,
         MatButtonModule,
         MatInputModule,
         MatPaginatorModule,
         MatProgressSpinnerModule,
         MatProgressBarModule,
         MatSelectModule,
         MatSortModule,
         MatTableModule,
         MatTabsModule,
         MatFormFieldModule,
         MatMenuModule,
         MatDialogModule} from '@angular/material';
import { CommonModule } from '@angular/common';
import { appRoutes } from '../../main.router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';


let imports = [
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    CommonModule,
    appRoutes,
    NgxChartsModule,
    FormsModule ];

@NgModule({
  declarations: [
    P2PageComponent
  ],
  imports:  imports,
  providers: [],
  bootstrap: [ P2PageComponent ]
})
export class P2PageModule {}


