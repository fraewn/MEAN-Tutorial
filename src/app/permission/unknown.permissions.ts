import { PermissionBase } from './permissions';
import { PermissionType } from './permission-type';

export class UnknownPermissions extends PermissionBase {
  constructor() {
    super();
    this.permissions = [
    PermissionType.READ_REPORT, PermissionType.READ_COMPANY
    ];
  }
}
