import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Site } from 'app/models/shared/site.model';
import { ApiService } from 'app/services/shared/api.service';
import * as myScript from '../../../assets/js/tabs.js';
import { Utilisateur } from 'app/models/shared/utilisateur.model.js';
import { Departement } from 'app/models/shared/departement.model.js';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {

  site: Site;
  utilisateurs!: Utilisateur[];
  departements!: Departement[];

  constructor(private route: ActivatedRoute, private Service: ApiService) { }

  ngOnInit() {
    myScript.Tabs();
    this.getUtilisateurs();
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getSiteById(id);
    });
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

  // getNomDepartement(id: number): string {
  //   const utilisateur = this.utilisateurs.find(u => u.id === id);
  //   if (!utilisateur) {
  //     return null;
  //   }
  //   const departement = this.departements.find(d => d.id === utilisateur.departementId);
  //   return departement ? departement.nom : null;
  // }
  

}
