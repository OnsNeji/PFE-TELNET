import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Identifier } from 'app/models/shared';
import { EmployéMois } from 'app/models/shared/employeMois.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { NotificationService } from 'app/services/shared';
import { EmployeMoisService } from 'app/services/shared/employe-mois.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-employe-mois',
  templateUrl: './dialog-employe-mois.component.html',
  styleUrls: ['./dialog-employe-mois.component.scss']
})
export class DialogEmployeMoisComponent implements OnInit {

  EmployeeForm!: FormGroup;
  utilisateurs!: Utilisateur[];
  listeEmployes!: EmployéMois[];
  employe: EmployéMois = new EmployéMois();
  private jwtHelper = new JwtHelperService();
  public matricule: string = '';
  ActionBtn: string = "Ajouter";
  imageUrl: string;
  public userFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();
  filteredUsers: Utilisateur[];

  constructor(private builder: FormBuilder, 
    private service: EmployeMoisService, 
    private dialogRef: MatDialogRef<DialogEmployeMoisComponent>, 
    @Inject(MAT_DIALOG_DATA) public editData: EmployéMois,
    private notificationService: NotificationService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.EmployeeForm = this.builder.group({
      date : ['', [Validators.required, this.validDate]],
      description : ['', Validators.required],
      utilisateurId : ['', Validators.required],
      image: [''],
      userAjout: [''],
    });

    this.getUsers();
    this.userFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterUsers();
    });

    if(this.editData){
      this.ActionBtn = "Modifier";
      // this.departementForm.patchValue(this.editData);
      this.EmployeeForm.setValue({
        date: this.editData.date,
        description: this.editData.description,
        utilisateurId: this.editData.utilisateurId,
        image: this.editData.image,
        userAjout : this.editData.userAjout
      });

     
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.matricule = decodedToken.family_name;
    }
  }

  validDate(control) {
    let minDate = new Date(1900, 0, 1);
    let maxDate = new Date();
    let value = new Date(control.value);
    if (value < minDate || value > maxDate) {
      return { invalidDate: true };
    }
    return null;
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
  
  AjouterEmploye() {
    if (!this.editData) {
      this.EmployeeForm.value.image = this.imageUrl;
      if (this.EmployeeForm.valid) {
        this.EmployeeForm.value.userAjout = this.matricule;
        const userAjout = this.EmployeeForm.value.userAjout;
        const date = new Date(this.EmployeeForm.value.date);
        date.setDate(date.getDate() + 1);
        this.service.AddEmployeMois({ ...this.EmployeeForm.value, date, userAjout }).subscribe(() => {
          this.EmployeeForm.reset();
          this.dialogRef.close('ajouter');
          this.notificationService.success('Employee added successfully !');
        },
          () => {
            this.notificationService.danger('Error when adding an Employee.');
          })
      }
    } else {
      this.updateEmploye();
    }
  }

  updateEmploye() {
    if (!this.imageUrl) {
      this.EmployeeForm.value.image = this.editData.image;
    } else {
      this.EmployeeForm.value.image = this.imageUrl;
    }
    const date = new Date(this.EmployeeForm.value.date);
    if (this.EmployeeForm.value.date == this.editData.date) {
      date.setDate(date.getDate());
    }
    if (this.EmployeeForm.value.date != this.editData.date) {
      date.setDate(date.getDate() + 1);
    }
    if (this.EmployeeForm.valid) {
    this.service.UpdateEmployeMois(this.editData.id, { ...this.EmployeeForm.value, date }).subscribe(() => {
      this.EmployeeForm.reset();
      this.dialogRef.close('modifier');
      this.notificationService.success('Employee modified successfully !');
    },
      () => {
        this.notificationService.danger('Error when modifying an Employee.');
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

  }

  getUsers(): void {
    this.service.GetUtilisateurs().subscribe(utilisateurs => {
      this.utilisateurs = utilisateurs;
      this.filteredUsers = utilisateurs;
    });
  }

  close() {
    this.dialogRef.close();
  }

  cancel() {
    this.close();
  }

}
