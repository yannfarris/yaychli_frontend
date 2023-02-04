import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/appSettings/app-settings.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-password-reset-sent',
  templateUrl: './password-reset-sent.component.html',
  styleUrls: ['./password-reset-sent.component.scss']
})
export class PasswordResetSentComponent implements OnDestroy, OnInit {

  constructor(
    public settings: AppSettingsService,
    public translate: TranslateService,
    private router: Router,
    private authService: AuthService
  ) { }

  passwordResetTryAgain(){
    this.router.navigate(['/auth/forgot-password'])
  }

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(){
    this.authService.passwordForgetSent.next(false)
  }

}
