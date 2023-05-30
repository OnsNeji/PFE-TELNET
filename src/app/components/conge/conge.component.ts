import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Congé } from 'app/models/shared/congé.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { DateTimeService, NotificationService, AuthenticationService, ExcelService } from 'app/services/shared';
import { ApiService } from 'app/services/shared/api.service';
import { CongéService } from 'app/services/shared/congé.service';
import { UserStoreService } from 'app/services/shared/user-store.service';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import swal from 'sweetalert2';
import { DialogCongeComponent } from './dialog-conge/dialog-conge.component';
import { CongeCardComponent } from './conge-card/conge-card.component';

@Component({
  selector: 'app-conge',
  templateUrl: './conge.component.html',
  styleUrls: ['./conge.component.scss']
})
export class CongeComponent implements OnInit {

  constructor(private service: CongéService, 
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

    conges!: Congé[];
    conge: Congé = new Congé();
    utilisateur: Utilisateur[];
    utilisateurs!: Utilisateur[];
    formTitle: string = '';
    buttonLabel: string = '';
    lengthConges: number;
    isLoading: boolean;
    displayedColumns: string[] = ['type', 'utilisateurId', 'dateDebut', 'duree', 'status', 'justificatif', 'document', 'action'];
    dataSource!: MatTableDataSource<Congé>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    role!: string;
    selectedUser: Utilisateur;
    public userFilterCtrl: FormControl = new FormControl();
    private _onDestroy = new Subject<void>();
    mesCongés!: Congé[];
    utilisateurId: number;
    id: number;
    excelService: ExcelService;

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      if (params.id) {
        this.id = params.id;
        this.getCongesByUtilisateur(this.id);
        const columnsToRemove = ['utilisateurId'];
        for (const col of columnsToRemove) {
          const colIndex = this.displayedColumns.indexOf(col);
          if (colIndex !== -1) {
            this.displayedColumns.splice(colIndex, 1);
          }
        }
      } else {
        this.getConges();
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

  getCongesByUtilisateur(id: number): void {
    this.service.GetCongésByUtilisateur(id).subscribe((data: Congé[]) => {
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

  getConges() {
    if (this.id) {
      this.service.GetCongésByUtilisateur(this.id).subscribe((data: Congé[]) => {
        this.conges = data;
        this.dataSource = new MatTableDataSource<Congé>(this.conges);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    } else {
      this.service.GetCongés().subscribe((data: Congé[]) => {
        this.conges = data;
        this.dataSource = new MatTableDataSource<Congé>(this.conges);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogCongeComponent, {});
  
    dialogRef.afterClosed().subscribe(result => {
      if(result === "ajouter"){
        this.getConges();
      }
    });
  }

  deleteConge(id: number): void {
    swal.fire({
      text: `Are you sure to delete this time off ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.service.DeleteCongé(id)
          .subscribe(()=>
            {
              this.getConges();
              this.notificationService.success('Time off deleted successfully');
            },
            () => {
              this.notificationService.danger('Delete time off failed');
            }
          );
      }
    });
  }

  rejectConge(id: number) : void{
    swal.fire({
      text: `Are you sure to reject this time off ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'No',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.service.RejectCongé(id)
          .subscribe(
            data => {
              if (data !== 0) {
                this.notificationService.success('This time off is rejected');
             
              } else {
                this.notificationService.danger('Reject time off failed');
              }
            },
            () => {
              this.notificationService.danger('Reject time off failed');
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

  updateConge(id: number) : void{

          this.service.ApprouverCongé(id).subscribe(()=>{
      this.notificationService.success('Time off approuved successfully !');
    },
    ()=>{
      setTimeout(() => {
        window.location.reload();
      },);
    });
    }

    getConge(id: number) {
      this.service.GetCongé(id).subscribe(
        (data) => {
          const dialogRef = this.dialog.open(CongeCardComponent, {
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
    
    onSortData(sort) {
      this.service.congéRequest.next(sort);
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
      const filterTitre = document.getElementById('type') as HTMLInputElement;
      const filterStatus = document.getElementById('status') as HTMLInputElement;
      const filterDate = document.getElementById('dateDebut') as HTMLInputElement;
    
      const filterTitreValue = filterTitre.value.trim().toLowerCase();
      const filterStatusValue = filterStatus.value.trim().toLowerCase();
      const filterDateValue = filterDate.value.trim().toLowerCase();
      const filterUserValue = this.selectedUser ? (this.selectedUser.nom + ' ' + this.selectedUser.prenom).toLowerCase() : '';
    
      if (filterTitreValue !== '') {
        this.dataSource.filterPredicate = (data: Congé, filter: string) =>
          data.type.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        this.dataSource.filter = filterTitreValue;
      }else if (filterUserValue !== '') {
        this.dataSource.filterPredicate = (data: Congé, filter: string) =>
          this.getUserNom(data.utilisateurId).toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        this.dataSource.filter = filterUserValue;
      }else if (filterStatusValue !== '') {
        this.dataSource.filterPredicate = (data: Congé, filter: string) =>
          data.status.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        this.dataSource.filter = filterStatusValue;
      }else if (filterDateValue !== '') {
          this.dataSource.filterPredicate = (data: Congé, filter: string) => {
            const formattedDate = new Date(data.dateDebut).toLocaleDateString(); // format the date as a string
            return formattedDate.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
          };
        this.dataSource.filter = filterDateValue;
        }
    }
    
    onResetAllFilters() {
      this.conge.type = '';
      this.conge.dateDebut= null;
      this.selectedUser = null;
      this.conge.status = '';
      this.getConges();
      this.onSearchClick(); // lancement d'une nouvelle recherche
    }


}
