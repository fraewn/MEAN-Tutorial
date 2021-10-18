import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportListComponent} from "./reports/report-list/report-list.component";
import {ReportCreateComponent} from "./reports/report-create/report-create.component";

const routes: Routes = [
  { path: '', component: ReportListComponent },
  { path: 'create', component: ReportCreateComponent },
  { path: 'edit/:reportId', component: ReportCreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
