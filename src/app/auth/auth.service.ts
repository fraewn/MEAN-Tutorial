import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {Role} from "../permission/role"
import {PermissionsFactory} from "../permission/factory.permissions";
import {PermissionManagerService} from "../permission/permission-manager.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: NodeJS.Timer;
  private userId : string;
  private authStatusListener = new Subject<{authStatus : boolean, role : Role}>();
  private BACKEND_URL : string = environment.backendUrl + "/user";
  private role : Role = Role.UNKNOWN;
  private permissionManagerService;

  constructor(private http: HttpClient, private router: Router, private managePerms : PermissionManagerService ) {
    this.permissionManagerService = managePerms;
  }

  createUser(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http
      .post(this.BACKEND_URL + "/signup", authData ).subscribe(() => {
        this.router.navigate(['/']);

    }, error => {
        this.authStatusListener.next({authStatus: false, role: Role.UNKNOWN});
    });
  }

  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password};
    this.http.post<{token: string, expiresIn: number, userId: string, role: string}>(this.BACKEND_URL + "/login", authData).subscribe(response => {
      const token = response.token;
      this.token = token;
      const role = response.role;
      if(role){
        this.role = this.mapRole(response.role);
        this.permissionManagerService.authAs(role);
      }
      if(token){
        const expiresInDuration = response.expiresIn;
        this.setAuthTimer(expiresInDuration);
        this.isAuthenticated = true;
        this.userId = response.userId;
        this.authStatusListener.next({authStatus : true, role : this.role});
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        this.saveAuthData(token, expirationDate, this.userId, this.role);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next({authStatus: false, role: Role.UNKNOWN});
    });

  }

  mapRole(backendRole){
    let frontendRole : Role;
    if(backendRole === "admin"){
        frontendRole = Role.ADMIN;
    }
    else if(backendRole === "basic"){
        frontendRole = Role.BASIC;
    }
    else {
        frontendRole = Role.UNKNOWN
    }
    return frontendRole;
  }

  getUserId(){
    return this.userId;
  }

  getToken(){
    return this.token;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next({authStatus : false, role : Role.UNKNOWN});
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
    PermissionsFactory.recycle();
  }

  // we need to save the auth data in the local storage
  // because otherwise, everytime the angular app restarts (=when the user reloads the page), token and expiration time are lost
  // => the user is logged out
  private saveAuthData(token: string, expirationDate: Date, userId: string, role : Role){
    // serialize and store data in local storage
    localStorage.setItem('token', token);
    // iso string is a standardized version
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role.toString())
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if (!authInformation){
      return;
    }
    // check if token still is valid
    const now = new Date();
    const expiresInDuration = authInformation.expirationDate.getTime() - now.getTime();
    if(expiresInDuration > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.role = Role[authInformation.role];
      console.log(this.role);
      this.setAuthTimer(expiresInDuration / 1000);
      this.authStatusListener.next({authStatus : true, role : this.role });
    }

  }

  private setAuthTimer(duration: number){
    console.log("Setting Auth Timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private getAuthData(){
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    if(!token || !expirationDate){
        // @ts-ignore
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      role: role
    }
  }
}
