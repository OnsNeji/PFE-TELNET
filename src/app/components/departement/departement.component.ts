import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Departement } from 'app/models/shared/departement.model';
import { Site } from 'app/models/shared/site.model';
import { ApiService } from 'app/services/shared/api.service';
import { NotificationService } from 'app/services/shared/notification.service';
import { DialogDepartementComponent } from './dialog-departement/dialog-departement.component';
import swal from 'sweetalert2';

@Component({
  selector: 'app-departement',
  templateUrl: './departement.component.html',
  styleUrls: ['./departement.component.scss']
})
export class DepartementComponent implements OnInit {

  constructor(private service: ApiService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private notificationService: NotificationService){}

  ListeDepartement!: Departement[];
  departement: Departement = new Departement();
  sites!: Site[];
  formTitle: string = '';
  buttonLabel: string = '';
  lengthDeps: number;
  isLoading: boolean;
  displayedColumns: string[] = ['nom', 'chefD', 'siteId', 'action'];
  dataSource!: MatTableDataSource<Departement>;
  nom='';
  chefD='';
  siteId=0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() : void{
    this.getDepartements();
    this.getSites();
    const depSearch = JSON.parse(sessionStorage.getItem('depSearch'));
      if (depSearch !== null) {
        this.nom = depSearch.nom;
        this.chefD = depSearch.chefD;
        this.siteId = depSearch.siteId;
      }
    // const ID = this.route.snapshot.paramMap.get('id')!;
    // const id: number = parseInt(ID, 10); 
    // this.getDepartement(id);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogDepartementComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "ajouter"){
        this.getDepartements();
      }
    });
  }

  getDepartements(){
    this.service.GetDepartements().subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{

      }
    })
  }

  deleteDepartement(id: number): void {
    swal.fire({
      text: `Are you sure to delete this Department ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.service.DeleteDepartement(id)
          .subscribe(()=>
            {
              this.getDepartements();
              this.notificationService.success('Department deleted successfully');
            },
            () => {
              this.notificationService.danger('Delete Department failed');
            }
          );
      }
    });
  }


  getSites(): void {
    this.service.GetSites().subscribe(sites => {
      this.sites = sites;
    });
  }

  getSiteNom(id: number): string {
    const site = this.sites.find(s => s.id === id);
    return site ? site.site : '';
  }

  // getDepartement(id: number) {
  //   this.service.GetDepartement(id)
  //   .subscribe(departement => {
  //   this.departement = departement;
  //   });
  // }

  onSortData(sort) {
    this.service.siteRequest.next(sort);
  }
  updateDepartement(row: any) {
    this.dialog.open(DialogDepartementComponent, {
      data: row,
    }).afterClosed().subscribe(result=>{
      if(result === "modifier"){
        this.getDepartements();
      }
    })
    }

    onClickingEnter(event) {
      if (event.key === 'Enter') {
        this.onSearchClick();
      }
    }
  
    onSearchClick() {
      const filterNom = document.getElementById('nom') as HTMLInputElement;
      const filterChef = document.getElementById('chefD') as HTMLInputElement;
      const filterSite = document.getElementById('siteId') as HTMLInputElement;
  
      const filterNomValue = filterNom.value.trim().toLowerCase();
      const filterChefValue = filterChef.value.trim().toLowerCase();
      const filterSiteValue = filterSite.value.trim().toLowerCase();
  
      if (filterNomValue !== '') {
        this.dataSource.filterPredicate = (data: Departement, filter: string) =>
          data.nom.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        this.dataSource.filter = filterNomValue;
      } else if (filterChefValue !== '') {
        this.dataSource.filterPredicate = (data: Departement, filter: string) =>
        data.chefD.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      this.dataSource.filter = filterChefValue;
      }else if (filterSiteValue !== '') {
        this.dataSource.filterPredicate = (data: Departement, filter: string) =>
        data.siteId.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      this.dataSource.filter = filterSiteValue;
      }
    }
  
    onResetAllFilters() {
      this.departement.nom = ''; // réinitialisation des filtres
      this.departement.chefD = ''; 
      this.departement.siteId = null; 
      this.getDepartements();
      this.onSearchClick(); // lancement d'une nouvelle recherche
    }
  
}
