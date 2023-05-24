import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Site } from 'app/models/shared/site.model';
import { ApiService } from 'app/services/shared/api.service';
import * as myScript from '../../../assets/js/tabs.js';
import { Utilisateur } from 'app/models/shared/utilisateur.model.js';
import { Departement } from 'app/models/shared/departement.model.js';
import { MatDialog } from '@angular/material/dialog';
import { UserCardComponent } from '../user-card/user-card.component';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {

  site: Site;
  utilisateurs!: Utilisateur[];
  departements!: Departement[];
  searchTerm: string;
  employees: Utilisateur[];

  constructor(private route: ActivatedRoute, private Service: ApiService, public dialog: MatDialog) { }

  ngOnInit() {
    myScript.Tabs();
    this.getUtilisateurs();
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getSiteById(id);
    });
    this.search();
  }
  search(): void {
    if (this.searchTerm) {
      this.Service.SearchEmployees(this.searchTerm)
        .subscribe(
          (data) => {
            this.employees = data;
            console.log(this.employees);
          },
          (error) => {
            console.log('An error occurred while searching employees.');
          }
        );
    } else {
      this.employees = [];
    }
  }

  getSiteById(id: number) {
    this.Service.GetSite(id).subscribe(data => {
      this.site = data;
    });
  }

  getUtilisateurs(): void {
    this.Service.GetUtilisateurs().subscribe(utilisateurs => {
      this.utilisateurs = utilisateurs;
    });
  }

  getUtilisateurNom(id: number): string {
    const utilisateur = this.utilisateurs.find(s => s.id === id);
    return utilisateur ? (utilisateur.nom + ' ' + utilisateur.prenom) : '';
  }

  getUtilisateurImg(id: number): string {
    const utilisateur = this.utilisateurs.find(s => s.id === id);
    return utilisateur ? (utilisateur.image) : '';
  }

  getUtilisateurDep(id: number): number {
    const utilisateur = this.utilisateurs.find(s => s.id === id);
    return utilisateur ? (utilisateur.departementId) : null;
  }

  getUtilisateurMatricule(id: number): string {
    const utilisateur = this.utilisateurs.find(s => s.id === id);
    return utilisateur ? (utilisateur.matricule) : null;
  }

  getUtilisateur(id: number) {
    console.log('Méthode getUtilisateur appelée avec l\'id:', id);
    this.Service.GetUtilisateur(id).subscribe(
      (data) => {
        console.log(data);
        const dialogRef = this.dialog.open(UserCardComponent, {
          data: data,
        });
        
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
