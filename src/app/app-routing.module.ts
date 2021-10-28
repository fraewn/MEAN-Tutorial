import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportListComponent} from "./reports/report-list/report-list.component";
import {ReportCreateComponent} from "./reports/report-create/report-create.component";
import {AuthGuard} from "./auth/auth.guard";

const routes: Routes = [
  { path: '', component: ReportListComponent },
  { path: 'create', component: ReportCreateComponent, canActivate: [AuthGuard]},
  { path: 'edit/:reportId', component: ReportCreateComponent, canActivate: [AuthGuard]},
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
