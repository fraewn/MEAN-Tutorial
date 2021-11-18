import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Report} from '../report.model';
import {NgForm} from "@angular/forms";
import {ReportService} from "../report.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-report-create',
  templateUrl: './report-create.component.html',
  styleUrls: ['report-create.component.css']
})
export class ReportCreateComponent implements OnInit, OnDestroy {
  report: Report;
  isLoading = false;


  // set default mode how to handle a report
  private mode = 'create';
  private reportId: string;
  private authStatusSub: Subscription;


  constructor(
    public reportService: ReportService,
    public route: ActivatedRoute,
    private authService: AuthService
) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authData => {
        // if the auth status changes, we will always need to disable the loader (mat-spinner)
      this.isLoading = false;
      console.log(this.isLoading);
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('reportId')) {
        this.mode = 'edit';
        this.reportId = paramMap.get('reportId');
        this.isLoading = true;
        this.reportService.getReport(this.reportId).subscribe(reportData => {
          this.isLoading = false;
          this.report = {id: reportData._id, title: reportData.title, companyName: reportData.companyName,
            reporterId: reportData.reporterId, rating: reportData.rating, comment: reportData.comment,
            date: reportData.date, creator: reportData.creator};
        });
      } else {
        this.mode = 'create';
        this.reportId = null;
      }
    });
  }

  onSaveReport(form: NgForm){
    // make sure nothing happens when an invalid form is submitted
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    // create report
    if(this.mode=='create'){
      this.reportService.addReport(
        form.value.title, form.value.comment,
        form.value.rating, form.value.companyName,
        form.value.reporterId, form.value.date);

    }
    // edit report
    else {
      this.reportService.updateReport(
        this.reportId, form.value.title,
        form.value.comment, form.value.rating,
        form.value.companyName, form.value.reporterId,
        form.value.date);
    }
    form.resetForm();

  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
