import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { AppSettingsService } from '../appSettings/app-settings.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  readonly superAdmin = 'super_admin'
  readonly megaAdmin = 'mega_admin'
  readonly admin = 'admin'
  readonly guard = 'guard'
  readonly seller = 'seller'
  readonly accountant = 'accountant'
  readonly student = 'student'
  readonly parent = 'parent'
  readonly employee = 'employee'
  constructor( public auth: AuthService, private settings: AppSettingsService) { }

  isSuperAdmin(){
    let role = this.auth.currentUserValue.account_type
    if(role === this.superAdmin || role === this.megaAdmin) return true;
    return false;
  }

  isMegaAdmin(){
    let role = this.auth.currentUserValue.account_type
    if(role === this.megaAdmin) return true;
    return false;
  }

  isAdmin(){
    if(this.isMegaAdmin()) return true;
    let role = this.auth.currentUserValue.account_type
    if(role === this.admin) return true;
    return false;
  }

  isAdminOnly(){
    let role = this.auth.currentUserValue.account_type
    if(role === this.admin) return true;
    return false;
  }

  isEmployee(){
    if(this.isMegaAdmin()) return true;
    if(this.isAdminOnly()) return true;
    
    let role = this.auth?.currentUserValue?.account_type
    if(role === this.employee) return true;
    return false;
  }
  isEmployeeOnly(){
    let role = this.auth?.currentUserValue?.account_type
    if(role === this.employee) return true;
    return false;
  }
  isGuard(){
    let role = this.auth?.currentUserValue?.account_type
    if(role === this.guard) return true;
    return false;
  }

  isSeller(){
    let role = this.auth?.currentUserValue?.account_type
    if(role === this.seller) return true;
    return false;
  }

  isAccountant(){
    let role = this.auth?.currentUserValue?.account_type
    if(role === this.accountant) return true;
    return false;
  }

  isStudent(){
    let role = this.auth?.currentUserValue?.account_type
    if(role === this.student) return true;
    return false;
  }

  isParent(){
    let role = this.auth?.currentUserValue?.account_type
    if(role === this.parent) return true;
    return false;
  }

  isShowAttendance(){
    if(this.isAdminOnly()) return true;

    return false;
  }


  isShowMedia(){
    if(this.isGuard()) return false;
    if(this.isSeller()) return false;
    if(this.isAccountant()) return false;
    if(this.isStudent()) return false;
    if(this.isParent()) return false;
    return true
  }

  isShowPos(){
    if(this.isSeller()) return true;
    return false
  }

  isDeleteAction(){
    if(this.isAdmin()) return true
    return false
  }

  isStatusAction(){
    if(this.isAdmin()) return true
    if(this.isSeller()) return true
    return false
  }

  isEditAction(){
    if(this.settings.pageSettings.value.pageType === 'invoice') return false;
    if(this.settings.pageSettings.value.pageType === 'stud_accountant') return false;
    if(this.settings.pageSettings.value.pageType === 'exp_accountant') return false;
    if(this.isAdmin()) return true
    if(this.isSeller()) return true
    return false
  }

  isViewInvoiceAction(){
    if(this.settings.pageSettings.value.pageType !== 'invoice') return false;
    if(this.settings.pageSettings.value.pageType !== 'stud_accountant') return false;
    if(this.settings.pageSettings.value.pageType !== 'exp_accountant') return false;
    if(this.isAdmin()) return true
    if(this.isSeller()) return true
    return false
  }

  isShowSettings(){
    if(this.isAdminOnly()) return true;
    return false
  }

}
