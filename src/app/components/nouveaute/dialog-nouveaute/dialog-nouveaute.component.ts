import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Nouveauté } from 'app/models/shared/nouveauté.model';
import { Site } from 'app/models/shared/site.model';
import { NotificationService } from 'app/services/shared';
import { ApiService } from 'app/services/shared/api.service';
import { NouveautéService } from 'app/services/shared/nouveauté.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  public siteFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();
  filteredSites: Site[];

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
      siteId : ['', Validators.required],
      pieceJointe : [''],
      userAjout: [''],
      datePublication: [''],
      
    });
    this.getSites();
    this.siteFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterSites();
    });
    console.log(this.editData)
    if(this.editData){
      this.ActionBtn = "Modifier";
      // this.departementForm.patchValue(this.editData);
      this.nouveauteForm.setValue({
        titre: this.editData.titre,
        description: this.editData.description,
        siteId: this.editData.siteId,
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

  filterSites() {
    let search = this.siteFilterCtrl.value;
    if (!search) {
      this.filteredSites = this.sites.slice();
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredSites = this.sites.filter(site => 
      site.site.toLowerCase().indexOf(search) > -1);
  }
  

  AjouterNouveaute(){
    if(!this.editData){
      this.nouveauteForm.value.pieceJointe = this.imageUrl;
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
