import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MariageNaissance } from 'app/models/shared/mariageNaissance.model';
import { Nouveauté } from 'app/models/shared/nouveauté.model';
import { Site } from 'app/models/shared/site.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { NotificationService } from 'app/services/shared';
import { ApiService } from 'app/services/shared/api.service';
import { MariageNaissanceService } from 'app/services/shared/mariageNaissance.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-mariage',
  templateUrl: './dialog-mariage.component.html',
  styleUrls: ['./dialog-mariage.component.scss']
})
export class DialogMariageComponent implements OnInit {

  
  MariageNaissances!: MariageNaissance[];
  MariageNaissance: MariageNaissance = new MariageNaissance();
  utilisateurs! : Utilisateur[];
  mariageForm!: FormGroup;
  ActionBtn: string = "Ajouter";
  private jwtHelper = new JwtHelperService();
  public matricule: string = '';
  imageUrl: string;
  public userFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();
  filteredUsers: Utilisateur[];

  constructor(private builder: FormBuilder, 
              private service: ApiService, 
              private MNService: MariageNaissanceService,
              private mariageService: MariageNaissanceService,
              private dialogRef: MatDialogRef<DialogMariageComponent>, 
              @Inject(MAT_DIALOG_DATA) public editData: MariageNaissance,
              private notificationService: NotificationService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.mariageForm = this.builder.group({
      titre : ['', Validators.required],
      utilisateurId : ['', Validators.required],
      messageVoeux : ['', Validators.required],
      userAjout: [''],
      date: [''],
    });

    console.log(this.editData)
    if(this.editData){
      this.ActionBtn = "Modifier";
      // this.departementForm.patchValue(this.editData);
      this.mariageForm.setValue({
        titre: this.editData.titre,
        userAjout : this.editData.userAjout,
        date: this.editData.date,
        utilisateurId: this.editData.utilisateurId,   
        messageVoeux: this.editData.messageVoeux,    
      });
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.matricule = decodedToken.family_name;
    }

    this.getUsers();
    this.userFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterUsers();
    });
  }
  
  filterUsers() {
    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUsers = this.utilisateurs.slice();
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredUsers = this.utilisateurs.filter(user => 
      user.nom.toLowerCase().indexOf(search) > -1 || user.prenom.toLowerCase().indexOf(search) > -1);
  }

  getUsers(): void {
    this.service.GetUtilisateurs().subscribe(utilisateurs => {
      this.utilisateurs = utilisateurs;
      this.filteredUsers = utilisateurs;
    });
  }

  AjouterMariageNaissance(){
    if(!this.editData){
      if(this.mariageForm.valid){
        this.mariageForm.value.userAjout = this.matricule;
        const userAjout = this.mariageForm.value.userAjout;
        const datePublication = new Date();
        this.mariageService.AddMariageNaissance({ ...this.mariageForm.value, userAjout }).subscribe(()=>{
          this.mariageForm.reset();
          this.dialogRef.close('ajouter');
          this.notificationService.success('Mariage added successfully !');
        },
        ()=>{
          this.notificationService.danger('Error when adding a Mariage.');
        })
      }
    } else {
      this.updateMariageNaissance();
    }
  }

  updateMariageNaissance(){
    const date = new Date(this.mariageForm.value.date);
    if (this.mariageForm.value.date == this.editData.date) {
      date.setDate(date.getDate());
    }
    if (this.mariageForm.value.date != this.editData.date) {
      date.setDate(date.getDate() + 1);
    }
    if (this.mariageForm.valid) {
    this.mariageService.UpdateMariageNaissance(this.editData.id, { ...this.mariageForm.value, date }).subscribe(()=>{
      this.mariageForm.reset();
      this.dialogRef.close('modifier');
      this.notificationService.success('Mariage modified successfully !');
    },
    ()=>{
      this.notificationService.danger('Error when modifying a Mariage.');
    });
  }
  }

  close() {
    this.dialogRef.close();
  }

  cancel() {
    this.close();
  }


}
