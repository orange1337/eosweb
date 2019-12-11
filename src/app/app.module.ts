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
//import { SimpleNotificationsModule } from 'angular2-notifications';
//import { AuthService } from './services/auth.service';

import { MainPageModule } from './pages/main_page/main_page.module';
import { BlockPageModule } from './pages/block/block.module';
import { TokensPageModule } from './pages/tokens/tokens.module';
import { ProducersPageModule } from './pages/producers/producers.module';
import { ProducerModule } from './pages/producer_page/producer_page.module';
import { AnalyticsPageModule } from './pages/analytics/analytics.module';
import { RamPageModule } from './pages/ram/ram.module';
import { TransactionPageModule } from './pages/transactions/transactions.module';
import { WalletPageModule } from './pages/wallet/wallet.module';
import { VotePageModule } from './pages/vote/vote.module';
import { AccountPageModule } from './pages/account/account.module';
import { AddressPageModule } from './pages/address/address.module';
import { SoonModule } from './pages/soon/soon.module';
import { MainTcustomizeModule } from './components/main_customize_charts/main_tcustomize.module';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { WidgetModule } from './components/ram_widget/widget.module';

import { environment } from '../environments/environment';
import { LoginEOSModule } from 'eos-ulm';

import { ScatterService } from './services/scatter.service';

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
    //SimpleNotificationsModule.forRoot(),
    SocketIoModule.forRoot(socketConfig),
    LeafletModule.forRoot(),
    LoginEOSModule.forRoot({
          appName: environment.appName,
          httpEndpoint: environment.Eos.httpEndpoint,
          chain: environment.chain,
          verbose: environment.Eos.verbose,
          blockchain: environment.network.blockchain,
          host: environment.network.host,
          port: environment.network.port,
          protocol: environment.network.protocol,
          expireInSeconds: environment.network.expireInSeconds
    }),
    MainPageModule,
    BlockPageModule,
    TokensPageModule,
    AccountPageModule,
    AddressPageModule,
    TransactionPageModule,
    WalletPageModule,
    VotePageModule,
    ProducersPageModule,
    ProducerModule,
    AnalyticsPageModule,
    RamPageModule,
    SoonModule,
    WidgetModule
  ],
  providers: [appRoutingProviders, ScatterService],
  bootstrap: [AppComponent]
})
export class AppModule {}



