import { PermissionType } from './permission-type';
import { PermissionBase } from './permissions';
export class AdminPermissions extends PermissionBase {
  constructor() {
    super();
    this.permissions = [
      PermissionType.CREATE_REPORT, PermissionType.READ_REPORT,
      PermissionType.UPDATE_REPORT, PermissionType.DELETE_REPORT,
      PermissionType.CREATE_COMPANY, PermissionType.READ_COMPANY,
      PermissionType.UPDATE_COMPANY, PermissionType.DELETE_COMPANY,
      PermissionType.OTHER, PermissionType.READ_FAILURE
    ];
  }
}
