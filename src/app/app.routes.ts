import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { landingPage } from './pages/landingPage/landingPage.component';
import { HealthResourcesComponent } from './pages/health-resources/health-resources.component';
import { BigFiveTestComponent } from './pages/big-five-test/big-five-test.component';


export const routes: Routes = [
    { path: '', component: landingPage},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'home', component: landingPage },
    { path: 'resources', component: HealthResourcesComponent },
    { path: 'bigfive', component:BigFiveTestComponent },

    { path: '', redirectTo: '/login', pathMatch: 'full' }
  ];
