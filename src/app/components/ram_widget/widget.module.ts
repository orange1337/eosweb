import { NgModule, PLATFORM_ID,  Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetComponent } from './widget.component';
import { RamPageModule } from '../../pages/ram/ram.module';

@NgModule({
  declarations: [
    WidgetComponent
  ],
  imports: [ 
    RamPageModule
  ],
  exports: [WidgetComponent]
})
export class WidgetModule {}


