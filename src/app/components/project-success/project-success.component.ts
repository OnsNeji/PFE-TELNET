import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectSuccess } from 'app/models/shared/projectSuccess.model';
import { ProjectSuccessService } from 'app/services/shared/project-success.service';
import { DialogProjectSuccessComponent } from './dialog-project-success/dialog-project-success.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { NotificationService, DateTimeService, AuthenticationService } from 'app/services/shared';
import { UserStoreService } from 'app/services/shared/user-store.service';

@Component({
  selector: 'app-project-success',
  templateUrl: './project-success.component.html',
  styleUrls: ['./project-success.component.scss']
})
export class ProjectSuccessComponent implements OnInit {

  constructor(private service: ProjectSuccessService, 
              private route: ActivatedRoute, 
              private router: Router, 
              public dialog: MatDialog, 
              private notificationService: NotificationService, 
              private dateTimeService: DateTimeService,
              private userStore: UserStoreService,
              private authenticationService: AuthenticationService){}

  ProjectSuccesses!: ProjectSuccess[];
  projectSuccess: ProjectSuccess = new ProjectSuccess();
  displayedColumns: string[] = ['pieceJointe', 'titre', 'description', 'userAjout', 'action'];
  dataSource!: MatTableDataSource<ProjectSuccess>;
  lengthPS: number;
  isLoading: boolean;
  role!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getProjectSuccesses();
    this.onResetAllFilters();

    this.userStore.getRoleFromStore().subscribe(val => {
      const roleFromToken = this.authenticationService.getRoleFromToken();
      this.role = val || roleFromToken;

      if (this.role !== 'Gestionnaire') {
        const actionIndex = this.displayedColumns.indexOf('action');
        if (actionIndex !== -1) {
          this.displayedColumns.splice(actionIndex, 1);
        }
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogProjectSuccessComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "ajouter"){
        this.getProjectSuccesses();
      }
    });
  }

  getProjectSuccesses(){
    this.service.GetProjectSuccesses().subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{

      }
    })
  }

  deleteProjectSuccess(id: number): void {
    swal.fire({
      text: `Are you sure to delete this Employee ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.service.DeleteProjectSuccess(id)
          .subscribe(()=>
            {
              this.getProjectSuccesses();
              this.notificationService.success('Project Success deleted successfully');
            },
            () => {
              this.notificationService.danger('Delete Project Success failed');
            }
          );
      }
    });
  }

  onSortData(sort) {
    this.service.PSRequest.next(sort);
  }

  updateProjectSuccess(row: any) {
    this.dialog.open(DialogProjectSuccessComponent, {
      data: row,
    }).afterClosed().subscribe(result=>{
      if(result === "modifier"){
        this.getProjectSuccesses();
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

      const filterDateValue = filterDate.value.trim().toLowerCase();
  
    }

    onResetAllFilters() {
      this.projectSuccess.titre = ''; 
      this.getProjectSuccesses();
      this.onSearchClick(); // lancement d'une nouvelle recherche
    }
}
