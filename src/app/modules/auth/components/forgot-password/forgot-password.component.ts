import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { OnDestroy } from '@angular/core';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  recaptcha:any;
  siteKey = '6Lddk-MgAAAAADyIeryKj2sWjmG-wi7c_1Z0qLVf'

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public settings: AppSettingsService,
    public translate: TranslateService,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }
  get fieldIsRequired(){
    return this.translate.instant('general.this_field_required')
  }


  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), 
        ]),
      ],
      // captcha: ['', Validators.required]
    });
  }

  handleSuccess(event: any){
    this.forgotPasswordForm.get('captcha')?.setValue(event)
  }
  handleReset(){
    this.forgotPasswordForm.get('captcha')?.setValue('')
  }

  submit() {

    // if(this.forgotPasswordForm.get('captcha')?.value === '') return


    this.errorState = ErrorStates.NotSubmitted;
    const forgotPasswordSubscr = this.authService
      .forgetPassword(this.f.email.value)
      .pipe(first())
      .subscribe((result: boolean) => {
        if(!result) return
        this.router.navigate(['/auth/password-reset-sent'])
      });

    this.unsubscribe.push(forgotPasswordSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
