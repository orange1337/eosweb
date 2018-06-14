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

import { MainPageModule } from './pages/main_page/main_page.module';
import { BlockPageModule } from './pages/block/block.module';
import { ProducersPageModule } from './pages/producers/producers.module';
import { TransactionPageModule } from './pages/transactions/transactions.module';
import { AccountPageModule } from './pages/account/account.module';
import { MainTcustomizeModule } from './components/main_customize_charts/main_tcustomize.module';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

const socketConfig: SocketIoConfig = { url: '/', options: {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 5
}};

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
    MainTcustomizeModule,
    SimpleNotificationsModule.forRoot(),
    SocketIoModule.forRoot(socketConfig),
    MainPageModule,
    BlockPageModule,
    AccountPageModule,
    TransactionPageModule,
    ProducersPageModule
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule {}



