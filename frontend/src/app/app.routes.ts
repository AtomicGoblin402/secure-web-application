import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './auth/register/register';
import { Login } from './auth/login/login';
import { Home } from './home/home';
import { ProfileComponent } from './profile/profile';

import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/register', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: Login },
    { path: 'home', component: Home, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})


export class AppRoutingModule { }
