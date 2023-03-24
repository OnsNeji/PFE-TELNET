import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EmployéMois } from 'app/models/shared/employeMois.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { NotificationService } from 'app/services/shared';
import { EmployeMoisService } from 'app/services/shared/employe-mois.service';

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

  constructor(private builder: FormBuilder, 
    private service: EmployeMoisService, 
    private dialogRef: MatDialogRef<DialogEmployeMoisComponent>, 
    @Inject(MAT_DIALOG_DATA) public editData: EmployéMois,
    private notificationService: NotificationService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.EmployeeForm = this.builder.group({
      date : ['', Validators.required],
      description : ['', Validators.required],
      utilisateurId : ['', Validators.required],
      userAjout: [''],
    });

    this.getUsers();

    if(this.editData){
      this.ActionBtn = "Modifier";
      // this.departementForm.patchValue(this.editData);
      this.EmployeeForm.setValue({
        date: this.editData.date,
        description: this.editData.description,
        utilisateurId: this.editData.utilisateurId,
        userAjout : this.editData.userAjout
      });
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.matricule = decodedToken.family_name;
    }
  }

  AjouterEmploye(){
    if(!this.editData){
      if(this.EmployeeForm.valid){
        this.EmployeeForm.value.userAjout = this.matricule;
        const userAjout = this.EmployeeForm.value.userAjout;
        this.service.AddEmployeMois({ ...this.EmployeeForm.value, userAjout }).subscribe(()=>{
          this.EmployeeForm.reset();
          this.dialogRef.close('ajouter');
          this.notificationService.success('Employee added successfully !');
        },
        ()=>{
          this.notificationService.danger('Error when adding an Employee.');
        })
      }
    } else {
      this.updateEmploye();
    }
  }

  updateEmploye(){
    this.service.UpdateEmployeMois(this.editData.id, { ...this.EmployeeForm.value }).subscribe(()=>{
      this.EmployeeForm.reset();
      this.dialogRef.close('modifier');
      this.notificationService.success('Employee modified successfully !');
    },
    ()=>{
      this.notificationService.danger('Error when modifying an Employee.');
    });
  }

  getUsers(): void {
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
