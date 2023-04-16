import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Site } from 'app/models/shared/site.model';
import { ApiService } from 'app/services/shared/api.service';
import { NotificationService } from 'app/services/shared/notification.service';
import { SearchFilterService } from 'app/services/shared/search-filter.service';
import { Subscription } from 'rxjs';
import { DialogSiteComponent } from './dialog-site/dialog-site.component';
import swal from 'sweetalert2';
import { ReferenceSearch } from 'app/models/project-management/project';
import { UserStoreService } from 'app/services/shared/user-store.service';
import { AuthenticationService } from 'app/services/shared/authentication.service';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {

  constructor(private service: ApiService, 
              private route: ActivatedRoute, 
              private router: Router, 
              public dialog: MatDialog, 
              private notificationService: NotificationService,
              private searchFilterService: SearchFilterService,
              private userStore: UserStoreService,
              private authenticationService: AuthenticationService){}

  ListeSite!: Site[];
  site: Site = new Site();
  sites!: Site[];
  refreshSubscription: Subscription;
  subscription: Subscription;
  isLoading: boolean;
  displayedColumns: string[] = ['site', 'adresse', 'tel', 'fax', 'userAjout', 'action'];
  dataSource!: MatTableDataSource<Site>;
  Site='';
  Adresse='';
  Tel='';
  lengthSites: number;
  listView = false;
  role!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() : void{
    this.getSites();
      const siteSearch = JSON.parse(sessionStorage.getItem('siteSearch'));
      if (siteSearch !== null) {
        this.Site = siteSearch.Site;
        this.Adresse = siteSearch.Adresse;
        this.Tel = siteSearch.Tel;
      }

      this.userStore.getRoleFromStore().subscribe(val => {
        const roleFromToken = this.authenticationService.getRoleFromToken();
        this.role = val || roleFromToken;
        if (this.role !== 'RH') {
          const actionIndex = this.displayedColumns.indexOf('action');
          if (actionIndex !== -1) {
            this.displayedColumns.splice(actionIndex, 1);
          }
        }
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogSiteComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "ajouter"){
        this.getSites();
      }
    });
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }

  deleteSite(id: number): void {
    swal.fire({
      text: `Are you sure to delete this Site ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.service.DeleteSite(id)
          .subscribe(()=>
            {
              this.getSites();
              this.notificationService.success('Site deleted successfully');
            },
            () => {
              this.notificationService.danger('Delete Site failed');
            }
          );
      }
    });
  }

  getSites(){
    this.service.GetSites().subscribe({
      next:(res)=>{
        console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{

      }
    })
  }

  updateSite(row: Site) {
    console.log(row);
    this.dialog.open(DialogSiteComponent, {
      data: row,
    }).afterClosed().subscribe(result=>{
      if(result === "modifier"){
        this.getSites();
      }
    })
    }

  onSortData(sort) {
    this.service.siteRequest.next(sort);
  }

  onClickingEnter(event) {
    if (event.key === 'Enter') {
      this.onSearchClick();
    }
  }

  onSearchClick() {
    const filterSite = document.getElementById('site') as HTMLInputElement;
    const filterAdresse = document.getElementById('adresse') as HTMLInputElement;
    const filterTel = document.getElementById('tel') as HTMLInputElement;

    const filterSiteValue = filterSite.value.trim().toLowerCase();
    const filterAdrValue = filterAdresse.value.trim().toLowerCase();
    const filterTelValue = filterTel.value.trim().toLowerCase();

    if (filterSiteValue !== '') {
      this.dataSource.filterPredicate = (data: Site, filter: string) =>
        data.site.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      this.dataSource.filter = filterSiteValue;
    } else if (filterAdrValue !== '') {
      this.dataSource.filterPredicate = (data: Site, filter: string) =>
      data.adresse.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterAdrValue;
    }else if (filterTelValue !== '') {
      this.dataSource.filterPredicate = (data: Site, filter: string) =>
      data.tel.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterTelValue;
    }
  }

  onResetAllFilters() {
    this.site.site = ''; // réinitialisation des filtres
    this.site.adresse = ''; 
    this.site.tel = ''; 
    this.getSites();
    this.onSearchClick(); // lancement d'une nouvelle recherche
  }
  
}
