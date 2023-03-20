import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Departement } from 'app/models/shared/departement.model';
import { Poste } from 'app/models/shared/poste.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';
import { NotificationService } from 'app/services/shared/notification.service';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  userForm!: FormGroup;
  postes!: Poste[];
  departements!: Departement[];
  ListeUser!: Utilisateur[];
  utilisateur: Utilisateur = new Utilisateur();
  ActionBtn: string = "Ajouter";
  private jwtHelper = new JwtHelperService();
  public matricule: string = '';
  hide = true;
  selectedImage = '';
  selectedFileName = '';
  dateAjout = new Date();
  dateModif = new Date();
  datePipe = new DatePipe('en-US');
  ajoutDate = this.datePipe.transform(this.dateAjout, 'yyyy-MM-ddTHH:mm:ss');
  modifDate = this.datePipe.transform(this.dateModif, 'yyyy-MM-ddTHH:mm:ss');
  userModif!: string;
  userAjout!: string;

  constructor(private builder: FormBuilder, 
              private service: ApiService, 
              private dialogRef: MatDialogRef<DialogUserComponent>, 
              @Inject(MAT_DIALOG_DATA) public editData: Utilisateur,
              private notificationService: NotificationService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.userForm = this.builder.group({
      // id: [''],
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      matricule: ['', Validators.required],
      dateEmbauche: ['', Validators.required],
      email: ['', Validators.required],
      tel: ['', Validators.required],
      role: ['', Validators.required],
      // image: ['', Validators.required],
      posteId: ['', Validators.required],
      departementId: ['', Validators.required],
      motDePasse: ['', Validators.required],
      salaire: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      userAjout: [''],
    });
    this.getPostes();
    this.getDepartements();

    console.log(this.editData)
    if(this.editData){
      this.ActionBtn = "Modifier";
      this.userForm.patchValue(this.editData);
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.matricule = decodedToken.family_name;
    }


  }

  AjouterUser() {
      if (!this.editData) { 
        this.userForm.value.dateAjout = this.ajoutDate;
        console.log(this.userForm.valid);
        if(this.userForm.valid) {
          this.userForm.value.userAjout = this.matricule;
          const userAjout = this.userForm.value.userAjout;
        this.service.AddUtilisateur({ ...this.userForm.value, userAjout }).subscribe(() => {
          this.userForm.reset();
          this.dialogRef.close('ajouter');
          this.notificationService.success('User added successfully!');
        }, () => {
          this.notificationService.danger('Error when adding a User.');
        });
      }
      } else { // sinon, mettre à jour l'utilisateur existant
        this.updateUser();
      }
  }

  updateUser() {
    this.userForm.value.dateModif = this.modifDate;
    this.userForm.value.userModif = this.matricule;
    const userModif = this.userForm.value.userModif;
    this.service.UpdateUtilisateur(this.editData.id, { ...this.userForm.value, userModif }).subscribe(() => {
      this.userForm.reset();
      this.dialogRef.close('modifier');
      this.notificationService.success('User updated successfully!');
    }, () => {
      this.notificationService.danger('Error when updating a User.');
    });
  }
  
  getPostes(): void {
    this.service.GetPostes().subscribe(postes => {
      this.postes = postes;
    });
  }

  getDepartements(): void {
    this.service.GetDepartements().subscribe(departements => {
      this.departements = departements;
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.utilisateur.image = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  close() {
    this.dialogRef.close();
  }

  cancel() {
    this.close();
  }
}
