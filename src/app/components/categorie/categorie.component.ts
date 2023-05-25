import { Component, OnInit, ViewChild } from '@angular/core';
import { Catégorie } from 'app/models/shared/catégorie.model';
import { CategorieDialogComponent } from './categorie-dialog/categorie-dialog.component';
import { CategorieService } from 'app/services/shared/categorie.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Departement } from 'app/models/shared/departement.model';
import { NotificationService, AuthenticationService } from 'app/services/shared';
import { UserStoreService } from 'app/services/shared/user-store.service';
import { DialogDepartementComponent } from '../departement/dialog-departement/dialog-departement.component';
import swal from 'sweetalert2';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss']
})
export class CategorieComponent implements OnInit {

 
  constructor(private route: ActivatedRoute, 
              private router: Router, 
              public dialog: MatDialog, 
              private notificationService: NotificationService,
              private userStore: UserStoreService,
              private categorieService: CategorieService,
              private authenticationService: AuthenticationService){}

ListeCategories!: Catégorie[];
categorie: Catégorie = new Catégorie();
lengthCats: number;
isLoading: boolean;
displayedColumns: string[] = ['nom', 'action'];
dataSource!: MatTableDataSource<Catégorie>;
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
role!: string;


ngOnInit() : void{
  this.getCatégories();
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
const dialogRef = this.dialog.open(CategorieDialogComponent, {
});

dialogRef.afterClosed().subscribe(result => {
if(result === "ajouter"){
this.getCatégories();
}
});
}

getCatégories(){
this.categorieService.GetCatégories().subscribe({
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

deleteCategorie(id: number): void {
swal.fire({
text: `Are you sure to delete this Category ?`,
icon: 'error',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Yes, delete it!',
showLoaderOnConfirm: true,
preConfirm: () => {
this.categorieService.DeleteCatégorie(id)
.subscribe(()=>
  {
    this.getCatégories();
    this.notificationService.success('Category deleted successfully');
  },
  () => {
    this.notificationService.danger('Delete Category failed');
  }
);
}
});
}

onSortData(sort) {
this.categorieService.categorieRequest.next(sort);
}
updateCategorie(row: any) {
this.dialog.open(CategorieDialogComponent, {
data: row,
}).afterClosed().subscribe(result=>{
if(result === "modifier"){
this.getCatégories();
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

const filterNomValue = filterNom.value.trim().toLowerCase();

if (filterNomValue !== '') {
this.dataSource.filterPredicate = (data: Catégorie, filter: string) =>
data.nom.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
this.dataSource.filter = filterNomValue;
}

}


onResetAllFilters() {
this.categorie.nom = ''; // réinitialisation des filtres
this.getCatégories();
this.onSearchClick(); // lancement d'une nouvelle recherche
}
}
