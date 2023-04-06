import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTimeService, NotificationService } from 'app/services/shared';
import { ApiService } from 'app/services/shared/api.service';
import { MariageNaissanceService } from 'app/services/shared/mariageNaissance.service';
import swal from 'sweetalert2';
import { DialogMariageComponent } from './dialog-mariage/dialog-mariage.component';
import { MariageNaissance } from 'app/models/shared/mariageNaissance.model';
import { FormControl } from '@angular/forms';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mariage',
  templateUrl: './mariage.component.html',
  styleUrls: ['./mariage.component.scss']
})
export class MariageComponent implements OnInit {
  constructor(private MNService: MariageNaissanceService, 
              private service: ApiService,
              private route: ActivatedRoute, 
              private router: Router, 
              public dialog: MatDialog, 
              private notificationService: NotificationService, 
              private dateTimeService: DateTimeService,){}

  MariageNaissances!: MariageNaissance[];
  MariageNaissance: MariageNaissance = new MariageNaissance();
  utilisateurs! : Utilisateur[];
  displayedColumns: string[] = ['utilisateurId', 'titre', 'date', 'userAjout', 'action'];
  dataSource!: MatTableDataSource<MariageNaissance>;
  lengthMN: number;
  isLoading: boolean;
  date= new Date();
  description='';
  utilisateurId=0;
  selectedUser: Utilisateur;
  public userFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getMariageNaissances();
    this.getUsers();
    // this.onResetAllFilters();

    this.userFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterUsers();
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogMariageComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "ajouter"){
        this.getMariageNaissances();
      }
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

  getMariageNaissances(){
    this.MNService.GetMariageNaissances().subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{

      }
    })
  }

  deleteMariageNaissance(id: number): void {
    swal.fire({
      text: `Are you sure to delete it ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.MNService.DeleteMariageNaissance(id)
          .subscribe(()=>
            {
              this.getMariageNaissances();
              this.notificationService.success('Mariage/Naissance deleted successfully');
            },
            () => {
              this.notificationService.danger('Delete Mariage/Naissance failed');
            }
          );
      }
    });
  }

  onSortData(sort) {
    this.MNService.MNRequest.next(sort);
  }

  getUsers(): void {
    this.service.GetUtilisateurs().subscribe(users => {
      this.utilisateurs = users;
    });
  }

  getUserNom(id: number): string {
    const user = this.utilisateurs.find(s => s.id === id);
    return user ? (user.nom + ' ' + user.prenom) : '';
  }

  updateMariageNaissance(row: any) {
    this.dialog.open(DialogMariageComponent, {
      data: row,
    }).afterClosed().subscribe(result=>{
      if(result === "modifier"){
        this.getMariageNaissances();
      }
    })
    }

    dateOnly(event): boolean {
      return this.dateTimeService.dateOnly(event);
    }

    // onClickingEnter(event) {
    //   if (event.key === 'Enter') {
    //     this.onSearchClick();
    //   }
    // }

    // onSearchClick() {
    //   const filterDate = document.getElementById('date') as HTMLInputElement;

    //   const filterDateValue = filterDate.value.trim().toLowerCase();
    //   const filterUserValue = this.selectedUser ? (this.selectedUser.nom + ' ' + this.selectedUser.prenom).toLowerCase() : '';
  
    //   if (filterUserValue !== '') {
    //     this.dataSource.filterPredicate = (data: EmployéMois, filter: string) =>
    //       this.getUserNom(data.utilisateurId).toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    //     this.dataSource.filter = filterUserValue;
    //   }else if (filterDateValue !== '') {
    //     this.dataSource.filterPredicate = (data: EmployéMois, filter: string) => {
    //       const formattedDate = new Date(data.date).toLocaleDateString(); // format the date as a string
    //       return formattedDate.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    //     };
    //   this.dataSource.filter = filterDateValue;
    //   }
    // }

    // onResetAllFilters() {
    //   this.employeMois.date = null; 
    //   this.selectedUser = null; 
    //   this.getEmployesMois();
    //   this.onSearchClick(); // lancement d'une nouvelle recherche
    // }
  

}
