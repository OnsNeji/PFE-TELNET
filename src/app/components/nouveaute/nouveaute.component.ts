import { Component, OnInit, ViewChild } from '@angular/core';
import { Nouveauté } from 'app/models/shared/nouveauté.model';
import { NouveautéService } from 'app/services/shared/nouveauté.service';
import { DialogNouveauteComponent } from './dialog-nouveaute/dialog-nouveaute.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Site } from 'app/models/shared/site.model';
import { AuthenticationService, DateTimeService, NotificationService } from 'app/services/shared';
import swal from 'sweetalert2';
import { ApiService } from 'app/services/shared/api.service';
import { DialogDescriptionNouvComponent } from './dialog-description-nouv/dialog-description-nouv.component';
import { UserStoreService } from 'app/services/shared/user-store.service';

@Component({
  selector: 'app-nouveaute',
  templateUrl: './nouveaute.component.html',
  styleUrls: ['./nouveaute.component.scss']
})
export class NouveauteComponent implements OnInit {

  constructor(private service: NouveautéService, 
              private siteService: ApiService, 
              private route: ActivatedRoute, 
              private router: Router, 
              public dialog: MatDialog,
              private dateTimeService: DateTimeService, 
              private notificationService: NotificationService,
              private userStore: UserStoreService,
              private authenticationService: AuthenticationService){}

  Nouveautes!: Nouveauté[];
  nouveaute: Nouveauté = new Nouveauté();
  Site: Site[];
  sites!: Site[];
  formTitle: string = '';
  buttonLabel: string = '';
  lengthNouv: number;
  isLoading: boolean;
  displayedColumns: string[] = ['pieceJointe', 'titre', 'description', 'datePublication', 'userAjout', 'siteId', 'action'];
  dataSource!: MatTableDataSource<Nouveauté>;
  siteId=0;
  selectedSite: Site;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  role!: string;


  ngOnInit() : void{
    this.getNouveautés();
    this.getSites();
    this.onResetAllFilters();
    this.userStore.getRoleFromStore().subscribe(val => {
      const roleFromToken = this.authenticationService.getRoleFromToken();
      this.role = val || roleFromToken;
      if (this.role !== 'Administrateur' && this.role !== 'Gestionnaire') {
        const actionIndex = this.displayedColumns.indexOf('action');
        if (actionIndex !== -1) {
          this.displayedColumns.splice(actionIndex, 1);
        }
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogNouveauteComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "ajouter"){
        this.getNouveautés();
      }
    });
  }

  getNouveautés(){
    this.service.GetNouveautés().subscribe({
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

  deleteNouveaute(id: number): void {
    swal.fire({
      text: `Are you sure to delete this News ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.service.DeleteNouveauté(id)
          .subscribe(()=>
            {
              this.getNouveautés();
              this.notificationService.success('News deleted successfully');
              setTimeout(() => {
                window.location.reload();
              }, 500);
            },
            () => {
              this.notificationService.danger('Delete News failed');
            }
          );
      }
    });
  }

  getSites(): void {
    this.siteService.GetSites().subscribe(sites => {
      this.sites = sites;
    });
  }

  getSiteNom(id: number): string {
    const site = this.sites.find(s => s.id === id);
    return site ? site.site : '';
  }


  onSortData(sort) {
    this.service.nouveautéRequest.next(sort);
  }
  updateNouveaute(row: any) {
    this.dialog.open(DialogNouveauteComponent, {
      data: row,
    }).afterClosed().subscribe(result=>{
      if(result === "modifier"){
        this.getNouveautés();
      }
    })
    }

    openDescriptionDialog(nouveaute: any): void {
      const dialogRef = this.dialog.open(DialogDescriptionNouvComponent, {
        width: '500px',
        data: { description: nouveaute.description },
      });
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
  const filterDate = document.getElementById('datePublication') as HTMLInputElement;

  const filterTitreValue = filterTitre.value.trim().toLowerCase();
  const filterDateValue = filterDate.value.trim().toLowerCase();
  const filterSiteValue = this.selectedSite ? this.selectedSite.site.toString().toLowerCase() : '';

  if (filterTitreValue !== '') {
    this.dataSource.filterPredicate = (data: Nouveauté, filter: string) =>
      data.titre.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterTitreValue;
  }else if (filterSiteValue !== '') {
    this.dataSource.filterPredicate = (data: Nouveauté, filter: string) =>
      this.getSiteNom(data.siteId).toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterSiteValue;
  }else if (filterDateValue !== '') {
      this.dataSource.filterPredicate = (data: Nouveauté, filter: string) => {
        const formattedDate = new Date(data.datePublication).toLocaleDateString(); // format the date as a string
        return formattedDate.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      };
    this.dataSource.filter = filterDateValue;
    }
  
}

  
    onResetAllFilters() {
      this.nouveaute.titre = '';
      this.selectedSite = null; 
      this.nouveaute.datePublication = null;
      this.getNouveautés();
      this.onSearchClick(); // lancement d'une nouvelle recherche
    }
  
}
