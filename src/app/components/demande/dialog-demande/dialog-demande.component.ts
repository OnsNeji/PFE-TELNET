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

@Component({
  selector: 'app-dialog-demande',
  templateUrl: './dialog-demande.component.html',
  styleUrls: ['./dialog-demande.component.scss']
})
export class DialogDemandeComponent implements OnInit {

  demandeForm!: FormGroup;
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
    private dialogRef: MatDialogRef<DialogDemandeComponent>, 
    @Inject(MAT_DIALOG_DATA) public editData: Demande,
    private notificationService: NotificationService,
    private route: ActivatedRoute) {}

    ngOnInit(): void {
      this.demandeForm = this.builder.group({
        // id : [''],
        titre : ['', Validators.required],
        description : ['', Validators.required],
        utilisateurId : [''],
        document : [''],
        status: [''],
        date: [''],
        mois: [],
        motif: [''],
        destinataire: [''],
        dateSortie:[],
        
      });
      this.getUtilisateurs();

      console.log(this.editData)
      if(this.editData){
        this.ActionBtn = "Modifier";
        // this.departementForm.patchValue(this.editData);
        this.demandeForm.patchValue(this.editData);
      }
  
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        this.id = decodedToken.nameid;
      }
    }


    AjouterDemande(){
      if(!this.editData){
        
        this.demandeForm.value.document = this.pdfUrl;
        console.log(this.demandeForm.valid)
        if(this.demandeForm.valid){
          const mois = new Date(this.demandeForm.value.mois);
          mois.setDate(mois.getDate() + 1);
          const dateSortie = new Date(this.demandeForm.value.dateSortie);
          dateSortie.setHours(dateSortie.getHours() + 1);
          dateSortie.setDate(dateSortie.getDate() + 1);
          
          this.demandeForm.value.utilisateurId = this.id;

          const utilisateurId = parseInt(this.demandeForm.value.utilisateurId);

          const date= new Date();
          this.demandeService.AddDemande({ ...this.demandeForm.value, utilisateurId, date, mois, dateSortie }).subscribe(()=>{
            this.demandeForm.reset();
            this.dialogRef.close('ajouter');
            this.notificationService.success('Request added successfully !');
  
          },
          ()=>{
            this.notificationService.danger('Error when adding a request.');
          })
        }
      } else {
        this.updateDemande();
      }
    }
  
    updateDemande(){
      if (!this.pdfUrl) {
        this.demandeForm.value.document = this.editData.document;
      } else {
        this.demandeForm.value.document = this.pdfUrl;
      }
  
      if (this.demandeForm.valid) {
      this.demandeService.UpdateDemande(this.editData.id, { ...this.demandeForm.value }).subscribe(()=>{
        this.demandeForm.reset();
        this.dialogRef.close('modifier');
        this.notificationService.success('Request approuved successfully !');
      },
      ()=>{
        this.notificationService.danger('Error when approuving a request.');
      });
    }
    }

    onTitreChange(event: any) {
      const titre = event.value;
      this.afficherMois = titre === 'Fiche de paie';
      this.afficherMotif = titre === 'Fiche de paie';
      this.afficherDestinataire = titre === 'Lettre de recommandation';
      this.afficherDateSortie = titre === 'Autorisation de sortie';
    }
    
  onPDFSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.pdfUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
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
