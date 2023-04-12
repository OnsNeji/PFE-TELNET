import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';
import * as myScript from '../../../assets/js/card.js';
import { Departement } from 'app/models/shared/departement.model';
import { Site } from 'app/models/shared/site.model.js';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  utilisateur: Utilisateur;
  utilisateurs: Utilisateur[];
  site: Site[];
  departements!: Departement[];
  departement: Departement = new Departement();

  constructor( private dialogRef: MatDialogRef<UserCardComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: Utilisateur,
              private route: ActivatedRoute, 
              private service: ApiService) { }

  ngOnInit(): void {
    myScript.Card();
    this.getDépartements();
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getUserById(id);
    });
  }

  getUserById(id: number) {
    this.service.GetUtilisateur(id).subscribe(data => {
      this.utilisateur = data;
    });
  }

  getDépartements(): void {
    this.service.GetDepartements().subscribe(departements => {
      this.departements = departements;
    });
  }

  getDepNom(id: number): string {
    const dep = this.departements.find(s => s.id === id);
    return dep ? dep.nom : '';
  }

  getChefDepartement(id: number): Number {
    const departement = this.departements.find(d => d.id === id);
    return departement ? departement.chefD : null;
  }

  getNomChefDepartement(id: number): string {
    const departement = this.departements.find(d => d.id === id);
    if (departement) {
      const chef = departement.utilisateurs.find(u => u.id === departement.chefD);
      if (chef) {
        return chef.nom + ' ' + chef.prenom;
      }
    }
    return '';
  }
  
  // getNomSite(id: number): string {
  //   const departement = this.departements.find(d => d.id === id);
  //   if (departement) {
  //     const site = departement.site.find(u => u.id === departement.siteId);
  //     if (site) {
  //       return site.site;
  //     }
  //   }
  //   return '';
  // }

  close() {
    this.dialogRef.close();
  }

  cancel() {
    this.close();
  }
}
