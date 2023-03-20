import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Poste } from 'app/models/shared/poste.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';
import { NotificationService } from 'app/services/shared/notification.service';

@Component({
  selector: 'app-dialog-poste',
  templateUrl: './dialog-poste.component.html',
  styleUrls: ['./dialog-poste.component.scss']
})
export class DialogPosteComponent implements OnInit {

  
  posteForm!: FormGroup;
  utilisateurs!: Utilisateur[];
  ListePoste!: Poste[];
  poste: Poste = new Poste();
  ActionBtn: string = "Ajouter";
  private jwtHelper = new JwtHelperService();
  public matricule: string = '';
  // dateAjout = new Date();
  // dateModif = new Date();
  // datePipe = new DatePipe('en-US');
  // ajoutDate = this.datePipe.transform(this.dateAjout, 'yyyy-MM-ddTHH:mm:ss');
  // modifDate = this.datePipe.transform(this.dateModif, 'yyyy-MM-ddTHH:mm:ss');
  
  constructor(private builder: FormBuilder, 
              private service: ApiService, 
              private dialogRef: MatDialogRef<DialogPosteComponent>, 
              @Inject(MAT_DIALOG_DATA) public editData: Poste,
              // @Inject(MAT_DIALOG_DATA) public data: { id: number, editData: Poste },
              private notificationService: NotificationService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.posteForm = this.builder.group({
      // id : ['', [Validators.required, Validators.pattern(/^-?[0-9]\d*(\d+)?$/)]],
      numéro : ['', Validators.required],
      utilisateurId : ['', Validators.required],
      userAjout: [''],
    });
    this.getUtilisateurs();
    

    console.log(this.editData)
    if(this.editData){
      this.ActionBtn = "Modifier";
      this.posteForm.patchValue(this.editData);
    }
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.matricule = decodedToken.family_name;
    }
  }

  AjouterPoste(){
    
    if(!this.editData){
      if(this.posteForm.valid){
        
        this.posteForm.value.numéro= parseInt(this.posteForm.value.numéro);
        this.posteForm.value.userAjout = this.matricule;
        const userAjout = this.posteForm.value.userAjout;
        console.log(this.posteForm.value);
        this.service.AddPoste( { ...this.posteForm.value, userAjout }).subscribe(()=>{

          this.posteForm.reset();
          this.dialogRef.close('ajouter');
          this.notificationService.success('Poste added successfully !');
        },
        ()=>{
          this.notificationService.danger('Error when adding a Poste.');
        })
      }
    } else {
      this.updatePoste();
    }
  }

  updatePoste(){
    this.posteForm.value.numéro= parseInt(this.posteForm.value.numéro);
    
    this.posteForm.value.userModif = this.matricule;
    const userModif = this.posteForm.value.userModif;
    const dateModif = new Date();
    this.service.UpdatePoste(this.editData.id, { ...this.posteForm.value, userModif, dateModif}).subscribe(()=>{
      console.log(this.posteForm.value);
      this.posteForm.reset();
        this.dialogRef.close('modifier');
        this.notificationService.success('Poste modified successfully !');
    });
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
