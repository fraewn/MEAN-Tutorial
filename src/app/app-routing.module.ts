import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportListComponent} from "./reports/report-list/report-list.component";
import {ReportCreateComponent} from "./reports/report-create/report-create.component";
import {AuthGuard} from "./auth/auth.guard";
import {CompanyCreateComponent} from "./companies/company-create/company-create.component";
import {CompanyListComponent} from "./companies/company-list/company-list.component";
import {FailureComponent} from "./failure/failure.component";

const routes: Routes = [
  { path: '', component: ReportListComponent },
  { path: 'company', component: CompanyListComponent},
  { path: 'failure', component: FailureComponent},
  { path: 'report/create', component: ReportCreateComponent, canActivate: [AuthGuard]},
  { path: 'report/edit/:reportId', component: ReportCreateComponent, canActivate: [AuthGuard]},
  { path: 'company/create', component: CompanyCreateComponent, canActivate: [AuthGuard]},
  { path: 'company/edit/:companyId', component: CompanyCreateComponent, canActivate: [AuthGuard]},
  // in load children you can describe the path you want to load lazily
  // old syntax: load Children: './auth/auth.module#AuthModule'
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
