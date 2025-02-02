import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
reportType: any;
generateReport() {
throw new Error('Method not implemented.');
}
  date: Date = new Date();
  timeFrom: Date = new Date();
  timeUntil: Date = new Date();

  constructor() { }

  ngOnInit() {
  }
}
