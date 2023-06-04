import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Site } from 'app/models/shared/site.model';
import { ApiService } from 'app/services/shared/api.service';
import { Utilisateur } from 'app/models/shared/utilisateur.model.js';
import { Departement } from 'app/models/shared/departement.model.js';
import { MatDialog } from '@angular/material/dialog';
import { UserCardComponent } from '../user-card/user-card.component';
import {MatTabsModule} from '@angular/material/tabs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Poste } from 'app/models/shared/poste.model.js';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
})
export class AgendaComponent implements OnInit {

  site: Site;
  utilisateurs!: Utilisateur[];
  departements!: Departement[];
  searchTerm: string;
  employees: Utilisateur[];
  id: number;
  private jwtHelper = new JwtHelperService();

  constructor(private route: ActivatedRoute, private Service: ApiService,
    private dialogRef: MatDialogRef<AgendaComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
     public dialog: MatDialog) { }

  ngOnInit() {
    this.getUtilisateurs();
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getSiteById(id);
    });
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.id = decodedToken.nameid;  
      console.log(this.id);
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

  getUtilisateurRole(id: number): string {
    const utilisateur = this.utilisateurs.find(s => s.id === id);
    return utilisateur ? (utilisateur.role) : '';
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

  
  close() {
    this.dialogRef.close();
  }

}
