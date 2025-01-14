import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
reportType: any;

  startDate: Date = new Date();
  endDate: Date = new Date();
  startTime: Date = new Date();
  endTime: Date = new Date();

  constructor(private router: Router) { }

  generateReport() {
    if(this.reportType === 'heatmap') {
      this.router.navigate(['/heatmapreport/', this.startDate, this.endDate, this.startTime, this.endTime]);
    } else if(this.reportType === 'bar') {
  
    }
  }
  ngOnInit() {
  }
}
