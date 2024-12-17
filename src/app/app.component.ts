import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ZoneManagementComponent } from './Pages/facilities/zone-management/zone-management.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink,ZoneManagementComponent,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'indoor-localization-web';
}
