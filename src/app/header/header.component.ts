import {Component, HostListener, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";
import {Role} from "../permission/role";
import {PermissionsFactory} from "../permission/factory.permissions";

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  role;
  private authListenerSubs: Subscription;
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((authData : {authStatus: boolean, role: Role }) => {
      this.isAuthenticated = authData.authStatus;
    });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
  }


}
