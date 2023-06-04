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
import { DemandeCardComponent } from './demande-card/demande-card.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ReopenDemandeComponent } from './reopen-demande/reopen-demande.component';
import { HistoriqueComponent } from './historique/historique.component';

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
displayedColumns: string[] = ['titre', 'utilisateurId', 'adminId', 'date', 'priorite', 'status', 'document', 'action'];
dataSource!: MatTableDataSource<Demande>;
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
role!: string;
selectedUser: Utilisateur;
public userFilterCtrl: FormControl = new FormControl();
private _onDestroy = new Subject<void>();
mesDemandes!: Demande[];
utilisateurId: number;
adminId: number;
private jwtHelper = new JwtHelperService();
id: number;
excelService: ExcelService;
reouvert: boolean;

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
          this.demandes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          this.dataSource = new MatTableDataSource<Demande>(this.demandes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

      });
  } else {
      this.service.GetDemandesAdmin().subscribe((data: Demande[]) => {
          this.demandes = data;
          this.demandes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          this.dataSource = new MatTableDataSource<Demande>(this.demandes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

      });
  }
}


openDialog() {
  const dialogRef = this.dialog.open(DialogDemandeComponent, {
    width: '1000px',
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
          },
          () => {
            this.notificationService.danger('Delete request failed');
          }
        );
    }
  });
}

EmettreDemande(id: number): void {
  this.service.CreateDemande(id).subscribe(() =>{
    this.notificationService.success('Request added successfully !');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  },
  ()=>{
    this.notificationService.danger('Error when making a request.');
  });
}

PrisEnCharge(id: number): void {
  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    const adminId = decodedToken.nameid;
    console.log('adminId:', adminId);
    this.service.PrisEnCharge(id, adminId).subscribe(() => {
      this.notificationService.success('Request taken in charge !');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
      () => {
        this.notificationService.danger('Error when taking a request.');
      });
  }
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

CloturerDemande(id: number): void {
  this.service.CloturerDemande(id).subscribe(() =>{
    this.notificationService.success('request closed successfully !');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  },
  ()=>{
    this.notificationService.danger('Error when closing a request.');
  });
}

ApprouverDemande(id: number) {
      this.service.ApprouverDemande(id).subscribe(()=>{
        this.notificationService.success('Request approuved successfully !');
        setTimeout(() => {
          window.location.reload();
        },);
      },
      ()=>{
        setTimeout(() => {
          window.location.reload();
        },);
      });
    
}

ReouvrirDemande(row: any) {
  this.dialog.open(ReopenDemandeComponent, {
    data: row,
   
  }).afterClosed().subscribe(result=>{
    if(result === "Réouvrir"){
      this.getDemandes();
    }
  })
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
      { header: 'Titre', key: 'titre', width: 25 },
      { header: 'Date', key: 'date', width: 25 },
      { header: 'Priorite', key: 'priorite', width: 25 },
      { header: 'Utilisateur', key: 'utilisateurId', width: 25 },
      { header: 'Pris par', key: 'adminId', width: 25 },
      { header: 'Document', key: 'document', width: 25 },
      { header: 'Status', key: 'status', width: 25 }
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
      { cell: 'G1', font: { bold: true } },
    );

    this.demandes.forEach(demande => {
      const row = [];
      row.push(demande.titre);
      row.push(this.getShortFormatWithDay(demande.date));
      row.push(demande.priorite);
      row.push(this.getUserNom(demande.utilisateurId));
      row.push(this.getUserNom(demande.adminId));
      if (demande.document !== null) 
      {
        row.push(demande.titre + '.pdf');
      }else 
      {
        row.push('');
      }
      row.push(demande.status);
      rows.push(row);
    });

    this.excelService.generateExcel(header, rows, merges, styles, 'Demandes des documents');
  }
}


// approuverDemande(row: any) {
//   this.dialog.open(DialogDemandeComponent, {
//     data: row,
//   }).afterClosed().subscribe(result=>{
//     if(result === "modifier"){
//       this.getDemandes();
//     }
//   })
//   }

  getDemande(id: number) {
    this.service.GetDemande(id).subscribe(
      (data) => {
        const dialogRef = this.dialog.open(DemandeCardComponent, {
          data: data,
        });
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
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


HistoriqueDialog(id: number) {
  this.service.GetDemande(id).subscribe(
    (data) => {
      const dialogRef = this.dialog.open(HistoriqueComponent, {
        data: data,
      });
      console.log(data);
    },
    (error) => {
      console.log(error);
    }
  );
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
  const filterPriorite = document.getElementById('priorite') as HTMLInputElement;
  const filterDate = document.getElementById('date') as HTMLInputElement;

  const filterTitreValue = filterTitre.value.trim().toLowerCase();
  const filterStatusValue = filterStatus.value.trim().toLowerCase();
  const filterPrioriteValue = filterPriorite.value.trim().toLowerCase();
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
  }else if (filterPrioriteValue !== '') {
    this.dataSource.filterPredicate = (data: Demande, filter: string) =>
      data.priorite.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterPrioriteValue;
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
