import { NgModule } from '@angular/core';
import { VotePageComponent } from './vote.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
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
    MatChipsModule,
    MatIconModule,
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
    VotePageComponent
  ],
  entryComponents: [VotePageComponent],
  imports:  imports,
  providers: [MainService],
  bootstrap: [ VotePageComponent ]
})
export class VotePageModule {}


