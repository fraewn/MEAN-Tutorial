import { PermissionType } from './permission-type';
import { PermissionBase } from './permissions';
export class BasicPermissions extends PermissionBase {
  constructor() {
    super();
    this.permissions = [
      PermissionType.CREATE_REPORT, PermissionType.READ_REPORT,
      PermissionType.UPDATE_REPORT, PermissionType.DELETE_REPORT,
      PermissionType.READ_COMPANY,
      PermissionType.OTHER
    ];
  }
}
