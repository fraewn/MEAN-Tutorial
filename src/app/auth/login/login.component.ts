import {Component, OnDestroy, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {PermissionManagerService} from "../../permission/permission-manager.service";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  isLoading = false;
  private authStatusSub;

  constructor(public authService: AuthService ) {
  }

  onLogin(form: NgForm) {
   if(form.invalid){
     return;
   }
   this.isLoading = true;
   this.authService.login(form.value.email, form.value.password);
   //window.location.replace('/');
    // location.reload(true);
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      () => {
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
