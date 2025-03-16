import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { landingPage } from './pages/landingPage/landingPage.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent }, 
    { path: 'signup', component: SignupComponent },
    { path: 'home', component: landingPage },

    { path: '', redirectTo: '/login', pathMatch: 'full' } 
  ];