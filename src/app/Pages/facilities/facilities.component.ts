import { Component } from '@angular/core';
import { ZoneManagementComponent } from './zone-management/zone-management.component';

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [ZoneManagementComponent],
  templateUrl: './facilities.component.html',
  styleUrl: './facilities.component.scss'
})
export class FacilitiesComponent {

}
