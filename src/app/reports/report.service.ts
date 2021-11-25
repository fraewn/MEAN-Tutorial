import {Report} from './report.model';
import {Injectable} from "@angular/core";
import {Subject} from 'rxjs';
import {HttpClient} from "@angular/common/http";
// allows us to manipualte elements in arrays
import {map} from 'rxjs/operators';
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

// using injectable decorator, angular creates only one instance of the report service to be used
// this way we guarantee that we only have one instance of the reports array, therefore being consistent
// other possibility: add it to provided array in app.module.ts
@Injectable({providedIn: 'root'})
export class ReportService {
  private reports: Report[] = [];
  private reportsUpdated = new Subject<{reports: Report[], reportCount: number}>()
  private BACKEND_URL = environment.backendUrl + "/reports";

  constructor(private http: HttpClient, private router: Router) {}

  // get all Reports
  getReports(reportsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${reportsPerPage}&page=${currentPage}`;
    // get reports from backend
    this.http.get<{message: string, reports : any, maxReports: number}>(
      this.BACKEND_URL + queryParams)
      // allows us to manipulate observed data
      .pipe(
        map(reportData => {
        return {
          reports: reportData.reports.map(incomingReport => {
            return {
              title: incomingReport.title,
              companyName: incomingReport.companyName,
              rating: incomingReport.rating,
              comment: incomingReport.comment,
              date: incomingReport.date,
              reporterId: incomingReport.reporterId,
              id: incomingReport._id,
              creator: incomingReport.creator
            };
          }),
          maxReports: reportData.maxReports
        };
      })
      )
      .subscribe((transformedReportData)=> {
      this.reports = transformedReportData.reports;
      // js spread operator [...array]
      // creates a new array with [] and makes a copies another array ...array in it
      // otherwise we had only copied the address but not the object (reference type) - in this case we want a real copy
      this.reportsUpdated.next({
          reports: [...this.reports],
          reportCount: transformedReportData.maxReports
        });
    });
  }

  // add a new Report
  addReport(title: string, comment: string, rating: number, companyName: string, reporterId: string, date: Date){
    const report: Report = {id: null, title: title,  comment : comment, rating: rating,
                              companyName: companyName, reporterId: reporterId, date: date, creator:null};
    // post new report to backend
    this.http.post<{message:string, reportId:string}>(this.BACKEND_URL, report)
      .subscribe((response)=> {
      this.router.navigate(["/"]);
    });
  }

  getReport(reportId: string){
    return this.http.get<{ _id: string; title: string; comment: string; companyName: string,
      date: Date, rating: number, reporterId: string, creator: string }>(
      this.BACKEND_URL + "/" + reportId
    );
  }

  getReportUpdateListener(){
    return this.reportsUpdated.asObservable();
  }

  deleteReport(reportId: string){
    return this.http.delete(this.BACKEND_URL + "/" + reportId);
  }

  updateReport(id: string, title: string, comment: string, rating: number, companyName: string, reporterId: string, date: Date){
    const report: Report = {id: id, title: title, rating: rating, comment: comment,
                                companyName: companyName, date: date, reporterId: reporterId, creator: null};
    this.http.put(this.BACKEND_URL + "/" + id, report)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }
}
