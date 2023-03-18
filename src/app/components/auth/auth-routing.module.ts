import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardLogin, AuthGuardReset } from 'app/guards';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardLogin],
    data: {
      title: 'Authentication',
      status: false
    },
    children: [
      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'send-reset-password',
        loadChildren: () => import('./send-reset-password/send-reset-password.module').then(m => m.SendResetPasswordModule)
      },
      {
        path: 'lock-screen',
        loadChildren: () => import('./lock-screen/lock-screen.module').then(m => m.LockScreenModule)
      },
      {
        path: 'reset',
        component: ResetPasswordComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
