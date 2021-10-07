import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatExpansionModule} from "@angular/material/expansion";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// the .ts is not added in the from part
import {ReportCreateComponent} from "./reports/report-create/report-create.component";
import {HeaderComponent} from "./header/header.component";
import {BasicReportCreateComponent} from "./tutorial/basic-report-create.component";
import {ReportListComponent} from "./reports/report-list/report-list.component";
import {ReportService} from "./reports/report.service";



// defines the features our angular application has
// angular thinks in applications and applications are split in modules
// a module defines the building blocks of our application
// components are not the only but probably the most important building block of an angular application
@NgModule({
  declarations: [
    // angular does not scan all folders for components - instead we need to register them:
    // here we declare the app componenta
    // now we can use the 'app-root' selector in other angular components, but not yet in the index.html
    AppComponent, ReportCreateComponent, HeaderComponent, BasicReportCreateComponent, ReportListComponent
  ],
  imports: [
    // BrowserModule contains some core features of angular
    BrowserModule,
    // this is the one I imported when I said yes to angular routing I guess
    AppRoutingModule,
    // this one we need to use ngModule
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule
  ],
  providers: [],
  // here we add the app component to the bootstrap array too so we can use it in index.html
  // there is typically only one component in the bootstrap array, which is the "root" component
  // all other components would be somehow nested in the root component
  bootstrap: [AppComponent]
})
export class AppModule { }
