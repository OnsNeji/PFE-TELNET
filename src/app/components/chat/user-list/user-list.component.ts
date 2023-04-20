import { Component, OnInit } from '@angular/core';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  utilisateurs: Utilisateur[];

  constructor(private userService: ApiService) { }

  ngOnInit(): void {
    this.getUtilisateurs();
  }

  getUtilisateurs(): void {
    this.userService.GetUtilisateurs()
      .subscribe(utilisateurs => this.utilisateurs = utilisateurs);
  }

}
