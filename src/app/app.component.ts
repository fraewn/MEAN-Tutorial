import {Component, OnInit} from '@angular/core';
import {Report} from './reports/report.model';
import {AuthService} from "./auth/auth.service";

// a page is composed of components in angular
// this way you have small, easily to maintain and reusable building blocks in the app
// each component is typically made up of more than one file (css, ts...)
@Component({
  // the AppComponent defined in this file is identified by its selector:
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'MEANRatingManagement';
  storedReports : Report[] = [];

  constructor(private authService: AuthService) {
  }

  onReportAdded(report){
    this.storedReports.push(report);
  }

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }
}
