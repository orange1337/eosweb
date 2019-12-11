import { NgModule } from '@angular/core';
import { RamPageComponent } from './ram.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
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
    RamPageComponent
  ],
  imports:  imports,
  providers: [],
  exports: [RamPageComponent],
  bootstrap: [ RamPageComponent ]
})
export class RamPageModule {}


