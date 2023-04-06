import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Mariage } from 'app/models/shared/mariage.model';
import { Nouveauté } from 'app/models/shared/nouveauté.model';
import { Site } from 'app/models/shared/site.model';
import { DateTimeService, NotificationService } from 'app/services/shared';
import { ApiService } from 'app/services/shared/api.service';
import { MariageService } from 'app/services/shared/mariage.service';
import { NouveautéService } from 'app/services/shared/nouveauté.service';
import { DialogDescriptionNouvComponent } from '../nouveaute/dialog-description-nouv/dialog-description-nouv.component';
import { DialogNouveauteComponent } from '../nouveaute/dialog-nouveaute/dialog-nouveaute.component';
import swal from 'sweetalert2';
import { DialogMariageComponent } from './dialog-mariage/dialog-mariage.component';

@Component({
  selector: 'app-mariage',
  templateUrl: './mariage.component.html',
  styleUrls: ['./mariage.component.scss']
})
export class MariageComponent implements OnInit {
  constructor(private service: NouveautéService, 
    private siteService: ApiService, 
    private route: ActivatedRoute, 
    private router: Router, 
    public dialog: MatDialog,
    private dateTimeService: DateTimeService, 
    private notificationService: NotificationService,
    private mariageService: MariageService){}

    mariages: Mariage[];
Nouveautes!: Nouveauté[];
nouveaute: Nouveauté = new Nouveauté();
Site: Site[];
sites!: Site[];
formTitle: string = '';
buttonLabel: string = '';
lengthNouv: number;
isLoading: boolean;
displayedColumns: string[] = ['titre', 'date', 'description', 'action'];
dataSource!: MatTableDataSource<Mariage>;
siteId=0;
selectedSite: Site;
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;


ngOnInit() : void{
this.getMariages();
this.onResetAllFilters();
}

openDialog() {
const dialogRef = this.dialog.open(DialogMariageComponent, {
});

dialogRef.afterClosed().subscribe(result => {
if(result === "ajouter"){
this.getMariages();
}
});
}

getMariages(){
  this.mariageService.GetMariages().subscribe(mariages => {
    this.dataSource = new MatTableDataSource(mariages);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  });
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
    this.getMariages();
    this.notificationService.success('News deleted successfully');
  },
  () => {
    this.notificationService.danger('Delete News failed');
  }
);
}
});
}



onSortData(sort) {
this.mariageService.mariageRequest.next(sort);
}
updateNouveaute(row: any) {
this.dialog.open(DialogNouveauteComponent, {
data: row,
}).afterClosed().subscribe(result=>{
if(result === "modifier"){
this.getMariages();
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
this.getMariages();
this.onSearchClick(); // lancement d'une nouvelle recherche
}


}
