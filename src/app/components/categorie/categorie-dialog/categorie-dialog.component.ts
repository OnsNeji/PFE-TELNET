import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Catégorie } from 'app/models/shared/catégorie.model';
import { NotificationService } from 'app/services/shared';
import { CategorieService } from 'app/services/shared/categorie.service';

@Component({
  selector: 'app-categorie-dialog',
  templateUrl: './categorie-dialog.component.html',
  styleUrls: ['./categorie-dialog.component.scss']
})
export class CategorieDialogComponent implements OnInit {

  
  categorieForm!: FormGroup;
  ListeCategorie!: Catégorie[];
  catégorie: Catégorie = new Catégorie();
  ActionBtn: string = "Ajouter";
  private jwtHelper = new JwtHelperService();
  
  constructor(private builder: FormBuilder, 
              private categorieService: CategorieService, 
              private dialogRef: MatDialogRef<CategorieDialogComponent>, 
              @Inject(MAT_DIALOG_DATA) public editData: Catégorie,
              private notificationService: NotificationService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.categorieForm = this.builder.group({
      // id : [''],
      nom : ['', Validators.required],
    });

    console.log(this.editData)
    if(this.editData){
      this.ActionBtn = "Modifier";
      // this.departementForm.patchValue(this.editData);
      this.categorieForm.setValue({
        nom: this.editData.nom,
      });
    }

  }

  AjouterCategorie(){
    if(!this.editData){
      if(this.categorieForm.valid){
        this.categorieService.AddCatégorie({ ...this.categorieForm.value }).subscribe(()=>{
          this.categorieForm.reset();
          this.dialogRef.close('ajouter');
          this.notificationService.success('Category added successfully !');
        },
        ()=>{
          this.notificationService.danger('Error when adding a Category.');
        })
      }
    } else {
      this.updateCategorie();
    }
  }

  updateCategorie(){
    if (this.categorieForm.valid) {
    this.categorieService.UpdateCatégorie(this.editData.id, { ...this.categorieForm.value }).subscribe(()=>{
      this.categorieForm.reset();
      this.dialogRef.close('modifier');
      this.notificationService.success('Category modified successfully !');
    },
    ()=>{
      this.notificationService.danger('Error when modifying a Category.');
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
