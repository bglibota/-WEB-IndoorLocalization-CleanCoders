import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Console } from 'console';
var route:Router;
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './trackedassetdetail.component.html',
  styleUrl: './trackedassetdetail.component.scss'
})
export class TrackedAssetDetailComponent {
reportType: any;

  startDate: Date = new Date();
  endDate: Date = new Date();
  startTime: Date = new Date();
  endTime: Date = new Date();

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.startDate = new Date(params['startDate']);
      this.endDate = new Date(params['endDate']);
      this.startTime = new Date(params['startTime']);
      this.endTime = new Date(params['endTime']);
    });

    
    console.log(this.startDate, this.endDate, this.startTime, this.endTime);
   
  }

  generateReport() {
    throw new Error('Method not implemented.');
    }
}
