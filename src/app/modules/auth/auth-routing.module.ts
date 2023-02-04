import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { PasswordResetSentComponent } from './components/password-reset-sent/password-reset-sent.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PasswordForgetSentGuard } from 'src/app/shared/guards/auth/password-forget-sent.guard';
import { PasswordResetInfoCheckGuard } from 'src/app/shared/guards/auth/password-reset-info-check.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
        data: { returnUrl: window.location.pathname },
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
      {
        path: 'password-reset-sent',
        canActivate:[PasswordForgetSentGuard],
        component: PasswordResetSentComponent,
      },
      {
        path: 'password-reset',
        canActivate:[PasswordResetInfoCheckGuard],
        component: PasswordResetComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
