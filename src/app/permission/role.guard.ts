import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthGuard} from "../auth/auth.guard";
import {PermissionManagerService} from "./permission-manager.service";
import {FailureService} from "../failure/failure.service";
import {FailureMessage} from "../failure/failure.model";

@Injectable()
export class RoleGuard implements CanActivate{
  private permissionManager;
  private failureService;
  constructor(private authGuard : AuthGuard, private router: Router, permissionManager : PermissionManagerService, failureService : FailureService ) {
    this.authGuard = authGuard;
    this.permissionManager = permissionManager;
    this.failureService = failureService;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let permissionTypes = route.data.permissionTypes as Array<string>;
    console.log(permissionTypes);
    let result = false;
    permissionTypes.forEach(permissionType => {
      result = this.permissionManager.isGranted(permissionType);
    })
    if(!result){
      // create failure message with details
      let failureMessage : FailureMessage = {
        id : 'Basic User',
        title: 'Path not allowed',
        type : 'CREATE_COMPANY',
        user_id : localStorage.getItem('userId'),
        status : '404'
      }
      // send failure message to backend via web sockets
      this.failureService.sendFailureMessage(failureMessage);
      // send user back to start
      this.router.navigate(['']);
    }
    return result;
  }

}
