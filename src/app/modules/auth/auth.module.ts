import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthComponent } from './auth.component';
import { TranslationModule } from '../i18n/translation.module';
import { PasswordResetSentComponent } from './components/password-reset-sent/password-reset-sent.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    AuthComponent,
    PasswordResetSentComponent,
    PasswordResetComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxCaptchaModule
  ],
})
export class AuthModule {}
