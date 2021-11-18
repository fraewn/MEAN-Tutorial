import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {AngularMaterialModule} from "../angular-material.module";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {CompanyCreateComponent} from "./company-create/company-create.component";
import {CompanyListComponent} from "./company-list/company-list.component";
import {IsGrantedDirective} from "../permission/IsGrantedDirective";

@NgModule({
  declarations: [
    CompanyCreateComponent,
    CompanyListComponent,
    IsGrantedDirective
  ],
  imports: [
    // this one we need to use ngModule
    FormsModule,
    AngularMaterialModule,
    CommonModule,
    RouterModule
  ],
  exports: [IsGrantedDirective]

})
export class CompanyModule {

}
