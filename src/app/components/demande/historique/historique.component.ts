import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Demande } from 'app/models/shared/demande.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';
import { DemandeService } from 'app/services/shared/demande.service';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent implements OnInit {

  demande: Demande;
  demandes: Demande[];
  utilisateurs!: Utilisateur[];
  utilisateur: Utilisateur = new Utilisateur();

  constructor(public dialogRef: MatDialogRef<HistoriqueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: DemandeService, 
    private route: ActivatedRoute,
    private userService: ApiService, ) {}

  ngOnInit(): void {
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
  

  close(): void {
    this.dialogRef.close();
  }
}
