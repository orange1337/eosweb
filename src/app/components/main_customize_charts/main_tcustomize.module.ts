import { NgModule } from '@angular/core';
import { MainCustomizeChartsComponent } from './main_tcustomize_charts.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    MainCustomizeChartsComponent,
  ],
  imports:  [
  	NgxChartsModule,
  ],
  exports: [MainCustomizeChartsComponent],
  providers: [],
  bootstrap: [ MainCustomizeChartsComponent ]
})
export class MainTcustomizeModule {}


