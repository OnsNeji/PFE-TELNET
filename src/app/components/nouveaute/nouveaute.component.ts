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
import { DateTimeService, NotificationService } from 'app/services/shared';
import swal from 'sweetalert2';
import { ApiService } from 'app/services/shared/api.service';
import { DialogDescriptionNouvComponent } from './dialog-description-nouv/dialog-description-nouv.component';

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
              private notificationService: NotificationService){}

  Nouveautes!: Nouveauté[];
  nouveaute: Nouveauté = new Nouveauté();
  Site: Site[];
  sites!: Site[];
  formTitle: string = '';
  buttonLabel: string = '';
  lengthNouv: number;
  isLoading: boolean;
  displayedColumns: string[] = ['pieceJointe', 'titre', 'description', 'datePublication', 'userAjout', 'action'];
  dataSource!: MatTableDataSource<Nouveauté>;
  siteId=0;
  selectedSite: Site;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() : void{
    this.getNouveautés();
    this.getSites();
    this.onResetAllFilters();
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
  const filterDesc = document.getElementById('description') as HTMLInputElement;
  const filterDate = document.getElementById('datePublication') as HTMLInputElement;

  const filterTitreValue = filterTitre.value.trim().toLowerCase();
  const filterDescValue = filterDesc.value.trim().toLowerCase();
  const filterDateValue = filterDate.value.trim().toLowerCase();

  if (filterTitreValue !== '') {
    this.dataSource.filterPredicate = (data: Nouveauté, filter: string) =>
      data.titre.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterTitreValue;
  }else if (filterDescValue !== '') {
    this.dataSource.filterPredicate = (data: Nouveauté, filter: string) =>
    data.description.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterDescValue;
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
      this.nouveaute.description = ''; // réinitialisation des filtres
      this.nouveaute.datePublication = null;
      this.getNouveautés();
      this.onSearchClick(); // lancement d'une nouvelle recherche
    }
  
}
