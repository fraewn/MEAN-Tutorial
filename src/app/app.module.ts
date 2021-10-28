import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HeaderComponent} from "./header/header.component";
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {AuthInterceptor} from "./auth/auth-interceptor";
import {ErrorInterceptor} from "./error-interceptor";
import {ErrorComponent} from "./error/error.component";
import {AngularMaterialModule} from "./angular-material.module";
import {ReportModule} from "./reports/report.module";

// defines the features our angular application has
// angular thinks in applications and applications are split in modules
// a module defines the building blocks of our application
// components are not the only but probably the most important building block of an angular application
@NgModule({
  declarations: [
    // angular does not scan all folders for components - instead we need to register them:
    // here we declare the app component
    // now we can use the 'app-root' selector in other angular components, but not yet in the index.html
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent
  ],
  imports: [
    // BrowserModule contains some core features of angular
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    ReportModule,
    FormsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],
  // here we add the app component to the bootstrap array too so we can use it in index.html
  // there is typically only one component in the bootstrap array, which is the "root" component
  // all other components would be somehow nested in the root component
  bootstrap: [AppComponent],
  // this component is going to get used, even if angular can't 'see' it
  entryComponents: [ErrorComponent]
})
export class AppModule { }
