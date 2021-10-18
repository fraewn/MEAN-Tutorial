import {Report} from './report.model';
import {Injectable} from "@angular/core";
import {Subject} from 'rxjs';
import {HttpClient} from "@angular/common/http";
// allows us to manipualte elements in arrays
import {map} from 'rxjs/operators';

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
    this.http.get<{message: string, reports : any}>(
      "http://localhost:3000/api/reports")
      // allows us to manipulate observed data
      .pipe(map((reportData) => {
        return reportData.reports.map(incomingReport => {
          return {
            title: incomingReport.title,
            companyName: incomingReport.companyName,
            rating: incomingReport.rating,
            comment: incomingReport.comment,
            date: incomingReport.date,
            reporterId: incomingReport.reporterId,
            id: incomingReport._id
          };
        });
      }))
      .subscribe((transformedReports)=> {
      this.reports = transformedReports;
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
    this.http.post<{message:string, reportId:string}>('http://localhost:3000/api/reports', report)
      .subscribe((response)=> {
      report.id = response.reportId;
      // update local data (also with id set by mongodb)
      console.log(report);
      this.reports.push(report);
      this.reportsUpdated.next([...this.reports]);
    });
  }

  getReport(reportId: string){
    return {...this.reports.find(report => report.id === reportId)}
  }

  getReportUpdateListener(){
    return this.reportsUpdated.asObservable();
  }

  deleteReport(reportId: string){
    this.http.delete("http://localhost:3000/api/reports/" + reportId)
      .subscribe(()=> {
        // the function within filter() ist executed for each report
        // so a report only is added to updatedReports if its id does not equal the just deleted report
        const updatedReports = this.reports.filter(report => report.id != reportId );
        this.reports = updatedReports;
        this.reportsUpdated.next([...this.reports]);
        });
  }

  updateReport(id: string, title: string, comment: string, rating: number, companyName: string, reporterId: string, date: Date){
    const report: Report = {id: id, title: title, rating: rating, comment: comment,
                                companyName: companyName, date: date, reporterId: reporterId};
    this.http.put("http://localhost:3000/api/reports/" + id, report)
      .subscribe(response => {
        console.log(response);
      });
  }
}
