import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Demande } from 'app/models/shared/demande.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { NotificationService } from 'app/services/shared';
import { ApiService } from 'app/services/shared/api.service';
import { DemandeService } from 'app/services/shared/demande.service';
import { Subject } from 'rxjs';
import * as _moment from 'moment';
import * as moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS } from 'app/shared/select-month/select-month.component';

@Component({
  selector: 'app-dialog-demande',
  templateUrl: './dialog-demande.component.html',
  styleUrls: ['./dialog-demande.component.scss'],  
  
})
export class DialogDemandeComponent implements OnInit {

  @ViewChild('etudiantCheckbox') etudiantCheckbox: MatCheckbox;
  @ViewChild('etudiant2') etudiant2: ElementRef | undefined;
  etudiant2Checked: boolean = false;
  demandeForm!: FormGroup;
  utilisateurs!: Utilisateur[];
  demandes!: Demande[];
  demande: Demande = new Demande();
  ActionBtn: string = "Ajouter";
  private jwtHelper = new JwtHelperService();
  public id: number;
  public userFilterCtrl: FormControl = new FormControl();
  filteredUsers: Utilisateur[];
  pdfUrlJ: string; 
  pdfUrlD: string; 
  afficherMoisFiche: boolean;
  afficherDestinataire: boolean;
  afficherDateSortie: boolean;
  afficherHeureSortie: boolean;
  afficherTypeAttest: boolean;
  afficherEtud1 : boolean;
  afficherEtud2 : boolean;
  afficherFac : boolean;
  afficherSujet : boolean;
  afficherDebutS : boolean;
  afficherFinS : boolean;
  afficherCheckbox: boolean = false;
  dateSysteme: Date = new Date();
  afficherTypeSalaire : boolean;
  startDate: Date = new Date();
  @Output() daysChange = new EventEmitter<any[]>();
  mois = new FormControl(moment());

  constructor(private builder: FormBuilder, 
    private service: ApiService, 
    private demandeService: DemandeService,
    private dialogRef: MatDialogRef<DialogDemandeComponent>, 
    @Inject(MAT_DIALOG_DATA) public editData: Demande,
    private notificationService: NotificationService,
    private route: ActivatedRoute) {}

    ngOnInit(): void {
      this.demandeForm = this.builder.group({
        titre : ['', Validators.required],
        description : [''],
        priorite : ['', Validators.required],
        utilisateurId : [''],
        document : [''],
        status: [''],
        date: [''],
        mois: [''],
        destinataire: [''],
        dateSortie:[''],
        heureSortie:['', [Validators.pattern('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')]],
        adminId : [''],
        type:[''],   
        etudiant1: [''], 
        etudiant2: [''],  
        sujet: [''], 
        fac: [''], 
        debutS: [''], 
        finS: [''], 
        choix: [''],    
      });
      this.getUtilisateurs();

      if(this.editData ){
        this.ActionBtn = "Modifier";
        this.demandeForm.patchValue(this.editData);
      }
  
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = this.jwtHelper.decodeToken(token);
        this.id = decodedToken.nameid;
      }
    }
    toggleEtudiant() {
      const etudiant2Element = this.etudiant2.nativeElement;
      if (this.etudiantCheckbox.checked) {
        etudiant2Element.style.display = 'block'; // Afficher le textarea
        this.etudiant2Checked = true;
      } else {
        etudiant2Element.style.display = 'none'; // Masquer le textarea
        this.etudiant2Checked = false;
      }
    }
  
    toggleCheckbox() {
      this.afficherCheckbox = true;
    }

    chosenYearHandler(normalizedYear: _moment.Moment) {
        this.mois.setValue(normalizedYear);
        this.daysChange.emit(this.mois.value);
    
    }
    chosenMonthHandler(normalizedMonth: _moment.Moment, datepicker: MatDatepicker<_moment.Moment>) {
        this.mois.setValue(normalizedMonth);
        this.daysChange.emit(this.mois.value);
      if (datepicker) {
        datepicker.close();
      }
    }
  
    AjouterDemande(){
      if(!this.editData){
        
        this.demandeForm.value.document = this.pdfUrlJ;
        this.demandeForm.value.document = this.pdfUrlD;
        console.log(this.demandeForm.value)
        if(this.demandeForm.valid){
          let mois = this.mois.value;
          mois = mois.startOf('month').toDate();
          mois.setDate(mois.getDate() + 1);
         
          const dateSortie = new Date(this.demandeForm.value.dateSortie);
          dateSortie.setDate(dateSortie.getDate() + 1);

          const debutS = new Date(this.demandeForm.value.debutS);
          debutS.setDate(debutS.getDate() + 1);

          const finS = new Date(this.demandeForm.value.finS);
          finS.setDate(finS.getDate() + 1);
          
          this.demandeForm.value.utilisateurId = this.id;
          const utilisateurId = parseInt(this.demandeForm.value.utilisateurId);

          const date= new Date();
          this.demandeService.AddDemande({ ...this.demandeForm.value, utilisateurId, date, mois, dateSortie, debutS, finS }).subscribe(()=>{
            this.demandeForm.reset();
            this.dialogRef.close('ajouter');
            this.notificationService.success('Request added successfully !');
  
          },
          ()=>{
            this.notificationService.danger('Error when adding a request.');
          })
        }
      } 
    }

    onTitreChange(event: any) {
      const titre = event.value;
      this.afficherMoisFiche = titre === 'Fiche de paie';
      this.afficherDestinataire = titre === 'Lettre de recommandation';
      this.afficherDateSortie = titre === 'Autorisation de sortie';
      this.afficherHeureSortie = titre === 'Autorisation de sortie';
      this.afficherTypeAttest = titre === "Attestation de travail";
      this.afficherEtud1 = titre === "Attestation de stage";
      this.afficherEtud2 = titre === "Attestation de stage";
      this.afficherFac = titre === "Attestation de stage";
      this.afficherSujet = titre === "Attestation de stage";
      this.afficherDebutS = titre === "Attestation de stage";
      this.afficherFinS = titre === "Attestation de stage";
      this.afficherTypeSalaire = titre === "Attestation de salaire";
    }
    
  onPDFJSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.pdfUrlJ = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onPDFDSelected(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.pdfUrlD = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  getUtilisateurs(): void {
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