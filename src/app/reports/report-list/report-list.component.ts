import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Report} from '../report.model';
import {ReportService} from "../report.service";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth.service";
import {Role} from "../../permission/role";

@Component({
  selector: 'app-report-list',
  templateUrl: 'report-list.component.html',
  styleUrls: ['report-list.component.css']
})
export class ReportListComponent implements OnInit, OnDestroy{
  reportService: ReportService;
  private authStatusSub: Subscription;
  isAuthenticated = false;
  userId: string;
  constructor(
    reportService: ReportService,
    private authService : AuthService) {
    this.reportService = reportService;
  }

  // ALTERNATIVE CODE
  // with public keyword, a class variable reportService is created automatically
  //constructor(public reportService: ReportService) {
  //}

  @Input()
  reports : Report[] = [];
  isLoading = false;
  totalReports = 0;
  reportsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  private reportsSubscribed : Subscription;
  // a function that angular executes as initation every time the Component is created
  ngOnInit() {
    // init tasks
    // fetch all reports
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    // since this is the init method, we start on page 1 as currentPage
    this.reportService.getReports(this.reportsPerPage, this.currentPage);

    // we receive the reportsUpdated array basically (i think this class is the observer)
    // first arg: function that is executed when something changed/ new data is emitted
    // second arg: function whenever an error occurs
    // third arg: function whenever observable is ended
    // we get the observable from this.reportService.getReportUpdateListener() and then we subsribe to it for reports
    // as observer we can use the three functions next(), error() and complete() which we can declare as parameters in the subsribe function
    this.reportsSubscribed = this.reportService.getReportUpdateListener()
      .subscribe((reportData : {reports: Report[], reportCount: number}) => {
        this.isLoading = false;
        // update reports in this class
        this.totalReports = reportData.reportCount;
        this.reports = reportData.reports;
    }, (reports) => {
      console.log("no data could be retrieved from observable");
    });
    this.isAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe( (authData : {authStatus: boolean, role: Role }) => {
      this.isAuthenticated = authData.authStatus;
    });
  }

  ngOnDestroy() {
    // prevent memory leaks by unsubscribing when component is not used in DOM
    this.reportsSubscribed.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(reportId: string){
    this.isLoading = true;
    this.reportService.deleteReport(reportId).subscribe(() => {
      this.reportService.getReports(this.reportsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    // page index starts at 0, but we want to start at 1, therefore + 1
    this.currentPage = pageData.pageIndex + 1;
    // pageSize is an attribute the user can select in the drop down
    this.reportsPerPage = pageData.pageSize;
    this.reportService.getReports(this.reportsPerPage, this.currentPage);
  }
}
