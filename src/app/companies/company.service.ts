import {Injectable} from "@angular/core";
import {Company} from './company.model';
import {Subject} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {map} from 'rxjs/operators';
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class CompanyService {
  private BACKEND_URL = environment.backendUrl + "/companies";

  private companies: Company[] = [];
  private companiesUpdated = new Subject<{companies: Company[], companyCount: number}>()

  constructor(private http: HttpClient, private router: Router) {}

  getCompany(companyId: string) {
    return this.http.get<{
      _id: string,
      companyName: string,
      businessType: string,
      foundationDate: Date,
      principalOfficeLocation: string,
      creator: string
    }>(
      this.BACKEND_URL + "/" + companyId
    );
  }

  addCompany(companyName: string, businessType: string,
             principalOfficeLocation: string, foundationDate: Date) {
    const company: Company= {id: null, companyName: companyName, businessType: businessType,
      principalOfficeLocation: principalOfficeLocation, foundationDate: foundationDate, creator:null};
    // post new company to backend
    this.http.post<{message:string, companyId:string}>(this.BACKEND_URL, company)
      .subscribe((response)=> {
        this.router.navigate(["/"]);
      });
  }

  updateCompany(companyId: string, companyName: string, businessType: string,
                principalOfficeLocation: string, foundationDate: Date) {
    const company: Company= {id: companyId, companyName: companyName, businessType: businessType,
      principalOfficeLocation: principalOfficeLocation, foundationDate: foundationDate, creator:null};
    this.http.put(this.BACKEND_URL + "/" + companyId, company)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  getCompanyUpdateListener(){
    return this.companiesUpdated.asObservable();
  }

  deleteCompany(companyId: string){
    return this.http.delete(this.BACKEND_URL + "/" + companyId);
  }

  getCompanies(companiesPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${companiesPerPage}&page=${currentPage}`;
    // get reports from backend
    this.http.get<{message: string, companies : any, maxCompanies: number}>(
      this.BACKEND_URL + queryParams)
      // allows us to manipulate observed data
      .pipe(
        map(companyData => {
          return {
            companies: companyData.companies.map(incomingCompany => {
              return {
                companyName: incomingCompany.companyName,
                businessType: incomingCompany.businessType,
                principalOfficeLocation: incomingCompany.principalOfficeLocation,
                foundationDate: incomingCompany.foundationDate,
                id: incomingCompany._id,
                creator: incomingCompany.creator
              };
            }),
            maxCompanies: companyData.maxCompanies
          };
        })
      )
      .subscribe((transformedCompanyData)=> {
        this.companies = transformedCompanyData.companies;
        console.log(this.companies);
        // js spread operator [...array]
        // creates a new array with [] and makes a copies another array ...array in it
        // otherwise we had only copied the address but not the object (reference type) - in this case we want a real copy
        this.companiesUpdated.next({
          companies: [...this.companies],
          companyCount: transformedCompanyData.maxCompanies
        });
      });
  }
}
