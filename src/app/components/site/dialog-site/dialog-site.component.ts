import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HalfDay } from 'app/models/human-resources/work-from-home';
import { Identifier } from 'app/models/shared';
import { Site } from 'app/models/shared/site.model';
import { ApiService } from 'app/services/shared/api.service';
import { NotificationService } from 'app/services/shared/notification.service';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-dialog-site',
  templateUrl: './dialog-site.component.html',
  styleUrls: ['./dialog-site.component.scss']
})
export class DialogSiteComponent implements OnInit {

  
  siteForm!: FormGroup;
  sites!: Site[];
  ListeSite!: Site[];
  site: Site = new Site();
  modelTitel: string;
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
              private dialogRef: MatDialogRef<DialogSiteComponent>, 
              @Inject(MAT_DIALOG_DATA) public editData: Site,
              private notificationService: NotificationService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.siteForm = this.builder.group({
      // id : [''],
      site : ['', Validators.required],
      adresse : ['', Validators.required],
      tel : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern("^[+0-9]*$")]],
      fax : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern("^[+0-9]*$")]],
      userAjout: [''],
    })

    if (this.editData) {
      this.ActionBtn = "Modifier";
      this.siteForm.patchValue(this.editData);
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.matricule = decodedToken.family_name;
    }
  }
  AjouterSite(){
    if(!this.editData){
      this.siteForm.value.dateAjout = this.ajoutDate;
      if(this.siteForm.valid){
        this.siteForm.value.userAjout = this.matricule;
        const userAjout = this.siteForm.value.userAjout;
        this.service.AddSite({ ...this.siteForm.value, userAjout }).subscribe(()=>{
          this.siteForm.reset();
          this.dialogRef.close('ajouter');
          this.notificationService.success('Site added successfully !');
        },
        ()=>{
          this.notificationService.danger('Error when adding a site.');
        })
      }
    } else {
      this.updateSite();
    }
  }

  close() {
    this.dialogRef.close();
  }

  cancel() {
    this.close();
  }

  updateSite(){
    console.log(this.siteForm.value);
    this.siteForm.value.dateModif = this.modifDate;
    this.siteForm.value.userModif = this.matricule;
    const userModif = this.siteForm.value.userModif;
    if (this.siteForm.valid) {
    this.service.UpdateSite(this.editData.id, { ...this.siteForm.value, userModif }).subscribe(site=>{
      this.siteForm.reset();
      this.dialogRef.close('modifier');
      this.notificationService.success('Site modified successfully !');
    },
    ()=>{
      this.notificationService.danger('Error when modifying a site.');
    });
  }
  }

}
