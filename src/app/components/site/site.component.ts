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
              private searchFilterService: SearchFilterService,){}

  ListeSite!: Site[];
  site: Site = new Site();
  sites!: Site[];
  refreshSubscription: Subscription;
  subscription: Subscription;
  isLoading: boolean;
  displayedColumns: string[] = ['site', 'adresse', 'tel', 'fax', 'dateModif', 'userModif', 'action'];
  dataSource!: MatTableDataSource<Site>;
  Site='';
  Adresse='';
  Tel='';
  lengthSites: number;
  listView = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() : void{
    this.getSites();
    this.subscription = this.searchFilterService.resultChanged
      .subscribe(
        () => {
          this.dataSource = new MatTableDataSource(this.searchFilterService.showingDataLastFilter);
        }
      );
      const siteSearch = JSON.parse(sessionStorage.getItem('siteSearch'));
      if (siteSearch !== null) {
        this.Site = siteSearch.Site;
        this.Adresse = siteSearch.Adresse;
        this.Tel = siteSearch.Tel;
      }

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.refreshSubscription.unsubscribe();
    this.searchFilterService.showingDataLastFilter = [];
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
  // onClickingEnter(event) {
  //   if (event.key === 'Enter') {
  //     this.searchButton();
  //   }
  // }
  searchButton() {
      this.searchFilterService.pageIndex = 0;
      const siteSearch = new Site();
      siteSearch.site = this.Site;
      siteSearch.adresse = this.Adresse;
      siteSearch.tel = this.Tel;
      sessionStorage.setItem('siteSearch', JSON.stringify(siteSearch));

      this.isLoading = true;
      this.service.GetSites().subscribe(
          data => {
            this.isLoading = false;
            this.sites = data;
            this.lengthSites = this.sites.length;
            if (data.length !== 0) {
              this.listView = true;
            } else {
              this.listView = false;
            }
          });
  }

  applySiteFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: Site, filter: string) =>
      data.site.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyAdresseFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: Site, filter: string) =>
      data.adresse.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyTelFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: Site, filter: string) =>
      data.tel.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onResetAllFilters() {
    this.onResetSite();
    this.onResetAdresse();
    this.onResetTel();
  }

  onResetSite() {
    this.Site = '';
  }
  onResetAdresse() {
    this.Adresse = '';
  }

  onResetTel() {
    this.Tel = '';
  }

}
