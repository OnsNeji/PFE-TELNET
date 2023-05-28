import { DatePipe } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
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
export default class DialogUserComponent implements OnInit {

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
  imageUrl: string;
  cache = false;
  dateSysteme: Date = new Date();

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
      sexe: ['', Validators.required],
      matricule: ['', Validators.required],
      dateEmbauche: ['', Validators.required],
      email: ['', Validators.required],
      tel: ['',[Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern("^[0-9]*$")]],
      role: ['', Validators.required],
      image: [''],
      departementId: ['', Validators.required],
      motDePasse: ['', Validators.required],
      salaire: ['', Validators.required],
      dateNaissance: ['', [Validators.required, this.validAge]],
      userAjout: [''],
    });
    this.getPostes();
    this.getDepartements();

    console.log(this.editData)
    if(this.editData){
      this.ActionBtn = "Modifier";
      this.cache = true;
      this.userForm.patchValue(this.editData);
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.matricule = decodedToken.family_name;
    }
  }

  validAge(control) {
    let eighteenYearsAgo = new Date();
    eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
    let value = new Date(control.value);
    if (value > eighteenYearsAgo) {
      return { tooYoung: true };
    }
    return null;
  }
  AjouterUser() {
    if (!this.editData) {
      this.userForm.value.dateAjout = this.ajoutDate;
      this.userForm.value.image = this.imageUrl;
      console.log(this.userForm.value.image);
      if (this.userForm.valid) {
        this.userForm.value.userAjout = this.matricule;
        const userAjout = this.userForm.value.userAjout;
        const dateEmbauche = new Date(this.userForm.value.dateEmbauche);
        dateEmbauche.setDate(dateEmbauche.getDate() + 1);
        const dateNaissance = new Date(this.userForm.value.dateNaissance);
        dateNaissance.setDate(dateNaissance.getDate() + 1);

        this.service.GetUtilisateurs().subscribe((data: Utilisateur[]) => {
          const matricules = data.map((user: Utilisateur) => user.matricule);
          const emails = data.map((user: Utilisateur) => user.email);
          if (matricules.includes(this.userForm.value.matricule)) {
            this.notificationService.danger('This matricule already exists!');
          } else if (emails.includes(this.userForm.value.email)) {
            this.notificationService.danger('This email already exists!');
          } else {
            this.service.AddUtilisateur({ ...this.userForm.value, dateEmbauche, dateNaissance, userAjout }).subscribe(() => {
              this.userForm.reset();
              this.dialogRef.close('ajouter');
              this.notificationService.success('User added successfully!');
            }, () => {
              this.notificationService.danger('Error when adding a User.');
            });
          }
        }, () => {
          this.notificationService.danger('Error when getting users from the database.');
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

    if (!this.imageUrl) {
      this.userForm.value.image = this.editData.image;
    } else {
      this.userForm.value.image = this.imageUrl;
    }

    const dateEmbauche = new Date(this.userForm.value.dateEmbauche);
    if (this.userForm.value.dateEmbauche == this.editData.dateEmbauche) {
      dateEmbauche.setDate(dateEmbauche.getDate());
    }
    if (this.userForm.value.dateEmbauche != this.editData.dateEmbauche) {
      dateEmbauche.setDate(dateEmbauche.getDate() + 1);
    }

    const dateNaissance = new Date(this.userForm.value.dateNaissance);
    if (this.userForm.value.dateNaissance == this.editData.dateNaissance) {
      dateNaissance.setDate(dateNaissance.getDate());
    }
    if (this.userForm.value.dateNaissance != this.editData.dateNaissance) {
      dateNaissance.setDate(dateNaissance.getDate() + 1);
    }

    if (this.userForm.valid) {

      this.service.GetUtilisateurs().subscribe((data: Utilisateur[]) => {
        const matricules = data.map((user: Utilisateur) => user.matricule);
      const emails = data.map((user: Utilisateur) => user.email);
      if (matricules.includes(this.userForm.value.matricule) && (this.userForm.value.matricule != this.editData.matricule)) {
        this.notificationService.danger('This matricule already exists!');
      } else if (emails.includes(this.userForm.value.email) && (this.userForm.value.email != this.editData.email)) {
        this.notificationService.danger('This email already exists!');
      } else {
          this.service.UpdateUtilisateur(this.editData.id, { ...this.userForm.value, dateEmbauche, dateNaissance, userModif }).subscribe(() => {
            this.userForm.reset();
            this.dialogRef.close('modifier');
            this.notificationService.success('User updated successfully!');
          }, () => {
            this.notificationService.danger('Error when updating a User.');
          });
      }},
     () => {
        this.notificationService.danger('Error when getting users from the database.');
      });
    }
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
      this.imageUrl = reader.result as string;
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