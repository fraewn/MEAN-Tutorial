import {Component, EventEmitter, Output} from '@angular/core';
import {Report} from '../report.model';
import {NgForm} from "@angular/forms";
import {ReportService} from "../report.service";

@Component({
  selector: 'app-report-create',
  templateUrl: './report-create.component.html',
  styleUrls: ['report-create.component.css']
})
export class ReportCreateComponent {
  // emits event that a report was created
  // the @output() decoration turns the event into one, that can be listened for on the outside (=in the parent component)
  // ALTERNATIVE: USING AN EVENT EMITTER
  // @Output() reportCreated = new EventEmitter<Report>();

  constructor(public reportService: ReportService) {}

  onAddReportTwoWay(form: NgForm){
    // make sure nothing happens when an invalid form is submitted
    if(form.invalid){
      console.log('invalid');
      return;
    }
    // create report via service:
    this.reportService.addReport(form.value.title, form.value.comment, form.value.rating,
      form.value.companyName, form.value.reporterId, form.value.date);
    form.resetForm();
    // ALTERNATIVE: event emitting
    /*const report : Report = {
      title: form.value.title,
      companyName: form.value.companyName,
      reporterId: form.value.reporterId,
      rating: form.value.rating,
      date: form.value.date,
      comment: form.value.comment
    };*/
    // this.reportCreated.emit(report);


  }
}
