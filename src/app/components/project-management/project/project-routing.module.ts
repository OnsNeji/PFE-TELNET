import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/guards';
import { Functions } from 'app/models/shared';
import { ReferencesComponent } from './references/references.component';
import { EditReferenceComponent } from './references/edit-reference/edit-reference.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Project',
      function: Functions.Project,
      status: false
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'references',
        component: ReferencesComponent,
        data: {
          title: 'References',
          icon: 'icon-home',
          function: Functions.References,
          status: true
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'edit-reference/:referenceId',
        component: EditReferenceComponent,
        data: {
          title: 'Edit Reference',
          icon: 'icon-home',
          function: Functions.References,
          status: true
        },
        canActivate: [AuthGuard]
      },

      {
        path: 'add-reference',
        component: EditReferenceComponent,
        data: {
          title: 'Add Reference',
          icon: 'icon-home',
          function: Functions.References,
          status: true
        },
        canActivate: [AuthGuard]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
