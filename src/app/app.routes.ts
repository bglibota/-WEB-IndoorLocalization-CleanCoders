import { Routes } from '@angular/router';
import { AssetsComponent } from './Pages/assets/assets.component';
import { FacilitiesComponent } from './Pages/facilities/facilities.component';
import { ReportsComponent } from './Pages/reports/reports.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },  
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {path: 'assets', component: AssetsComponent, canActivate: [authGuard]},
    {path: 'facilities', component: FacilitiesComponent, canActivate: [authGuard]},
    {path: 'reports', component: ReportsComponent, canActivate: [authGuard]},
];
