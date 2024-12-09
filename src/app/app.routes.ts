import { Routes } from '@angular/router';
import { AssetsComponent } from './Pages/assets/assets.component';
import { FacilitiesComponent } from './Pages/facilities/facilities.component';
import { ReportsComponent } from './Pages/reports/reports.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },  
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {path: 'assets', component: AssetsComponent},
    {path: 'facilities', component: FacilitiesComponent},
    {path: 'reports', component: ReportsComponent},
];
