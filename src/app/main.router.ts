import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './pages/main_page/main_page.component';
import { BlockPageComponent } from './pages/block/block.component';
import { AccountPageComponent } from './pages/account/account.component';
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
  { path: '**', redirectTo: '' },
]

export const appRoutingProviders: any[] = [
	//AuthGuard
];

export const appRoutes = RouterModule.forRoot(routes);