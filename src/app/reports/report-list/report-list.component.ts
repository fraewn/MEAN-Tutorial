import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Report} from '../report.model';
import {ReportService} from "../report.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-report-list',
  templateUrl: 'report-list.component.html',
  styleUrls: ['report-list.component.css']
})
export class ReportListComponent implements OnInit, OnDestroy{
  reportService: ReportService;
  constructor(reportService: ReportService) {
    this.reportService = reportService;
  }

  // ALTERNATIVE CODE
  // with public keyword, a class variable reportService is created automatically
  //constructor(public reportService: ReportService) {
  //}

  @Input()
  reports : Report[] = [];
  private reportsSubscribed : Subscription;
  // a function that angular executes as initation every time the Component is created
  ngOnInit() {
    // init tasks
    // fetch all posts
    this.reports = this.reportService.getReports();
    // we receive the reportsUpdated array basically (i think this class is the observer)
    // first arg: function that is executed when something changed/ new data is emitted
    // second arg: function whenever an error occurs
    // third arg: function whenever observable is ended
    // we get the observable from this.reportService.getReportUpdateListener() and then we subsribe to it for reports
    // as observer we can use the three functions next(), error() and complete() which we can declare as parameters in the subsribe function
    this.reportsSubscribed = this.reportService.getReportUpdateListener().subscribe((reports) => {
      // update reports in this class
      this.reports = reports;
    }, (reports) => {
      console.log("no data could be retrieved from observable");
    });
  }

  ngOnDestroy() {
    // prevent memory leaks by unsubscribing when component is not used in DOM
    this.reportsSubscribed.unsubscribe();
  }

}
