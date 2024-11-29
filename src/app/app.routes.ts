import { Routes } from '@angular/router';
import { AssetsComponent } from './assets/assets.component';
import { FacilitiesComponent } from './facilities/facilities.component';
import { ReportsComponent } from './reports/reports.component';

export const routes: Routes = [
    {path: 'assets', component: AssetsComponent},
    {path: 'facilities', component: FacilitiesComponent},
    {path: 'reports', component: ReportsComponent},
];
