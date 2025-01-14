import { Routes } from '@angular/router';
import { AssetsComponent } from './Pages/assets/assets.component';
import { FacilitiesComponent } from './Pages/facilities/facilities.component';
import { ReportsComponent } from './Pages/reports/reports.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegisterComponent } from './Pages/register/register.component';
import { authGuard } from './guards/auth.guard';
import { HeatmapReportComponent } from './Pages/reports/HeatmapReport/heatmapreport.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },  
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'heatmapreport/:startDate/:endDate/:startTime/:endTime', component: HeatmapReportComponent  },
    {path: 'assets', component: AssetsComponent, canActivate: [authGuard]},
    {path: 'facilities', component: FacilitiesComponent, canActivate: [authGuard]},
    {path: 'reports', component: ReportsComponent, canActivate: [authGuard]},
];
