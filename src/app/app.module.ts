import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Inject, APP_ID, PLATFORM_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule,
         MatFormFieldModule,
         MatInputModule,
         MatSelectModule,
         MatMenuModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CdkTableModule } from '@angular/cdk/table'; 

import { AppComponent } from './app.component';
import { appRoutes, appRoutingProviders } from './main.router';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SimpleNotificationsModule } from 'angular2-notifications';
//import { AuthService } from './services/auth.service';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    appRoutes,
    BrowserAnimationsModule,
    HttpClientModule,
    CdkTableModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    //MainTcustomizeModule,
    SimpleNotificationsModule.forRoot()
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule {}



