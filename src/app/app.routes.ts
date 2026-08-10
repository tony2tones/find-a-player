import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { SignUpComponent } from './components/sign-up-component/sign-up-component';
import { DashboardComponent } from './components/dashboard-component/dashboard-component';
import { authGaurdGuard } from './auth-gaurd-guard';

export const routes: Routes = [
     {
        path: 'dashboard', component: DashboardComponent, canActivate: [authGaurdGuard]
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'signup', component: SignUpComponent
    },
    // {
        // redirectTo: 'login',  path: '/', component: LoginComponent
    // }
];
