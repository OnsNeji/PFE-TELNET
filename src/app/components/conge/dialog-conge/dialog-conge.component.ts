import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Congé } from 'app/models/shared/congé.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { NotificationService } from 'app/services/shared';
import { ApiService } from 'app/services/shared/api.service';
import { CongéService } from 'app/services/shared/congé.service';
import { UserService } from 'app/services/shared/user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dialog-conge',
  templateUrl: './dialog-conge.component.html',
  styleUrls: ['./dialog-conge.component.scss']
})
export class DialogCongeComponent implements OnInit {

  congeForm!: FormGroup;
  utilisateurs!: Utilisateur[];
  utilisateur: Utilisateur = new Utilisateur();

  conges!: Congé[];
  conge: Congé = new Congé();
  ActionBtn: string = "Ajouter";
  private jwtHelper = new JwtHelperService();
  id: number;
  public userFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();
  filteredUsers: Utilisateur[];
  pdfUrlD: string; 
  pdfUrlJ: string;
  sexe: string; 

  constructor(private builder: FormBuilder, 
    private service: ApiService, 
    private congéService: CongéService,
    private dialogRef: MatDialogRef<DialogCongeComponent>, 
    @Inject(MAT_DIALOG_DATA) public editData: Congé,
    private notificationService: NotificationService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.congeForm = this.builder.group({
      // id : [''],
      type : ['', Validators.required],
      description : ['', Validators.required],
      utilisateurId : [''],
      document : [''],
      justificatif : [''],
      status: [''],
      date: [''],
      dateDebut: ['', Validators.required],
      duree: ['', Validators.required],
    });
    this.getUtilisateurs();
    
    console.log(this.editData)
    if(this.editData){
      this.ActionBtn = "Modifier";
      // this.departementForm.patchValue(this.editData);
      this.congeForm.patchValue(this.editData);
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.id = decodedToken.nameid;
      this.sexe = decodedToken.gender;  
    }
    
  }

  AjouterConge(){
    if(!this.editData){
      
      this.congeForm.value.document = this.pdfUrlD;
      this.congeForm.value.justificatif = this.pdfUrlJ;
      console.log(this.congeForm.valid)
      if(this.congeForm.valid){
        const dateDebut = new Date(this.congeForm.value.dateDebut);
        dateDebut.setDate(dateDebut.getDate() + 1);
        
        this.congeForm.value.utilisateurId = this.id;

        const utilisateurId = parseInt(this.congeForm.value.utilisateurId);
        const duree = parseInt(this.congeForm.value.duree);

        const date= new Date();
        this.congéService.AddCongé({ ...this.congeForm.value, utilisateurId, duree, date, dateDebut }).subscribe(()=>{
          this.congeForm.reset();
          this.dialogRef.close('ajouter');
          this.notificationService.success('Time off added successfully !');

        },
        ()=>{
          this.notificationService.danger('Error when adding a time off.');
        })
      }
    } else {
      this.updateConge();
    }
  }

  updateConge(){
    if (!this.pdfUrlD) {
      this.congeForm.value.document = this.editData.document;
    } else {
      this.congeForm.value.document = this.pdfUrlD;
    }

    if (!this.pdfUrlJ) {
      this.congeForm.value.justificatif = this.editData.justificatif;
    } else {
      this.congeForm.value.justificatif = this.pdfUrlJ;
    }

    if (this.congeForm.valid) {
    this.congéService.UpdateCongé(this.editData.id, { ...this.congeForm.value }).subscribe(()=>{
      this.congeForm.reset();
      this.dialogRef.close('modifier');
      this.notificationService.success('Time off approuved successfully !');
    },
    ()=>{
      this.notificationService.danger('Error when approuving a time off.');
    });
  }
  }
onPDFDSelected(event: any): void {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    this.pdfUrlD = reader.result as string;
  };
  reader.readAsDataURL(file);
}

onPDFJSelected(event: any): void {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    this.pdfUrlJ = reader.result as string;
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
