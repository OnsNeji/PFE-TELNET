import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Evenement } from 'app/models/shared/evenement.model';
import { MediaEvent } from 'app/models/shared/mediaEvent.model';
import { NotificationService } from 'app/services/shared';
import { EvenementService } from 'app/services/shared/evenement.service';
import { MediaEventService } from 'app/services/shared/media-event.service';
import { DialogEventComponent } from '../../dialog-event/dialog-event.component';

@Component({
  selector: 'app-dialog-media',
  templateUrl: './dialog-media.component.html',
  styleUrls: ['./dialog-media.component.scss']
})
export class DialogMediaComponent implements OnInit {

  mediaEventForm!: FormGroup;
  mediaEvents!: MediaEvent[];
  evenements!: Evenement[];
  private jwtHelper = new JwtHelperService();
  public matricule: string = '';
  ActionBtn: string = "Ajouter";
  imageUrl: string;

  constructor(private builder: FormBuilder, 
    private service: MediaEventService, 
    private dialogRef: MatDialogRef<DialogEventComponent>, 
    @Inject(MAT_DIALOG_DATA) public editData: MediaEvent,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private eventService: EvenementService) {}

  ngOnInit(): void {
    this.mediaEventForm = this.builder.group({
      pieceJointe : [''],
      evenementId : ['', Validators.required],
    });
    this.getEvenements();

    if(this.editData){
      this.ActionBtn = "Modifier";
      // this.departementForm.patchValue(this.editData);
      this.mediaEventForm.patchValue(this.editData);
    }

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.matricule = decodedToken.family_name;
    }
  }

  getEvenements(): void {
    this.eventService.GetEvenements().subscribe(evenements => {
      this.evenements = evenements;
    });
  }

  AjouterMediaEvent(){
    if(!this.editData){
      this.mediaEventForm.value.pieceJointe = this.imageUrl;
      if(this.mediaEventForm.valid){
        this.service.AddMediaEvent({ ...this.mediaEventForm.value }).subscribe(()=>{
          this.mediaEventForm.reset();
          this.dialogRef.close('ajouter');
          this.notificationService.success('Media Event added successfully !');
        },
        ()=>{
          this.notificationService.danger('Error when adding a Media Event.');
        })
      }
    } else {
      this.updateMediaEvent();
    }
  }

  updateMediaEvent(){
    if (!this.imageUrl){
      this.mediaEventForm.value.pieceJointe = this.editData.pieceJointe;
    }else {
      this.mediaEventForm.value.pieceJointe = this.imageUrl;
    }
    this.service.UpdateMediaEvent(this.editData.id, { ...this.mediaEventForm.value }).subscribe(()=>{
      this.mediaEventForm.reset();
      this.dialogRef.close('modifier');
      this.notificationService.success('Media Event modified successfully !');
    },
    ()=>{
      this.notificationService.danger('Error when modifying a Media Event.');
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
