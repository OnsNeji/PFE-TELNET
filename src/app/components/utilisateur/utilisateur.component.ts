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

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.scss']
})
export class UtilisateurComponent implements OnInit {

  constructor(private service: ApiService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog, private notificationService: NotificationService){}

  ListeUser!: Utilisateur[];
  utilisateur: Utilisateur = new Utilisateur();
  postes!: Poste[];
  departements!: Departement[];
  formTitle: string = '';
  buttonLabel: string = '';
  searchText!: string;

  displayedColumns: string[] = ['image', 'nom', 'prenom', 'matricule', 'dateEmbauche', 'email', 'tel', 'userModif', 'action'];
  dataSource!: MatTableDataSource<Utilisateur>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit() : void{
    this.getUtilisateurs();
    this.getPostes();
    this.getDépartements();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteUtilisateur(id: number): void {
    if (confirm(`Etes-vous sûr que vous voulez supprimer cet Utilisateur ?`)) {
    this.service.DeleteUtilisateur(id)
      .subscribe(() =>{
        this.getUtilisateurs();
        this.notificationService.success('User deleted successfully.');
      });
    }
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

}
