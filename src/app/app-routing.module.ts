import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import { AuthComponent } from './layout/auth/auth.component';
import { AuthGuard } from 'app/guards';
import { ProfileComponent } from './components/profile/profile.component';
import { SiteComponent } from './components/site/site.component';
import { DepartementComponent } from './components/departement/departement.component';
import { PosteComponent } from './components/poste/poste.component';
import { UtilisateurComponent } from './components/utilisateur/utilisateur.component';
import { EmployeMoisComponent } from './components/employe-mois/employe-mois.component';
import { EvenementComponent } from './components/evenement/evenement.component';
import { MediaEventComponent } from './components/evenement/media-event/media-event.component';
import { AccueilComponent } from './components/accueil/accueil.component';
import { ConventionComponent } from './components/convention/convention.component';
import { NouveauteComponent } from './components/nouveaute/nouveaute.component';
import { MariageComponent } from './components/mariage/mariage.component';
import { ProjectSuccessComponent } from './components/project-success/project-success.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { DemandeComponent } from './components/demande/demande.component';
import { DemandeGuard } from './guards/demande.guard';
import { DashComponent } from './components/dash/dash.component';
import { CongeComponent } from './components/conge/conge.component';
import { CongéGuard } from './guards/congé.guard';
import { CategorieComponent } from './components/categorie/categorie.component';
import { EmployéGuard } from './guards/employé.guard';
import { RhGuard } from './guards/rh.guard';


const routes: Routes = [

  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: '/accueil',
        pathMatch: 'full'
      },
      {
        path: 'auth',
        loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'pages',
        loadChildren: () => import('./components/extra-pages/pages.module').then(m => m.PagesModule)
      },
    ]
  },
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'project-management',
        loadChildren: () => import('./components/project-management/project-management.module').then(m => m.ProjectManagementModule)
      },
      {
        path: 'human-resources',
        loadChildren: () => import('./components/human-resources/human-resources.module').then(m => m.HumanResourcesModule)
      }
    ]
  },
  {
    path: '**', redirectTo: 'pages/page-not-found'
  },
  { path: 'profil/:id', component: ProfileComponent },
  { path: 'site', component: SiteComponent, canActivate: [AuthGuard, EmployéGuard] },
  { path: 'departement', component: DepartementComponent, canActivate: [AuthGuard, EmployéGuard] },
  { path: 'poste', component: PosteComponent, canActivate: [AuthGuard, EmployéGuard] },
  { path: 'utilisateur', component: UtilisateurComponent, canActivate: [AuthGuard, EmployéGuard, RhGuard] },
  { path: 'employeMois', component: EmployeMoisComponent, canActivate: [AuthGuard, EmployéGuard, RhGuard] },
  { path: 'evenement', component: EvenementComponent, canActivate: [AuthGuard, EmployéGuard] },
  { path: 'mediaEvent', component: MediaEventComponent, canActivate: [AuthGuard, EmployéGuard] },
  { path: 'accueil', component: AccueilComponent },
  { path: 'convention', component: ConventionComponent, canActivate: [AuthGuard, EmployéGuard] },
  { path: 'nouveauté', component: NouveauteComponent, canActivate: [AuthGuard, EmployéGuard] },
  { path: 'mariage-naissance', component: MariageComponent, canActivate: [AuthGuard, EmployéGuard] },
  { path: 'project-success', component: ProjectSuccessComponent, canActivate: [AuthGuard, EmployéGuard] },
  { path: 'demandes', component: DemandeComponent, canActivate: [AuthGuard, DemandeGuard] },
  { path: 'demande/:id', component: DemandeComponent, canActivate: [AuthGuard] },
  { path: 'dash', component: DashComponent, canActivate: [AuthGuard] },
  { path: 'conges', component: CongeComponent, canActivate: [AuthGuard, CongéGuard, RhGuard] },
  { path: 'conge/:id', component: CongeComponent, canActivate: [AuthGuard] },
  { path: 'categorie', component: CategorieComponent, canActivate: [AuthGuard, EmployéGuard] },


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
