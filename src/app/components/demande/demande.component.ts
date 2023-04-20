import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Demande } from 'app/models/shared/demande.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { DateTimeService, NotificationService, AuthenticationService, ExcelService } from 'app/services/shared';
import { ApiService } from 'app/services/shared/api.service';
import { DemandeService } from 'app/services/shared/demande.service';
import { UserStoreService } from 'app/services/shared/user-store.service';
import { DialogDemandeComponent } from './dialog-demande/dialog-demande.component';
import swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { DialogDescDemandeComponent } from './dialog-desc-demande/dialog-desc-demande.component';

@Component({
  selector: 'app-demande',
  templateUrl: './demande.component.html',
  styleUrls: ['./demande.component.scss']
})
export class DemandeComponent implements OnInit {

  constructor(private service: DemandeService, 
    private utilisateurService: ApiService, 
    private route: ActivatedRoute, 
    private router: Router, 
    public dialog: MatDialog,
    private dateTimeService: DateTimeService, 
    private notificationService: NotificationService,
    private userStore: UserStoreService,
    private authenticationService: AuthenticationService,
    injector: Injector){
      this.excelService = injector.get<ExcelService>(ExcelService);
    }

demandes!: Demande[];
demande: Demande = new Demande();
utilisateur: Utilisateur[];
utilisateurs!: Utilisateur[];
formTitle: string = '';
buttonLabel: string = '';
lengthDemandes: number;
isLoading: boolean;
displayedColumns: string[] = ['titre', 'description', 'date', 'utilisateurId', 'status', 'document', 'action'];
dataSource!: MatTableDataSource<Demande>;
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
role!: string;
selectedUser: Utilisateur;
public userFilterCtrl: FormControl = new FormControl();
private _onDestroy = new Subject<void>();
mesDemandes!: Demande[];
  utilisateurId: number;
id: number;
excelService: ExcelService;

ngOnInit() : void{
  this.route.params.subscribe(params => {
    if (params.id) {
      this.id = params.id;
      this.getDemandesByUtilisateur(this.id);
      const columnsToRemove = ['utilisateurId'];
      for (const col of columnsToRemove) {
        const colIndex = this.displayedColumns.indexOf(col);
        if (colIndex !== -1) {
          this.displayedColumns.splice(colIndex, 1);
        }
      }
    } else {
      this.getDemandes();
    }
  });
  // this.getDemandes();
  // this.getDemandesByUtilisateur();
  this.getUtilisateurs();
  this.onResetAllFilters();

  this.userFilterCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filterUsers();
  });
  
}

getDemandesByUtilisateur(id: number): void {
  this.service.GetDemandesByUtilisateur(id).subscribe((data: Demande[]) => {
    this.dataSource.data = data;
});
}

filterUsers() {
  let search = this.userFilterCtrl.value;
  if (!search) {
    this.utilisateurs = this.utilisateurs.slice();
    return;
  } else {
    search = search.toLowerCase();
  }
  this.utilisateurs = this.utilisateurs.filter(user => 
    user.nom.toLowerCase().indexOf(search) > -1 || user.prenom.toLowerCase().indexOf(search) > -1);
}

getDemandes() {
  if (this.id) {
      this.service.GetDemandesByUtilisateur(this.id).subscribe((data: Demande[]) => {
          this.demandes = data;
          this.dataSource = new MatTableDataSource<Demande>(this.demandes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });
  } else {
      this.service.GetDemandes().subscribe((data: Demande[]) => {
          this.demandes = data;
          this.dataSource = new MatTableDataSource<Demande>(this.demandes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });
  }
}


openDialog() {
  const dialogRef = this.dialog.open(DialogDemandeComponent, {
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result === "ajouter"){
      this.getDemandes();
    }
  });
}

deleteDemande(id: number): void {
  swal.fire({
    text: `Are you sure to delete this request ?`,
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    showLoaderOnConfirm: true,
    preConfirm: () => {
      this.service.DeleteDemande(id)
        .subscribe(()=>
          {
            this.getDemandes();
            this.notificationService.success('Request deleted successfully');
            setTimeout(() => {
              window.location.reload();
            }, 500);
          },
          () => {
            this.notificationService.danger('Delete request failed');
          }
        );
    }
  });
}

rejectDemande(id: number) : void{
  swal.fire({
    text: `Are you sure to reject this request ?`,
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, reject it!',
    cancelButtonText: 'No',
    showLoaderOnConfirm: true,
    preConfirm: () => {
      this.service.RejectDemande(id)
        .subscribe(
          data => {
            if (data !== 0) {
              this.notificationService.success('This request is rejected');
              setTimeout(() => {
                window.location.reload();
              }, 500);
            } else {
              this.notificationService.danger('Reject request failed');
            }
          },
          () => {
            this.notificationService.danger('Reject request failed');
          }
        );
    }
  });
}

downloadPDF(pieceJointe: string, fileName: string) {
  const byteCharacters = atob(pieceJointe.substring(28));
  const byteNumbers = new Array(byteCharacters.length);
  for (let i=0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray =  new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {type: 'application/pdf'});
  FileSaver.saveAs(blob, fileName);
}

getShortFormatWithDay(date: Date): string {
  if (this.dateTimeService.isNullDate(date)) {
    return '';
  } else {
    const d = moment(date).locale('ang');
    return d.format('ddd') + ' ' + d.format('L');
  }
}

exportToExcel() {
  if (this.demandes !== undefined && this.demandes.length !== 0) {
    const header: any[] = [
      { header: 'Titre', key: 'titre', width: 10 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Utilisateur', key: 'utilisateurId', width: 10 },
      { header: 'Document', key: 'document', width: 15 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    const rows = [];
    const merges: string[] = [];
    const styles = [];

    styles.push(
      { cell: 'A1', font: { bold: true } },
      { cell: 'B1', font: { bold: true } },
      { cell: 'C1', font: { bold: true } },
      { cell: 'D1', font: { bold: true } },
      { cell: 'E1', font: { bold: true } },
      { cell: 'F1', font: { bold: true } },
    );

    this.demandes.forEach(demande => {
      const row = [];
      row.push(demande.titre);
      row.push(demande.description);
      row.push(this.getShortFormatWithDay(demande.date));
      row.push(this.getUserNom(demande.utilisateurId));
      row.push(demande.document);
      row.push(demande.status);
      rows.push(row);
    });

    this.excelService.generateExcel(header, rows, merges, styles, 'Demandes des documents');
  }
}

openDescriptionDialog(demande: any): void {
  const dialogRef = this.dialog.open(DialogDescDemandeComponent, {
    width: '500px',
    data: { description: demande.description },
  });
}

updateDemande(row: any) {
  this.dialog.open(DialogDemandeComponent, {
    data: row,
  }).afterClosed().subscribe(result=>{
    if(result === "modifier"){
      this.getDemandes();
    }
  })
  }

getUtilisateurs(): void {
  this.utilisateurService.GetUtilisateurs().subscribe(utilisateurs => {
    this.utilisateurs = utilisateurs;
  });
}

getUserNom(id: number): string {
  const user = this.utilisateurs.find(s => s.id === id);
  return user ? (user.nom + ' ' + user.prenom) : '';
}

onSortData(sort) {
  this.service.demandeRequest.next(sort);
}


dateOnly(event): boolean {
  return this.dateTimeService.dateOnly(event);
}

onClickingEnter(event) {
  if (event.key === 'Enter') {
    this.onSearchClick();
  }
}

onSearchClick() {
  const filterTitre = document.getElementById('titre') as HTMLInputElement;
  const filterStatus = document.getElementById('status') as HTMLInputElement;
  const filterDate = document.getElementById('date') as HTMLInputElement;

  const filterTitreValue = filterTitre.value.trim().toLowerCase();
  const filterStatusValue = filterStatus.value.trim().toLowerCase();
  const filterDateValue = filterDate.value.trim().toLowerCase();
  const filterUserValue = this.selectedUser ? (this.selectedUser.nom + ' ' + this.selectedUser.prenom).toLowerCase() : '';

  if (filterTitreValue !== '') {
    this.dataSource.filterPredicate = (data: Demande, filter: string) =>
      data.titre.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterTitreValue;
  }else if (filterUserValue !== '') {
    this.dataSource.filterPredicate = (data: Demande, filter: string) =>
      this.getUserNom(data.utilisateurId).toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterUserValue;
  }else if (filterStatusValue !== '') {
    this.dataSource.filterPredicate = (data: Demande, filter: string) =>
      data.status.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterStatusValue;
  }else if (filterDateValue !== '') {
      this.dataSource.filterPredicate = (data: Demande, filter: string) => {
        const formattedDate = new Date(data.date).toLocaleDateString(); // format the date as a string
        return formattedDate.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      };
    this.dataSource.filter = filterDateValue;
    }
}

onResetAllFilters() {
  this.demande.titre = '';
  this.demande.date= null;
  this.selectedUser = null;
  this.demande.status = '';
  this.getDemandes();
  this.onSearchClick(); // lancement d'une nouvelle recherche
}
}
