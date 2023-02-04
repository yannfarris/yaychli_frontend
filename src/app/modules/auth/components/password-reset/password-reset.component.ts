import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ModalsService } from 'src/app/shared/services/modals/modals.service';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  recaptcha: any;
  siteKey = '6Lddk-MgAAAAADyIeryKj2sWjmG-wi7c_1Z0qLVf'

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public settings: AppSettingsService,
    public translate: TranslateService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private modal: ModalsService
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }

  }
  get fieldIsRequired() {
    return this.translate.instant('general.this_field_required')
  }


  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      pass1: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(40),
        ]),
      ],
      pass2: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(40),
        ]),
      ],
      // captcha: ['', Validators.required]
    });
  }


  handleSuccess(event: any) {
    this.forgotPasswordForm.get('captcha')?.setValue(event)
  }
  handleReset() {
    this.forgotPasswordForm.get('captcha')?.setValue('')
  }
  submit() {

    // if (this.forgotPasswordForm.get('captcha')?.value === '') return


    let m = this.activeRoute.snapshot.queryParams.m
    let tk = this.activeRoute.snapshot.queryParams.tk
    if (!m || !tk) return this.router.navigate(['/'])

    if (this.f.pass1.value !== this.f.pass2.value) return

    this.errorState = ErrorStates.NotSubmitted;
    const forgotPasswordSubscr = this.authService
      .newPassword(this.f.pass1.value, m, tk)
      .pipe(first())
      .subscribe((result) => {
        if (!result) return
        this.modal.generalSuccessMessageModal('auth.password_changed')
        this.router.navigate(['auth/login']);
      });

    this.unsubscribe.push(forgotPasswordSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
