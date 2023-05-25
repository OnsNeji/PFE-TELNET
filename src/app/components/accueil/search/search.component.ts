import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Departement } from 'app/models/shared/departement.model';
import { Site } from 'app/models/shared/site.model';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { ApiService } from 'app/services/shared/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  employees: Utilisateur[];
  ListeUser!: Utilisateur[];
  departements!: Departement[];
  sites!: Site[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: Utilisateur[],
              private dialogRef: MatDialogRef<SearchComponent>, 
              private service: ApiService, ) {
    this.employees = data;
  }

  displayedColumns: string[] = ['image', 'nom && prenom', 'matricule', 'role', 'departementId'];
  dataSource: MatTableDataSource<Utilisateur>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Utilisateur>(this.employees);
    this.getDépartements();
  }

  onSortData(sort) {
    this.service.userRequest.next(sort);
  }

  getDépartements(): void {
    this.service.GetDepartements().subscribe(departements => {
      this.departements = departements;
    });
  }
  getDepNom(id: number): string {
    const dep = this.departements.find(s => s.id === id);
    return dep ? dep.nom : '';
  }

  getNomSite(departementId: number): string {
    const departement = this.departements.find(d => d.id === departementId);
    if (departement) {
      const site = this.sites.find(s => s.id === departement.siteId);
      if (site) {
        return site.site;
      }
    }
    return '';
  }

  close() {
    this.dialogRef.close();
  }
}
