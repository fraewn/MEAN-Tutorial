import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Company} from '../company.model';
import {NgForm} from "@angular/forms";
import {CompanyService} from "../company.service";
import {ActivatedRoute, ParamMap} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {Role} from "../../permission/role";

@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrls: ['company-create.component.css']
})
export class CompanyCreateComponent implements OnInit, OnDestroy {
  company : Company;
  isLoading = false;


  // set default mode how to handle a report
  private mode = 'create';
  private companyId: string;
  private authStatusSub: Subscription;


  constructor(
    public companyService: CompanyService,
    public route: ActivatedRoute,
    private authService: AuthService
) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        // if the auth status changes, we will always need to disable the loader (mat-spinner)
      this.isLoading = false;
      console.log(this.isLoading);
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('companyId')) {
        this.mode = 'edit';
        this.companyId = paramMap.get('companyId');
        this.isLoading = true;
        this.companyService.getCompany(this.companyId).subscribe(companyData => {
          this.isLoading = false;

          this.company = {id: companyData._id, companyName: companyData.companyName,
            businessType: companyData.businessType, foundationDate: companyData.foundationDate,
            principalOfficeLocation: companyData.principalOfficeLocation,
            creator: companyData.creator};
        });
      } else {
        this.mode = 'create';
        this.companyId = null;
      }
    });
  }

  onSaveCompany(form: NgForm){
    // make sure nothing happens when an invalid form is submitted
    if(form.invalid){
      return;
    }
    this.isLoading = true;
    // create report
    if(this.mode=='create'){
      this.companyService.addCompany(
        form.value.companyName, form.value.businessType,
        form.value.principalOfficeLocation, form.value.foundationDate);

    }
    // edit report
    else {
      this.companyService.updateCompany(
        this.companyId, form.value.companyName, form.value.businessType,
        form.value.principalOfficeLocation, form.value.foundationDate);
    }
    form.resetForm();

  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
