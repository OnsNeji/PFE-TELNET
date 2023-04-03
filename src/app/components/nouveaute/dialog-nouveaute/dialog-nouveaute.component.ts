import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Nouveauté } from 'app/models/shared/nouveauté.model';
import { Site } from 'app/models/shared/site.model';
import { NotificationService } from 'app/services/shared';
import { ApiService } from 'app/services/shared/api.service';
import { NouveautéService } from 'app/services/shared/nouveauté.service';

@Component({
  selector: 'app-dialog-nouveaute',
  templateUrl: './dialog-nouveaute.component.html',
  styleUrls: ['./dialog-nouveaute.component.scss']
})
export class DialogNouveauteComponent implements OnInit {

  
  nouveauteForm!: FormGroup;
  sites!: Site[];
  nouveautés!: Nouveauté[];
  nouveauté: Nouveauté = new Nouveauté();
  ActionBtn: string = "Ajouter";
  private jwtHelper = new JwtHelperService();
  public matricule: string = '';
  imageUrl: string;

  constructor(private builder: FormBuilder, 
              private service: ApiService, 
              private nouvService: NouveautéService,
              private dialogRef: MatDialogRef<DialogNouveauteComponent>, 
              @Inject(MAT_DIALOG_DATA) public editData: Nouveauté,
              private notificationService: NotificationService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.nouveauteForm = this.builder.group({
      // id : [''],
      titre : ['', Validators.required],
      description : ['', Validators.required],
      pieceJointe : [''],
      userAjout: [''],
      datePublication: [''],
    });
    this.getSites();
    console.log(this.editData)
    if(this.editData){
      this.ActionBtn = "Modifier";
      // this.departementForm.patchValue(this.editData);
      this.nouveauteForm.setValue({
        titre: this.editData.titre,
        description: this.editData.description,
        pieceJointe: this.editData.pieceJointe,
        userAjout : this.editData.userAjout,
        datePublication: this.editData.datePublication,
      });
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.matricule = decodedToken.family_name;
    }
  }

  AjouterNouveaute(){
    if(!this.editData){
      this.nouveauteForm.value.image = this.imageUrl;
      if(this.nouveauteForm.valid){
        this.nouveauteForm.value.userAjout = this.matricule;
        const userAjout = this.nouveauteForm.value.userAjout;
        const datePublication = new Date();
        this.nouvService.AddNouveauté({ ...this.nouveauteForm.value, userAjout, datePublication }).subscribe(()=>{
          this.nouveauteForm.reset();
          this.dialogRef.close('ajouter');
          this.notificationService.success('News added successfully !');
        },
        ()=>{
          this.notificationService.danger('Error when adding a News.');
        })
      }
    } else {
      this.updateNouveaute();
    }
  }

  updateNouveaute(){
    if (!this.imageUrl) {
      this.nouveauteForm.value.pieceJointe = this.editData.pieceJointe;
    } else {
      this.nouveauteForm.value.pieceJointe = this.imageUrl;
    }

    if (this.nouveauteForm.valid) {
    this.nouvService.UpdateNouveauté(this.editData.id, { ...this.nouveauteForm.value }).subscribe(()=>{
      this.nouveauteForm.reset();
      this.dialogRef.close('modifier');
      this.notificationService.success('News modified successfully !');
    },
    ()=>{
      this.notificationService.danger('Error when modifying a News.');
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
