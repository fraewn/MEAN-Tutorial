import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Report} from '../report.model';
import {NgForm} from "@angular/forms";
import {ReportService} from "../report.service";
import {ActivatedRoute, ParamMap} from "@angular/router";

@Component({
  selector: 'app-report-create',
  templateUrl: './report-create.component.html',
  styleUrls: ['report-create.component.css']
})
export class ReportCreateComponent implements OnInit {
  // emits event that a report was created
  // the @output() decoration turns the event into one, that can be listened for on the outside (=in the parent component)
  // ALTERNATIVE: USING AN EVENT EMITTER
  // @Output() reportCreated = new EventEmitter<Report>();

  private mode = 'create';
  private reportId: string;
  report: Report;

  constructor(public reportService: ReportService, public route: ActivatedRoute) {}

  onSaveReport(form: NgForm){
    // make sure nothing happens when an invalid form is submitted
    if(form.invalid){
      console.log('invalid');
      return;
    }
    if(this.mode=='create'){
      this.reportService.addReport(form.value.title, form.value.comment, form.value.rating,
        form.value.companyName, form.value.reporterId, form.value.date);
      form.resetForm();
    }
    // edit report
    else {
      this.reportService.updateReport(this.reportId, form.value.title, form.value.comment, form.value.rating,
        form.value.companyName, form.value.reporterId, form.value.date);
    }

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('reportId')) {
        this.mode = 'edit';
        this.reportId = paramMap.get('reportId');
        this.report = this.reportService.getReport(this.reportId);
      } else {
        this.mode = 'create';
        this.reportId = null;
      }
    });
  }
}
