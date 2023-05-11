import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Convention } from 'app/models/shared/convention.model';
import { NotificationService } from 'app/services/shared';
import { ConventionService } from 'app/services/shared/convention.service';

@Component({
  selector: 'app-dialog-convention',
  templateUrl: './dialog-convention.component.html',
  styleUrls: ['./dialog-convention.component.scss']
})
export class DialogConventionComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  conventionForm!: FormGroup;
  ListeConventions!: Convention[];
  convention: Convention = new Convention();
  ActionBtn: string = "Ajouter";
  private jwtHelper = new JwtHelperService();
  public matricule: string = '';
  hide = true;
  userAjout!: string;
  imageUrl: string;
  pdfUrl: string; 

  constructor(private builder: FormBuilder, 
              private service: ConventionService, 
              private dialogRef: MatDialogRef<DialogConventionComponent>, 
              @Inject(MAT_DIALOG_DATA) public editData: Convention,
              private notificationService: NotificationService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.conventionForm = this.builder.group({
      // id: [''],
      titre: ['', Validators.required],
      dateDebut: ['', [Validators.required, this.validDate]],
      dateFin: ['', [Validators.required]],
      description: ['', Validators.required],
      pieceJointe: [''],
      logo: [''],
      userAjout: [''],
      status: [''],
    });

    console.log(this.editData)
    if(this.editData){
      this.ActionBtn = "Modifier";
      this.conventionForm.patchValue(this.editData);
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
  
  
  AjouterConvention() {
    if (!this.editData) {

      this.conventionForm.value.pieceJointe = this.pdfUrl;
      this.conventionForm.value.logo = this.imageUrl;
      if (this.conventionForm.valid) {
        this.conventionForm.value.userAjout = this.matricule;
        const userAjout = this.conventionForm.value.userAjout;
        const dateDebut = new Date(this.conventionForm.value.dateDebut);
        dateDebut.setDate(dateDebut.getDate() + 1);
        const dateFin = new Date(this.conventionForm.value.dateFin);
        dateFin.setDate(dateFin.getDate() + 1);
        this.service.AddConvention({ ...this.conventionForm.value, dateDebut, dateFin, userAjout }).subscribe(() => {
          this.conventionForm.reset();
          this.dialogRef.close('ajouter');
          this.notificationService.success('Agreement added successfully!');
          setTimeout(() => {
            window.location.reload();
          }, 500);
          
        }, () => {
          this.notificationService.danger('Error when adding a Agreement.');
        });
      }
    } else { // sinon, mettre à jour l'utilisateur existant
      this.updateConvention();
    }
  }


  updateConvention() {
    if (!this.pdfUrl) {
      this.conventionForm.value.pieceJointe = this.editData.pieceJointe;
    } else {
      this.conventionForm.value.pieceJointe = this.pdfUrl;
    }

    if (!this.imageUrl) {
      this.conventionForm.value.logo = this.editData.logo;
    } else {
      this.conventionForm.value.logo = this.imageUrl;
    }
    const dateDebut = new Date(this.conventionForm.value.dateDebut);
    if (this.conventionForm.value.dateDebut == this.editData.dateDebut) {
      dateDebut.setDate(dateDebut.getDate());
    }
    if (this.conventionForm.value.dateDebut != this.editData.dateDebut) {
      dateDebut.setDate(dateDebut.getDate() + 1);
    }
    const dateFin = new Date(this.conventionForm.value.dateFin);
    if (this.conventionForm.value.dateFin == this.editData.dateFin) {
      dateFin.setDate(dateFin.getDate());
    }
    if (this.conventionForm.value.dateFin != this.editData.dateFin) {
      dateFin.setDate(dateFin.getDate() + 1);
    }
    this.service.UpdateConvention(this.editData.id, { ...this.conventionForm.value, dateDebut, dateFin }).subscribe(() => {

      this.conventionForm.reset();
      this.dialogRef.close('modifier');
      this.notificationService.success('Agreement updated successfully!');
    }, () => {
      this.notificationService.danger('Error when updating a Agreement.');
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

  onPDFSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.pdfUrl = reader.result as string;
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
