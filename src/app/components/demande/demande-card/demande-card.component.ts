import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Demande } from 'app/models/shared/demande.model';
import { DemandeService } from 'app/services/shared/demande.service';
import * as myScript from '../../../../assets/js/card.js';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';

@Component({
  selector: 'app-demande-card',
  templateUrl: './demande-card.component.html',
  styleUrls: ['./demande-card.component.scss']
})
export class DemandeCardComponent implements OnInit {

  demande: Demande;
  demandes: Demande[];
  utilisateurs!: Utilisateur[];
  utilisateur: Utilisateur = new Utilisateur();

  constructor(private dialogRef: MatDialogRef<DemandeCardComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Demande,
    private route: ActivatedRoute, 
    private service: DemandeService,
    private userService: ApiService,) { }

  ngOnInit(): void {
    myScript.Card();
    this.getUtilisateurs();
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getDemandeById(id);
    });
  }

  getDemandeById(id: number) {
    this.service.GetDemande(id).subscribe(data => {
      this.demande = data;
    });
  }

  getUtilisateurs(): void {
    this.userService.GetUtilisateurs().subscribe(utilisateurs => {
      this.utilisateurs = utilisateurs;
    });
  }

  getUserNom(id: number): string {
    const user = this.utilisateurs.find(s => s.id === id);
    return user ? (user.nom + ' ' + user.prenom) : '';
  }

  close() {
    this.dialogRef.close();
  }

  cancel() {
    this.close();
  }

}
