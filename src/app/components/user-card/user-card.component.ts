import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';
import * as myScript from '../../../assets/js/card.js';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  utilisateur: Utilisateur;

  constructor( private dialogRef: MatDialogRef<UserCardComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: Utilisateur,
              private route: ActivatedRoute, 
              private userService: ApiService) { }

  ngOnInit(): void {
    myScript.Card();
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getUserById(id);
    });
  }

  getUserById(id: number) {
    this.userService.GetUtilisateur(id).subscribe(data => {
      this.utilisateur = data;
    });
  }

  close() {
    this.dialogRef.close();
  }

  cancel() {
    this.close();
  }
}
