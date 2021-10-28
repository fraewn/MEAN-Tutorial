import {NgModule} from "@angular/core";
import {ReportCreateComponent} from "./report-create/report-create.component";
import {ReportListComponent} from "./report-list/report-list.component";
import {FormsModule} from "@angular/forms";
import {AngularMaterialModule} from "../angular-material.module";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    ReportCreateComponent,
    ReportListComponent
  ],
  imports: [
    // this one we need to use ngModule
    FormsModule,
    AngularMaterialModule,
    CommonModule,
    RouterModule
  ]

})
export class ReportModule {}
