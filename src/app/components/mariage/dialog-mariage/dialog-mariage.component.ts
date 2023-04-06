import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Mariage } from 'app/models/shared/mariage.model';
import { Nouveauté } from 'app/models/shared/nouveauté.model';
import { Site } from 'app/models/shared/site.model';
import { NotificationService } from 'app/services/shared';
import { ApiService } from 'app/services/shared/api.service';
import { MariageService } from 'app/services/shared/mariage.service';

@Component({
  selector: 'app-dialog-mariage',
  templateUrl: './dialog-mariage.component.html',
  styleUrls: ['./dialog-mariage.component.scss']
})
export class DialogMariageComponent implements OnInit {

  
  mariageForm!: FormGroup;
  mariages: Mariage[];
  sites!: Site[];
  mariage: Nouveauté = new Mariage();
  nouveauté: Nouveauté = new Nouveauté();
  ActionBtn: string = "Ajouter";
  private jwtHelper = new JwtHelperService();
  public matricule: string = '';
  imageUrl: string;

  constructor(private builder: FormBuilder, 
              private service: ApiService, 
              private mariageService: MariageService,
              private dialogRef: MatDialogRef<DialogMariageComponent>, 
              @Inject(MAT_DIALOG_DATA) public editData: Mariage,
              private notificationService: NotificationService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.mariageForm = this.builder.group({
      // id : [''],
      titre : ['', Validators.required],
      description : ['', Validators.required],
      siteId : [],
      pieceJointe : [''],
      userAjout: [''],
      date: [''],
      datePublication: [''],
      
    });

    console.log(this.editData)
    if(this.editData){
      this.ActionBtn = "Modifier";
      // this.departementForm.patchValue(this.editData);
      this.mariageForm.setValue({
        titre: this.editData.titre,
        description: this.editData.description,
        pieceJointe: this.editData.pieceJointe,
        userAjout : this.editData.userAjout,
        date: this.editData.date,
        siteId: this.editData.siteId,
        datePublication: this.editData.datePublication,
        
      });
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.matricule = decodedToken.family_name;
    }
  }
  

  AjouterMariage(){
    if(!this.editData){
      this.mariageForm.value.pieceJointe = this.imageUrl;
      if(this.mariageForm.valid){
        this.mariageForm.value.userAjout = this.matricule;
        const userAjout = this.mariageForm.value.userAjout;
        const datePublication = new Date();
        this.mariageService.AddMariage({ ...this.mariageForm.value, userAjout, datePublication }).subscribe(()=>{
          this.mariageForm.reset();
          this.dialogRef.close('ajouter');
          this.notificationService.success('Mariage added successfully !');
        },
        ()=>{
          this.notificationService.danger('Error when adding a Mariage.');
        })
      }
    } else {
      this.updateMariage();
    }
  }

  updateMariage(){
    if (!this.imageUrl) {
      this.mariageForm.value.pieceJointe = this.editData.pieceJointe;
    } else {
      this.mariageForm.value.pieceJointe = this.imageUrl;
    }

    if (this.mariageForm.valid) {
    this.mariageService.UpdateMariage(this.editData.id, { ...this.mariageForm.value }).subscribe(()=>{
      this.mariageForm.reset();
      this.dialogRef.close('modifier');
      this.notificationService.success('Mariage modified successfully !');
    },
    ()=>{
      this.notificationService.danger('Error when modifying a Mariage.');
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


  close() {
    this.dialogRef.close();
  }

  cancel() {
    this.close();
  }


}
