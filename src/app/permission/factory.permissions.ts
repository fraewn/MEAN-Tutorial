import { PermissionBase } from './permissions';
import { Role } from './role';
import { AdminPermissions } from './admin.permissions';
import { BasicPermissions } from './basic.permissions';
import { UnknownPermissions } from './unknown.permissions';

export class PermissionsFactory {
  public static instance: PermissionBase;
  private constructor() {}
  public static getInstance() {
    if (this.instance) {
      console.log("returned already existing permissionbase instance");
      return this.instance;
    } else {
      const role = localStorage.getItem('role');
      console.log(role);
      switch(role) {
        case Role.ADMIN:
          this.instance = new AdminPermissions();
          break;
        case Role.BASIC:
          this.instance = new BasicPermissions();
          break;
        case Role.UNKNOWN:
          this.instance = new UnknownPermissions();
          break;
        default:
          this.instance = new UnknownPermissions();
          break;
      }
      return this.instance;
    }

  }

  public static recycle(){
    this.instance = null;
    console.log("permission instance cleared!");
  }
}
