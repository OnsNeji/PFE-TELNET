import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Departement } from 'app/models/shared/departement.model';
import { Site } from 'app/models/shared/site.model';
import { ApiService } from 'app/services/shared/api.service';
import { NotificationService } from 'app/services/shared/notification.service';

@Component({
  selector: 'app-dialog-departement',
  templateUrl: './dialog-departement.component.html',
  styleUrls: ['./dialog-departement.component.scss']
})
export class DialogDepartementComponent implements OnInit {

  
  departementForm!: FormGroup;
  sites!: Site[];
  ListeDepartement!: Departement[];
  departement: Departement = new Departement();
  ActionBtn: string = "Ajouter";
  private jwtHelper = new JwtHelperService();
  public matricule: string = '';
  dateAjout = new Date();
  dateModif = new Date();
  datePipe = new DatePipe('en-US');
  ajoutDate = this.datePipe.transform(this.dateAjout, 'yyyy-MM-ddTHH:mm:ss');
  modifDate = this.datePipe.transform(this.dateModif, 'yyyy-MM-ddTHH:mm:ss');
  
  constructor(private builder: FormBuilder, 
              private service: ApiService, 
              private dialogRef: MatDialogRef<DialogDepartementComponent>, 
              @Inject(MAT_DIALOG_DATA) public editData: Departement,
              private notificationService: NotificationService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.departementForm = this.builder.group({
      // id : [''],
      Nom : ['', Validators.required],
      ChefD : ['', Validators.required],
      SiteId : ['', Validators.required],
    });
    this.getSites();

    console.log(this.editData)
    if(this.editData){
      this.ActionBtn = "Modifier";
      // this.departementForm.patchValue(this.editData);
      this.departementForm.setValue({
        Nom: this.editData.nom,
        ChefD: this.editData.chefD,
        SiteId: this.editData.siteId,
      });
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.matricule = decodedToken.family_name;
    }
  }

  AjouterDep(){
    if(!this.editData){
      this.departementForm.value.dateAjout = this.ajoutDate;
      if(this.departementForm.valid){
        this.departementForm.value.userAjout = this.matricule;
        this.service.AddDepartement(this.departementForm.value).subscribe(()=>{
          this.departementForm.reset();
          this.dialogRef.close('ajouter');
          this.notificationService.success('Department added successfully !');
        },
        ()=>{
          this.notificationService.danger('Error when adding a Department.');
        })
      }
    } else {
      this.updateDepartement();
    }
  }

  updateDepartement(){
    this.departementForm.value.dateModif = this.modifDate;
    this.departementForm.value.userModif = this.matricule;
    this.service.UpdateDepartement(this.editData.id, this.departementForm.value).subscribe(()=>{
      this.departementForm.reset();
      this.dialogRef.close('modifier');
      this.notificationService.success('Department modified successfully !');
    },
    ()=>{
      this.notificationService.danger('Error when modifying a Department.');
    });
  }
  getSites(): void {
    this.service.GetSites().subscribe(sites => {
      this.sites = sites;
    });
  }

  close() {
    this.dialogRef.close();
  }

  cancel() {
    this.close();
  }

}
