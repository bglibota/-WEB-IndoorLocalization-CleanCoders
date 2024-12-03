import { Routes } from '@angular/router';
import { AssetsComponent } from './Pages/assets/assets.component';
import { FacilitiesComponent } from './Pages/facilities/facilities.component';
import { ReportsComponent } from './Pages/reports/reports.component';

export const routes: Routes = [
    {path: 'assets', component: AssetsComponent},
    {path: 'facilities', component: FacilitiesComponent},
    {path: 'reports', component: ReportsComponent},
];
