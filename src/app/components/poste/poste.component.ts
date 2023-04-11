import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Poste } from 'app/models/shared/poste.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';
import { NotificationService } from 'app/services/shared/notification.service';
import { DialogPosteComponent } from './dialog-poste/dialog-poste.component';
import swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Site } from 'app/models/shared/site.model';

@Component({
  selector: 'app-poste',
  templateUrl: './poste.component.html',
  styleUrls: ['./poste.component.scss']
})
export class PosteComponent implements OnInit {

  
  constructor(private service: ApiService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private notificationService: NotificationService){}

  ListePoste!: Poste[];
  poste: Poste = new Poste();
  utilisateurs!: Utilisateur[];
  Site: Site[];
  sites!: Site[];
  formTitle: string = '';
  buttonLabel: string = '';
  lengthPostes: number;
  listView = false;
  isLoading: boolean;
  displayedColumns: string[] = ['numéro', 'utilisateurId', 'siteId', 'etage', 'dateModif', 'action'];
  dataSource!: MatTableDataSource<Poste>;
  numéro='';
  utilisateurId='';
  selectedUser: Utilisateur;
  public userFilterCtrl: FormControl = new FormControl();
  private _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() : void{
    this.getPostes();
    this.getUtilisateurs();
    this.getSites();
    const posteSearch = JSON.parse(sessionStorage.getItem('posteSearch'));
      if (posteSearch !== null) {
        this.numéro = posteSearch.numéro;
        this.utilisateurId = posteSearch.utilisateurId;
      }

      this.userFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterUsers();
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
  openDialog() {
    const dialogRef = this.dialog.open(DialogPosteComponent, {
     
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "ajouter"){
        this.getPostes();
      }
    });
  }

  getPostes(){
    this.service.GetPostes().subscribe({
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deletePoste(id: number): void {
    swal.fire({
      text: `Are you sure to delete this Poste ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.service.DeletePoste(id)
          .subscribe(()=>
            {
              this.getPostes();
              this.notificationService.success('Poste deleted successfully');
            },
            () => {
              this.notificationService.danger('Delete Poste failed');
            }
          );
      }
    });
  }

  getUtilisateurs(): void {
    this.service.GetUtilisateurs().subscribe(utilisateurs => {
      this.utilisateurs = utilisateurs;
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

  onSortData(sort) {
    this.service.siteRequest.next(sort);
  }

  // getPoste(id: number) {
  //   this.service.GetPoste(id)
  //   .subscribe(poste => {
  //   this.poste = poste;
  //   });
  // }

  updatePoste(row: any) {
    this.dialog.open(DialogPosteComponent, {
      data: row,
    }).afterClosed().subscribe(result=>{
      if(result === "modifier"){
        this.getPostes();
      }
    })
    }

    getUtilisateurNom(id: number): string {
      const utilisateur = this.utilisateurs.find(s => s.id === id);
      return utilisateur ? (utilisateur.nom + ' ' + utilisateur.prenom) : '';
    }

    onClickingEnter(event) {
      if (event.key === 'Enter') {
        this.onSearchClick();
      }
    }
  
    onSearchClick() {
      const filterNumero = document.getElementById('numéro') as HTMLInputElement;
  
      const filterNumValue = filterNumero.value.trim().toLowerCase();
      const filterUserValue = this.selectedUser ? (this.selectedUser.nom + ' ' + this.selectedUser.prenom).toLowerCase() : '';

  
      if (filterNumValue !== '') {
        this.dataSource.filterPredicate = (data: Poste, filter: string) =>
          data.numéro.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        this.dataSource.filter = filterNumValue;
      }
      else if (filterUserValue !== '') {
        this.dataSource.filterPredicate = (data: Poste, filter: string) =>
          this.getUtilisateurNom(data.utilisateurId).toLowerCase().indexOf(filter.toLowerCase()) !== -1;
        this.dataSource.filter = filterUserValue;
      }
    }
  
    onResetAllFilters() {
      this.poste.numéro = null; // réinitialisation des filtres
      this.selectedUser = null; 
      this.getPostes();
      this.onSearchClick(); // lancement d'une nouvelle recherche
    }
}
