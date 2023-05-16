import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Demande } from 'app/models/shared/demande.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { NotificationService } from 'app/services/shared';
import { ApiService } from 'app/services/shared/api.service';
import { DemandeService } from 'app/services/shared/demande.service';
import { Subject } from 'rxjs';
import { DialogDemandeComponent } from '../dialog-demande/dialog-demande.component';

@Component({
  selector: 'app-reopen-demande',
  templateUrl: './reopen-demande.component.html',
  styleUrls: ['./reopen-demande.component.scss']
})
export class ReopenDemandeComponent implements OnInit {

  reopenForm!: FormGroup;
  utilisateurs!: Utilisateur[];
  demandes!: Demande[];
  demande: Demande = new Demande();
  ActionBtn: string = "Ajouter";
  private jwtHelper = new JwtHelperService();
  public id: number;
  public userFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();
  filteredUsers: Utilisateur[];
  pdfUrl: string; 
  afficherMois: boolean;
  afficherMotif: boolean;
  afficherDestinataire: boolean;
  afficherDateSortie: boolean;

  constructor(private builder: FormBuilder, 
    private service: ApiService, 
    private demandeService: DemandeService,
    private dialogRef: MatDialogRef<ReopenDemandeComponent>, 
    @Inject(MAT_DIALOG_DATA) public reouvert: Demande,
    private notificationService: NotificationService,
    private route: ActivatedRoute) {}

    ngOnInit(): void {
      this.reopenForm = this.builder.group({
        // id : [''],
        titre : ['', Validators.required],
        description : ['', Validators.required],
        priorite : ['', Validators.required],
        utilisateurId : [''],
        document : [],
        status: [''],
        date: [''],
        mois: [],
        motif: [''],
        destinataire: [''],
        dateSortie:[],
        adminId : [],
        
      });
      this.getUtilisateurs();

      if(this.reouvert ){
        this.ActionBtn = "Modifier";
        this.reopenForm.patchValue(this.reouvert);
      }
  
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        this.id = decodedToken.nameid;
      }
    }

    reouvrirDemande(){
      if (!this.pdfUrl) {
        this.reopenForm.value.document = this.reouvert.document;
      } else {
        this.reopenForm.value.document = this.pdfUrl;
      }
  
      if (this.reopenForm.valid) {
      this.demandeService.ReouvrirDemande(this.reouvert.id, { ...this.reopenForm.value }).subscribe(()=>{
        this.reopenForm.reset();
        this.dialogRef.close('modifier');
        this.notificationService.success('Request reopened successfully !');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      },
      ()=>{
        this.notificationService.danger('Error when reopening a request.');
      });
    }
    }

    getUtilisateurs(): void {
      this.service.GetUtilisateurs().subscribe(utilisateurs => {
        this.utilisateurs = utilisateurs;
      });
    }

    close() {
      this.dialogRef.close();
    }
  
    cancel() {
      this.close();
    }

}
