import { Routes, RouterModule } from '@angular/router';

//import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  /*{ 
  	path: '', 
  	component: MainPageComponent, 
  	pathMatch: 'full' 
  },*/
  { path: '**', redirectTo: '' },
]

export const appRoutingProviders: any[] = [
	//AuthGuard
];

export const appRoutes = RouterModule.forRoot(routes);