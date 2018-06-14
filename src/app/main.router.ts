import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './pages/main_page/main_page.component';
import { BlockPageComponent } from './pages/block/block.component';
import { TransactionPageComponent } from './pages/transactions/transactions.component';
import { AccountPageComponent } from './pages/account/account.component';
import { ProducersPageComponent } from './pages/producers/producers.component';
//import { AuthGuard } from './auth.guard';

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
    path: 'producers', 
    component: ProducersPageComponent 
  },
  { 
    path: 'transaction/:id', 
    component: TransactionPageComponent 
  },
  { path: '**', redirectTo: '' },
]

export const appRoutingProviders: any[] = [
	//AuthGuard
];

export const appRoutes = RouterModule.forRoot(routes);