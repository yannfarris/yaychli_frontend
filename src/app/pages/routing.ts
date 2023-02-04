import { Routes } from '@angular/router';
import { IsAdminGuard } from '../shared/guards/role/is-admin.guard';
import { IsShowAttendanceGuard } from '../shared/guards/role/is-show-attendance.guard';
import { IsShowDashboardGuard } from '../shared/guards/role/is-show-dashboard.guard';
import { IsShowMediaGuard } from '../shared/guards/role/is-show-media.guard';
import { IsSuperAdminGuard } from '../shared/guards/role/is-super-admin.guard';

const Routing: Routes = [

  { path: 'branches',canActivate:[IsSuperAdminGuard], loadChildren: () => import('./branches/branches.module').then(m => m.BranchesModule) },
  { path: 'user',canActivate:[IsAdminGuard], loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'driver', canActivate:[IsAdminGuard], loadChildren: () => import('./driver/driver.module').then(m => m.DriverModule) },
  { path: 'bus', canActivate:[IsAdminGuard], loadChildren: () => import('./bus/bus.module').then(m => m.BusModule) },
  { path: 'trips', loadChildren: () => import('./trips/trips.module').then(m => m.TripsModule) },
  { path: 'dashboard', canActivate:[IsShowDashboardGuard], loadChildren: () => import('./dashboard-lite/dashboard-lite.module').then(m => m.DashboardLiteModule) },


  
  { path: 'schools', canActivate:[IsSuperAdminGuard], loadChildren: () => import('./schools/schools.module').then(m => m.SchoolsModule) },
  { path: 'media', canActivate:[IsShowMediaGuard], loadChildren: () => import('./media/media.module').then(m => m.MediaModule) },
  { path: 'ads',canActivate:[IsSuperAdminGuard], loadChildren: () => import('./ads/ads.module').then(m => m.AdsModule) },
  { path: 'attendance',canActivate:[IsShowAttendanceGuard], loadChildren: () => import('./attendance/attendance.module').then(m => m.AttendanceModule) },
  { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
  { path: 'pos', loadChildren: () => import('./pos/pos.module').then(m => m.PosModule) },
  { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
  { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule) },
  { path: 'accountant', loadChildren: () => import('./accountant/accountant.module').then(m => m.AccountantModule) },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
  { path: 'revs', loadChildren: () => import('./revs/revs.module').then(m => m.RevsModule) },

  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
