import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionType } from './permission-type';
import { PermissionManagerService } from './permission-manager.service';

@Directive({
  selector: '[appIsGranted]'
})
export class IsGrantedDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionManagerS: PermissionManagerService
  ) { }
  @Input() set appIsGranted(permission_string: string) {
    const permission = PermissionType[permission_string];
    this.isGranted(permission);
  }
  private isGranted(permission: PermissionType){
    console.log("Permission: " + permission);
    if (this.permissionManagerS.isGranted(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
