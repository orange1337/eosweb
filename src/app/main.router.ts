import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './pages/main_page/main_page.component';
import { BlockPageComponent } from './pages/block/block.component';
import { TransactionPageComponent } from './pages/transactions/transactions.component';
import { AccountPageComponent } from './pages/account/account.component';
import { AddressPageComponent } from './pages/address/address.component';
import { ProducersPageComponent } from './pages/producers/producers.component';
import { ProducerComponent } from './pages/producer_page/producer_page.component';
import { AnalyticsPageComponent } from './pages/analytics/analytics.component';
import { TokensPageComponent } from './pages/tokens/tokens.component';
// import { RamPageComponent } from './pages/ram/ram.component';
import { SoonComponent } from './pages/soon/soon.component';
// import { WalletPageComponent } from './pages/wallet/wallet.component';
// import { VotePageComponent } from './pages/vote/vote.component';
import { WidgetComponent } from './components/ram_widget/widget.component';

export const routes: Routes = [
  {
  	path: '',
  	component: MainPageComponent,
  	pathMatch: 'full'
  },
   {
  	path: 'block/:id',
  	component: BlockPageComponent
  },
  {
    path: 'account/:id',
    component: AccountPageComponent
  },
  {
    path: 'address/:id',
    component: AddressPageComponent
  },
  {
    path: 'producers',
    component: ProducersPageComponent
  },
  {
    path: 'producer/:id',
    component: ProducerComponent
  },
  // {
  //   path: 'analytics',
  //   component: AnalyticsPageComponent
  // },
  {
    path: 'accounts',
    component: AnalyticsPageComponent
  },
  // {
  //   path: 'ram',
  //   component: RamPageComponent
  // },
  {
    path: 'transaction/:id',
    component: TransactionPageComponent
  },
  // {
  //   path: 'wallet',
  //   component: WalletPageComponent
  // },
  // {
  //   path: 'vote',
  //   component: VotePageComponent
  // },
  {
    path: 'tokens',
    component: TokensPageComponent
  },
  {
    path: "widget/ram",
    component: WidgetComponent
  },
  {
    path: 'notfound',
    component: SoonComponent
  },
  { path: '**', redirectTo: '' },
]

export const appRoutingProviders: any[] = [
	//AuthGuard
];

export const appRoutes = RouterModule.forRoot(routes);
