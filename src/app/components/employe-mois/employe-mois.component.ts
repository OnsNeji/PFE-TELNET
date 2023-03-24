import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployéMois } from 'app/models/shared/employeMois.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { DateTimeService, NotificationService } from 'app/services/shared';
import { EmployeMoisService } from 'app/services/shared/employe-mois.service';
import swal from 'sweetalert2';
import { DialogEmployeMoisComponent } from './dialog-employe-mois/dialog-employe-mois.component';

@Component({
  selector: 'app-employe-mois',
  templateUrl: './employe-mois.component.html',
  styleUrls: ['./employe-mois.component.scss']
})
export class EmployeMoisComponent implements OnInit {

  constructor(private service: EmployeMoisService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private notificationService: NotificationService, private dateTimeService: DateTimeService,){}

  ListeEmployes!: EmployéMois[];
  employeMois: EmployéMois = new EmployéMois();
  utilisateurs! : Utilisateur[];
  displayedColumns: string[] = ['image', 'utilisateurId', 'description', 'date', 'userAjout', 'action'];
  dataSource!: MatTableDataSource<EmployéMois>;
  lengthEmployes: number;
  isLoading: boolean;
  date= new Date();
  description='';
  utilisateurId=0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getEmployesMois();
    this.getUsers();
    this.onResetAllFilters();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogEmployeMoisComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "ajouter"){
        this.getEmployesMois();
      }
    });
  }

  getEmployesMois(){
    this.service.GetEmployesMois().subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{

      }
    })
  }

  deleteEmployeMois(id: number): void {
    swal.fire({
      text: `Are you sure to delete this Employee ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.service.DeleteEmployeMois(id)
          .subscribe(()=>
            {
              this.getEmployesMois();
              this.notificationService.success('Department deleted successfully');
            },
            () => {
              this.notificationService.danger('Delete Employé du Mois failed');
            }
          );
      }
    });
  }

  onSortData(sort) {
    this.service.userRequest.next(sort);
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

  updateEmployeMois(row: any) {
    this.dialog.open(DialogEmployeMoisComponent, {
      data: row,
    }).afterClosed().subscribe(result=>{
      if(result === "modifier"){
        this.getEmployesMois();
      }
    })
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
      const filterDate = document.getElementById('date') as HTMLInputElement;
      const filterDesc = document.getElementById('description') as HTMLInputElement;
      const filterUser = document.getElementById('utilisateurId') as HTMLInputElement;
  
      const filterDateValue = filterDate.value.trim().toLowerCase();
      const filterDescValue = filterDesc.value.trim().toLowerCase();
      const filterUserValue = filterUser.value.trim().toLowerCase();
  
      if (filterDescValue !== '') {
        this.dataSource.filterPredicate = (data: EmployéMois, filter: string) =>
        data.description.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      this.dataSource.filter = filterDescValue;
      }else if (filterUserValue !== '') {
        this.dataSource.filterPredicate = (data: EmployéMois, filter: string) =>
        data.utilisateurId.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      this.dataSource.filter = filterUserValue;
      }else if (filterDateValue !== '') {
        this.dataSource.filterPredicate = (data: EmployéMois, filter: string) => {
          const formattedDate = new Date(data.date).toLocaleDateString(); // format the date as a string
          return formattedDate.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        };
      this.dataSource.filter = filterDateValue;
      }
    }

    onResetAllFilters() {
      this.employeMois.description = ''; // réinitialisation des filtres
      this.employeMois.date = null; 
      this.employeMois.utilisateurId = null; 
      this.getEmployesMois();
      this.onSearchClick(); // lancement d'une nouvelle recherche
    }
  
}
