import {Report} from './report.model';
import {Injectable} from "@angular/core";
import {Subject} from 'rxjs';
import {HttpClient} from "@angular/common/http";

// using injectable decorator, angular creates only one instance of the report service to be used
// this way we guarantee that we only have one instance of the reports array, therefore being consistent
// other possibility: add it to provided array in app.module.ts
@Injectable({providedIn: 'root'})
export class ReportService {
  private reports: Report[] = [];
  private reportsUpdated = new Subject<Report[]>()

  constructor(private http: HttpClient) {
  }
  // get all Reports
  getReports(){
    // get reports from backend
    this.http.get<{message: string, reports : Report[]}>("http://localhost:3000/api/reports").subscribe((postData)=> {
      this.reports = postData.reports;
      // js spread operator [...array]
      // creates a new array with [] and makes a copies another array ...array in it
      // otherwise we had only copied the address but not the object (reference type) - in this case we want a real copy
      this.reportsUpdated.next([...this.reports]);
    });
  }

  // add a new Report
  addReport(title: string, comment: string, rating: number, companyName: string, reporterId: string, date: Date){
    const report: Report = {id: null, title: title,  comment : comment, rating: rating,
                              companyName: companyName, reporterId: reporterId, date: date};
    // post new report to backend
    this.http.post<{message:string}>('http://localhost:3000/api/reports', report).subscribe((response)=> {
      console.log(response.message);
      // update local data (if post call was successfull and we got a response)
      this.reports.push(report);
      this.reportsUpdated.next([...this.reports]);
    });


  }

  getReportUpdateListener(){
    return this.reportsUpdated.asObservable();
  }
}
