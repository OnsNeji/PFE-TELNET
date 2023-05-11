import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Congé } from 'app/models/shared/congé.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';
import { CongéService } from 'app/services/shared/congé.service';
import * as myScript from '../../../../assets/js/card.js';

@Component({
  selector: 'app-conge-card',
  templateUrl: './conge-card.component.html',
  styleUrls: ['./conge-card.component.scss']
})
export class CongeCardComponent implements OnInit {

  conge: Congé;
  conges: Congé[];
  utilisateurs!: Utilisateur[];
  utilisateur: Utilisateur = new Utilisateur();

  constructor(private dialogRef: MatDialogRef<CongeCardComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Congé,
    private route: ActivatedRoute, 
    private service: CongéService,
    private userService: ApiService,) { }

    ngOnInit(): void {
      myScript.Card();
      this.getUtilisateurs();
      this.route.params.subscribe(params => {
        const id = params['id'];
        this.getCongeById(id);
      });
    }
  
    getCongeById(id: number) {
      this.service.GetCongé(id).subscribe(data => {
        this.conge = data;
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
