import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Evenement } from 'app/models/shared/evenement.model';
import { MediaEvent } from 'app/models/shared/mediaEvent.model';
import { NotificationService, DateTimeService } from 'app/services/shared';
import { MediaEventService } from 'app/services/shared/media-event.service';
import { DialogEventComponent } from '../dialog-event/dialog-event.component';
import { DialogMediaComponent } from './dialog-media/dialog-media.component';
import swal from 'sweetalert2';
import { EvenementService } from 'app/services/shared/evenement.service';

@Component({
  selector: 'app-media-event',
  templateUrl: './media-event.component.html',
  styleUrls: ['./media-event.component.scss']
})
export class MediaEventComponent implements OnInit {

  constructor(private service: MediaEventService, 
              private route: ActivatedRoute, 
              private router: Router, 
              public dialog: MatDialog, 
              private notificationService: NotificationService, 
              private dateTimeService: DateTimeService,
              private eventService: EvenementService){}

  ListeMedia!: MediaEvent[];
  mediaEvent: MediaEvent = new MediaEvent();
  evenements!: Evenement[];
  displayedColumns: string[] = ['pieceJointe', 'evenementId', 'action'];
  dataSource!: MatTableDataSource<MediaEvent>;
  lengthMedia: number;
  isLoading: boolean;
  date= new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  ngOnInit(): void {
    this.getMediaEvents();
    this.getEvenements();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogMediaComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === "ajouter"){
        this.getMediaEvents();
      }
    });
  }

  getMediaEvents(){
    this.service.GetMediaEvents().subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{

      }
    })
  }

  deleteMediaEvent(id: number): void {
    swal.fire({
      text: `Are you sure to delete this Media Event ?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        this.service.DeleteMediaEvent(id)
          .subscribe(()=>
            {
              this.getMediaEvents();
              this.notificationService.success('Media Event deleted successfully');
            },
            () => {
              this.notificationService.danger('Delete Media Event failed');
            }
          );
      }
    });
  }

  onSortData(sort) {
    this.service.mediaEventRequest.next(sort);
  }

  updateMediaEvent(row: any) {
    this.dialog.open(DialogMediaComponent, {
      data: row,
    }).afterClosed().subscribe(result=>{
      if(result === "modifier"){
        this.getMediaEvents();
      }
    })
    }

    dateOnly(event): boolean {
      return this.dateTimeService.dateOnly(event);
    }

    getEvenements(){
      this.eventService.GetEvenements().subscribe(data => {
        this.evenements = data;
      })
    }
    getEventNom(id: number): string {
      const event = this.evenements.find(s => s.id === id);
      return event ? (event.titre) : '';
    }
    // onClickingEnter(event) {
    //   if (event.key === 'Enter') {
    //     this.onSearchClick();
    //   }
    // }

    // onSearchClick() {
    //   const filterDate = document.getElementById('date') as HTMLInputElement;
    //   const filterDesc = document.getElementById('description') as HTMLInputElement;
    //   const filterTitre = document.getElementById('titre') as HTMLInputElement;
  
    //   const filterTitreValue = filterTitre.value.trim().toLowerCase();
    //   const filterDescValue = filterDesc.value.trim().toLowerCase();
    //   const filterDateValue = filterDate.value.trim().toLowerCase();
  
    //   if (filterTitreValue !== '') {
    //     this.dataSource.filterPredicate = (data: Evenement, filter: string) =>
    //     data.titre.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    //   this.dataSource.filter = filterTitreValue;
    //   }else if (filterDescValue !== '') {
    //     this.dataSource.filterPredicate = (data: Evenement, filter: string) =>
    //     data.description.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    //   this.dataSource.filter = filterDescValue;
    //   }else if (filterDateValue !== '') {
    //     this.dataSource.filterPredicate = (data: Evenement, filter: string) => {
    //       const formattedDate = new Date(data.dateEvent).toLocaleDateString(); // format the date as a string
    //       return formattedDate.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    //     };
    //   this.dataSource.filter = filterDateValue;
    //   }
    // }

    // onResetAllFilters() {
    //   this.evenement.description = ''; // réinitialisation des filtres
    //   this.evenement.titre = ''; 
    //   this.evenement.dateEvent = null; 
    //   this.getEvenements();
    //   this.onSearchClick(); // lancement d'une nouvelle recherche
    // }

}
