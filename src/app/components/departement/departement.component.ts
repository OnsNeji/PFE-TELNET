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

  displayedColumns: string[] = ['nom', 'chefD', 'siteId', 'action'];
  dataSource!: MatTableDataSource<Departement>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() : void{
    this.getDepartements();
    this.getSites();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteDepartement(id: number): void {
    if (confirm(`Etes-vous sûr que vous voulez supprimer ce département ?`)) {
      this.service.DeleteDepartement(id)
        .subscribe(() =>{
          this.getDepartements();
          this.notificationService.success('Department deleted successfully');
        });
      }
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

}
