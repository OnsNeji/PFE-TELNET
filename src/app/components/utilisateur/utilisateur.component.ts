import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Departement } from 'app/models/shared/departement.model';
import { Poste } from 'app/models/shared/poste.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';
import { NotificationService } from 'app/services/shared/notification.service';
import DialogUserComponent from './dialog-user/dialog-user.component';
import swal from 'sweetalert2';
import { DateTimeService } from 'app/services/shared';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.scss']
})
export class UtilisateurComponent implements OnInit {

  constructor(private service: ApiService, 
              private route: ActivatedRoute, 
              private router: Router, 
              public dialog: MatDialog, 
              private notificationService: NotificationService,
              private dateTimeService: DateTimeService,){}

  ListeUser!: Utilisateur[];
  utilisateur: Utilisateur = new Utilisateur();
  postes!: Poste[];
  departements!: Departement[];
  formTitle: string = '';
  buttonLabel: string = '';
  searchText!: string;
  lengthUsers: number;
  listView = false;
  nom='';
  prenom='';
  matricule='';
  role='';
  tel='';
  isLoading: boolean;
  dateEmbauche= new Date();

  displayedColumns: string[] = ['image', 'nom && prenom', 'matricule', 'email', 'dateEmbauche', 'departementId', 'dateModif', 'action'];
  dataSource!: MatTableDataSource<Utilisateur>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() : void{
    this.getUtilisateurs();
    this.getPostes();
    this.getDépartements();

    const userSearch = JSON.parse(sessionStorage.getItem('userSearch'));
      if (userSearch !== null) {
        this.nom = userSearch.nom;
        this.prenom = userSearch.prenom;
        this.matricule = userSearch.matricule;
        this.dateEmbauche = userSearch.dateEmbauche;
        this.role = userSearch.role;
        this.tel = userSearch.tel;
      }

    // const ID = this.route.snapshot.paramMap.get('id')!;
    // const id: number = parseInt(ID, 10); 
    // this.getUtilisateur(id);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogUserComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "ajouter"){
        this.getUtilisateurs();
      }
    });
  }

   getUtilisateurs(): void {
    this.service.GetUtilisateurs()
      .subscribe(ListeUser => {
        this.ListeUser = ListeUser.filter(utilisateur => !utilisateur.supprimé);
        console.log(this.ListeUser);
        this.dataSource = new MatTableDataSource(this.ListeUser);
        console.log(this.dataSource.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  deleteUtilisateur(id: number): void {
    swal.fire({
      text: `Are you sure to delete this User ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.service.DeleteUtilisateur(id)
          .subscribe(()=>
            {
              this.getUtilisateurs();
              this.notificationService.success('User deleted successfully.');
            },
            () => {
              this.notificationService.danger('Delete User failed');
            }
          );
      }
    });
  }

  getPostes(): void {
    this.service.GetPostes().subscribe(postes => {
      this.postes = postes;
    });
  }

  getDépartements(): void {
    this.service.GetDepartements().subscribe(departements => {
      this.departements = departements;
    });
  }

  // getUtilisateur(id: number) {
  //   this.service.GetUtilisateur(id)
  //   .subscribe(utilisateur => {
  //   this.utilisateur = utilisateur;
  //   });
  // }

  onSortData(sort) {
    this.service.siteRequest.next(sort);
  }

  updateUtilisateur(row: any) {
    this.dialog.open(DialogUserComponent, {
      data: row,
    }).afterClosed().subscribe(result=>{
      if(result === "modifier"){
        this.getUtilisateurs();
      }
    })
    }

    getDepNom(id: number): string {
    const dep = this.departements.find(s => s.id === id);
    return dep ? dep.nom : '';
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
    const filterNom = document.getElementById('nom') as HTMLInputElement;
    const filterPrenom = document.getElementById('prenom') as HTMLInputElement;
    const filterMatricule = document.getElementById('matricule') as HTMLInputElement;
    const filterDate = document.getElementById('dateEmbauche') as HTMLInputElement;
    const filterRole = document.getElementById('role') as HTMLInputElement;
    const filterTel = document.getElementById('tel') as HTMLInputElement;

    const filterNomValue = filterNom.value.trim().toLowerCase();
    const filterPrenomValue = filterPrenom.value.trim().toLowerCase();
    const filterMatriculeValue = filterMatricule.value.trim().toLowerCase();
    const filterDateValue = filterDate.value.trim().toLowerCase();
    const filterRoleValue = filterRole.value.trim().toLowerCase();
    const filterTelValue = filterTel.value.trim().toLowerCase();

    if (filterNomValue !== '') {
      this.dataSource.filterPredicate = (data: Utilisateur, filter: string) =>
        data.nom.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      this.dataSource.filter = filterNomValue;
    } else if (filterPrenomValue !== '') {
      this.dataSource.filterPredicate = (data: Utilisateur, filter: string) =>
      data.prenom.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterPrenomValue;
    }else if (filterMatriculeValue !== '') {
      this.dataSource.filterPredicate = (data: Utilisateur, filter: string) =>
      data.matricule.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterMatriculeValue;
    }else if (filterRoleValue !== '') {
      this.dataSource.filterPredicate = (data: Utilisateur, filter: string) =>
      data.role.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterRoleValue;
    }else if (filterTelValue !== '') {
      this.dataSource.filterPredicate = (data: Utilisateur, filter: string) =>
      data.tel.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    this.dataSource.filter = filterTelValue;
    }
    else if (filterDateValue !== '') {
      this.dataSource.filterPredicate = (data: Utilisateur, filter: string) => {
        const formattedDate = new Date(data.dateEmbauche).toLocaleDateString(); // format the date as a string
        return formattedDate.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
      };
    this.dataSource.filter = filterDateValue;
    }
  }

  onResetAllFilters() {
    this.utilisateur.nom = ''; // réinitialisation des filtres
    this.utilisateur.prenom = ''; 
    this.utilisateur.matricule = ''; 
    this.utilisateur.dateEmbauche = null;
    this.utilisateur.role = ''; 
    this.utilisateur.tel = ''; 
    this.getUtilisateurs();
    this.onSearchClick(); // lancement d'une nouvelle recherche
  }
  
}
