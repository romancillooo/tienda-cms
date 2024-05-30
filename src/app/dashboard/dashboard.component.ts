import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statistics: any = {};

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics() {
    this.dashboardService.getStatistics().subscribe(data => {
      this.statistics = data;
    }, error => {
      console.error('Error fetching statistics', error);
    });
  }
}
