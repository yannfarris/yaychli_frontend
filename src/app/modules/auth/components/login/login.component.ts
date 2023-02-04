import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, of } from 'rxjs';
import { catchError, finalize, first } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: 'admin@demo.com',
    password: 'demo',
  };
  loginForm: FormGroup;
  hasError: boolean;
  hasBranchError: boolean;
  hasActiveError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  recaptcha:any;
  siteKey = '6Lddk-MgAAAAADyIeryKj2sWjmG-wi7c_1Z0qLVf'
  isShowPassword = false

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    // private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public settings: AppSettingsService,
    public translate: TranslateService,
    private authService: AuthService

  ) {
    
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  // convenience getter for easy access to form fields
  get f():any {
    return this.loginForm.controls;
  }
  get fieldIsRequired(){
    return this.translate.instant('general.this_field_required')
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
        ]),
      ],
      // captcha: ['', Validators.required]
    });
  }

  reset(){
    
  }

  
  showPassword(){
    this.isShowPassword = !this.isShowPassword
  }

  handleSuccess(event: any){
    this.loginForm.get('captcha')?.setValue(event)
  }
  handleReset(){
    this.loginForm.get('captcha')?.setValue('')
  }
  
  submit() {

    // if(this.loginForm.get('captcha')?.value === '') return

    this.hasActiveError = false;
    this.hasError = false;
    this.hasBranchError = false;

    const loginSub = this.authService.login(this.f.email.value, this.f.password.value)

    .pipe(
      finalize(() => this.reset()),
    )

    .subscribe((user:any) => {
      
      if(user?.error?.type == 'isBranchExist') {
        this.hasBranchError = true  
        return
      }
      if(user?.error?.type == 'userNotActive') {
        this.hasActiveError = true  
        return
      }

      if(user?.error) {
        this.hasError = true  
        return
      }
   
      this.router.navigate([this.returnUrl])
      return

    })
    this.unsubscribe.push(loginSub);
    
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
