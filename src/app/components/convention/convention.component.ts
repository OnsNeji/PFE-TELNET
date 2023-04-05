import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Convention } from 'app/models/shared/convention.model';
import { Evenement } from 'app/models/shared/evenement.model';
import { NotificationService, DateTimeService } from 'app/services/shared';
import { ConventionService } from 'app/services/shared/convention.service';
import { DialogEventComponent } from '../evenement/dialog-event/dialog-event.component';
import { DialogConventionComponent } from './dialog-convention/dialog-convention.component';
import swal from 'sweetalert2';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-convention',
  templateUrl: './convention.component.html',
  styleUrls: ['./convention.component.scss']
})
export class ConventionComponent implements OnInit {

  constructor(private service: ConventionService, 
    private route: ActivatedRoute, 
    private router: Router, 
    public dialog: MatDialog, 
    private notificationService: NotificationService,
     private dateTimeService: DateTimeService,){}

ListeConventions!: Convention[];
convention: Convention = new Convention();
displayedColumns: string[] = ['logo', 'titre', 'dateDebut', 'dateFin', 'pieceJointe', 'action'];
dataSource!: MatTableDataSource<Convention>;
lengthConventions: number;
isLoading: boolean;
date= new Date();

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;

ngOnInit(): void {
this.getConventions();
this.onResetAllFilters();
}

openDialog() {
const dialogRef = this.dialog.open(DialogConventionComponent, {
});

dialogRef.afterClosed().subscribe(result => {
if(result === "ajouter"){
this.getConventions();
}
});
}


getConventions(){
this.service.GetConventions().subscribe({
next:(res)=>{
this.dataSource = new MatTableDataSource(res);
this.dataSource.paginator = this.paginator;
this.dataSource.sort = this.sort;
},
error:()=>{

}
})
}

deleteConvention(id: number): void {
swal.fire({
text: `Are you sure to delete this Agreement ?`,
icon: 'error',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Yes, delete it!',
showLoaderOnConfirm: true,
preConfirm: () => {
this.service.DeleteConvention(id)
.subscribe(()=>
  {
    this.getConventions();
    this.notificationService.success('Agreement deleted successfully');
  },
  () => {
    this.notificationService.danger('Delete Agreement failed');
  }
);
}
});
}

onSortData(sort) {
this.service.conventionRequest.next(sort);
}

updateConvention(row: any) {
this.dialog.open(DialogConventionComponent, {
data: row,
}).afterClosed().subscribe(result=>{
if(result === "modifier"){
this.getConventions();
}
})
}

downloadPDF(pieceJointe: string, fileName: string) {
  const byteCharacters = atob(pieceJointe.substring(28));
  const byteNumbers = new Array(byteCharacters.length);
  for (let i=0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray =  new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {type: 'application/pdf'});
  FileSaver.saveAs(blob, fileName);
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
const filterDateD = document.getElementById('dateDebut') as HTMLInputElement;
const filterTitre = document.getElementById('titre') as HTMLInputElement;
const filterDateF = document.getElementById('dateFin') as HTMLInputElement;

const filterTitreValue = filterTitre.value.trim().toLowerCase();
const filterDateDValue = filterDateD.value.trim().toLowerCase();
const filterDateFValue = filterDateF.value.trim().toLowerCase();

if (filterTitreValue !== '') {
this.dataSource.filterPredicate = (data: Convention, filter: string) =>
data.titre.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
this.dataSource.filter = filterTitreValue;
}else if (filterDateDValue !== '') {
this.dataSource.filterPredicate = (data: Convention, filter: string) => {
const formattedDate = new Date(data.dateDebut).toLocaleDateString(); // format the date as a string
return formattedDate.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
};
this.dataSource.filter = filterDateDValue;
}else if (filterDateFValue !== '') {
  this.dataSource.filterPredicate = (data: Convention, filter: string) => {
  const formattedDate = new Date(data.dateFin).toLocaleDateString(); // format the date as a string
  return formattedDate.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
  };
  this.dataSource.filter = filterDateFValue;
  }
}

onResetAllFilters() {
this.convention.description = ''; // réinitialisation des filtres
this.convention.titre = ''; 
this.convention.dateDebut = null; 
this.convention.dateFin = null; 
this.getConventions();
this.onSearchClick(); // lancement d'une nouvelle recherche
}

}
