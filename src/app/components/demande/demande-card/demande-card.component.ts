import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Demande } from 'app/models/shared/demande.model';
import { DemandeService } from 'app/services/shared/demande.service';
import * as myScript from '../../../../assets/js/card.js';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';
import { NotificationService } from 'app/services/shared/notification.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import swal from 'sweetalert2';
import { DialogDemandeComponent } from '../dialog-demande/dialog-demande.component';

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
  private jwtHelper = new JwtHelperService();
  id: number;

  constructor(private dialogRef: MatDialogRef<DemandeCardComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: Demande,
    private notificationService: NotificationService,
    private route: ActivatedRoute, 
    public dialog: MatDialog,
    private service: DemandeService,
    private userService: ApiService,) { }

  ngOnInit(): void {
    myScript.Card();
    this.getUtilisateurs();

    this.route.params.subscribe(params => {
      if (params.id) {
        const id = params['id'];
        this.getDemandeById(id);
      }
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

  PrisEnCharge(id: number): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const adminId = decodedToken.nameid;
      console.log('adminId:', adminId);
      this.service.PrisEnCharge(id, adminId).subscribe(() => {
        this.dialogRef.close();
        this.notificationService.success('Request taken in charge !');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
        () => {
          this.notificationService.danger('Error when taking a request.');
        });
    }
  }

  rejectDemande(id: number) : void{
    swal.fire({
      text: `Are you sure to reject this request ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'No',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.service.RejectDemande(id)
          .subscribe(
            data => {
              if (data !== 0) {
                this.dialogRef.close();
                this.notificationService.success('This request is rejected');
                setTimeout(() => {
                  window.location.reload();
                }, );
              } else {
                this.notificationService.danger('Reject request failed');
              }
            },
            () => {
              this.notificationService.danger('Reject request failed');
            }
          );
      }
    });
  }

  updateDemande(row: any) {
    this.dialog.open(DialogDemandeComponent, {
      data: row,
    }).afterClosed().subscribe(result=>{
    })
    }
    
  close() {
    this.dialogRef.close();
  }

  cancel() {
    this.close();
  }

}
