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
  subscription: Subscription;


  displayedColumns: string[] = ['site', 'adresse', 'tel', 'fax', 'dateModif', 'dateAjout', 'action'];
  dataSource!: MatTableDataSource<Site>;

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
    // const ID = this.route.snapshot.paramMap.get('id')!;
    // const id: number = parseInt(ID, 10); 
    // this.getSite(id);
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

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

  onSortData(sort) {
    this.service.siteRequest.next(sort);
  }

  // getSite(id: number) {
  //   this.service.GetSite(id)
  //   .subscribe(site => {
  //   this.site = site;
  //   });
  // }

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

}
