import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth.service";
import {CompanyService} from "../company.service";
import {Company} from "../company.model";
import {Role} from "../../permission/role";

@Component({
  selector: 'app-company-list',
  templateUrl: 'company-list.component.html',
  styleUrls: ['company-list.component.css']
})
export class CompanyListComponent implements OnInit, OnDestroy{
  companyService : CompanyService
  private authStatusSub: Subscription;
  isAuthenticated = false;
  userId: string;

  constructor(
    companyService : CompanyService,
    private authService : AuthService) {
    this.companyService = companyService;
  }

  // ALTERNATIVE CODE
  // with public keyword, a class variable reportService is created automatically
  //constructor(public reportService: ReportService) {
  //}

  @Input()
  companies : Company[] = [];
  isLoading = false;
  totalCompanies = 0;
  companiesPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  private companiesSubscribed : Subscription;

  // a function that angular executes as initation every time the Component is created
  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    console.log("userId: " + this.userId);
    // since this is the init method, we start on page 1 as currentPage
    this.companyService.getCompanies(this.companiesPerPage, this.currentPage);

    this.companiesSubscribed = this.companyService.getCompanyUpdateListener()
      .subscribe((companyData : {companies: Company[], companyCount: number}) => {
        this.isLoading = false;
        this.totalCompanies = companyData.companyCount;
        this.companies = companyData.companies;
        companyData.companies.forEach(company => {
          console.log(company.creator);
          console.log(company);
        })
    }, (companies) => {
      console.log("No data could be retrieved from observable");
    });
    this.isAuthenticated = this.authService.getIsAuth();
    console.log(this.isAuthenticated);
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe((authData : {authStatus: boolean, role: Role }) => {
      this.isAuthenticated = authData.authStatus;
    });
  }

  ngOnDestroy() {
    // prevent memory leaks by unsubscribing when component is not used in DOM
    this.companiesSubscribed.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(companyId: string){
    this.isLoading = true;
    this.companyService.deleteCompany(companyId).subscribe(() => {
      this.companyService.getCompanies(this.companiesPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    // page index starts at 0, but we want to start at 1, therefore + 1
    this.currentPage = pageData.pageIndex + 1;
    // pageSize is an attribute the user can select in the drop down
    this.companiesPerPage = pageData.pageSize;
    this.companyService.getCompanies(this.companiesPerPage, this.currentPage);
  }
}
