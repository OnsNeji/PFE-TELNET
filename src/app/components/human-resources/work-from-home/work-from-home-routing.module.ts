import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Functions } from 'app/models/shared';
import { AuthGuard } from 'app/guards';
import { WorkFromHomeRequestComponent } from './work-from-home-request/work-from-home-request.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'work-from-home',
      function: Functions.WorkFromHome,
      status: false
    },
    canActivate: [AuthGuard],
    children: [
      {
        canActivate: [AuthGuard],
        path: 'work-from-home',
        component: WorkFromHomeRequestComponent,
        data: {
          title: 'Work From Home',
          function: Functions.WorkFromHome,
          status: true
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkFromHomeRoutingModule { }
