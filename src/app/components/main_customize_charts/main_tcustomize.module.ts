import { NgModule } from '@angular/core';
import { MainCustomizeChartsComponent } from './main_tcustomize_charts.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MainService } from '../../services/mainapp.service';
import { appRoutes } from '../../main.router';

@NgModule({
  declarations: [
    MainCustomizeChartsComponent,
  ],
  imports:  [
  	NgxChartsModule,
  	appRoutes
  ],
  exports: [MainCustomizeChartsComponent],
  providers: [MainService],
  bootstrap: [ MainCustomizeChartsComponent ]
})
export class MainTcustomizeModule {}


