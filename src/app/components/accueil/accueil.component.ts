import { Component, OnInit, Injector} from '@angular/core';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';
import Swiper from 'swiper';

import Isotope from 'isotope-layout';
import { Evenement } from 'app/models/shared/evenement.model';
import { MediaEvent } from 'app/models/shared/mediaEvent.model';
import { EvenementService } from 'app/services/shared/evenement.service';
import { EmployéMois } from 'app/models/shared/employeMois.model';
import { ApiService } from 'app/services/shared/api.service';
import { EmployeMoisService } from 'app/services/shared/employe-mois.service';
import { Utilisateur } from 'app/models/shared/utilisateur.model';
import { Convention } from 'app/models/shared/convention.model';
import { ConventionService } from 'app/services/shared/convention.service';
import * as FileSaver from 'file-saver';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { NouveautéService } from 'app/services/shared/nouveauté.service';
import { Nouveauté } from 'app/models/shared/nouveauté.model';
import { MariageNaissanceService } from 'app/services/shared/mariageNaissance.service';
import { MariageNaissance } from 'app/models/shared/mariageNaissance.model';
import { ProjectSuccess } from 'app/models/shared/projectSuccess.model';
import { ProjectSuccessService } from 'app/services/shared/project-success.service';
import { Projet } from 'app/models/shared/projet.model';
import { ProjetService } from 'app/services/shared/projet.service';
import { Site } from 'app/models/shared/site.model';
import { Router } from '@angular/router';
import { UserCardComponent } from '../user-card/user-card.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogInformationComponent } from '../dialog-information/dialog-information.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from 'app/services/shared';
import * as myScript from '../../../assets/js/accueil.js';
import { SearchComponent } from './search/search.component';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {

  nouveautes: Nouveauté[] = [];
  nouveaute: Nouveauté = new Nouveauté();
  sites: Site[] = [];
  site: Site = new Site();
  evenement: Evenement = new Evenement();
  evenements: Evenement[] = [];
  latestEvenements: Evenement[];
  latestNouveautes: Nouveauté[];
  MariageNaissances: MariageNaissance[] = [];
  MariageNaissance: MariageNaissance = new MariageNaissance();
  projectSuccesses: ProjectSuccess[] = [];
  projectSuccess: ProjectSuccess;
  projets: Projet[];
  latestEmployee: EmployéMois;
  utilisateurs!: Utilisateur[];
  conventions!: Convention[];
  selectedConventionIndex: number = 0;
  latestUtilisateurs!: Utilisateur[];
  anniversaires!: Utilisateur[];
  id: number;
  type: string
  private jwtHelper = new JwtHelperService();
  authenticationService: AuthenticationService;
  searchTerm: string;
  employees: Utilisateur[];

  constructor(private service: EvenementService, 
              private siteService: ApiService,
              private userService: ApiService,
              private nouvService: NouveautéService,
              private employeMoisService: EmployeMoisService, 
              private projectSuccessService: ProjectSuccessService,
              private projetService: ProjetService,
              private apiService: ApiService,
              private convService: ConventionService,
              private MNService: MariageNaissanceService,
              private router: Router,
              public dialog: MatDialog,
              injector: Injector, ) {
                this.authenticationService = injector.get<AuthenticationService>(AuthenticationService);
              }

  ngOnInit(): void {
    myScript.Accueil();
    this.getNouveautes();
    this.getEvenements();
    this.getEmployéMois();
    this.getProjectSuccesses();
    this.getProjets();
    this.getUtilisateurs();
    this.getConventions();
    this.getLatestUtilisateurs();
    this.getAnniversaires();
    this.getMariageNaissances();
    this.getSites();

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.id = decodedToken.nameid;  
      console.log(this.id);
    }
  }

  search(): void {
    if (this.searchTerm) {
      this.userService.SearchEmployees(this.searchTerm)
        .subscribe(
          (data) => {
            this.employees = data;
            console.log(this.employees);
          },
          (error) => {
            console.log('An error occurred while searching employees.');
          }
        );
    } else {
      this.employees = [];
    }
  }

  openSearchDialog(): void {
    const dialogRef = this.dialog.open(SearchComponent, {
      width: '800px',
      data: this.employees
    });
  }

  searchAndOpenDialog(): void {
    if (this.searchTerm) {
      this.userService.SearchEmployees(this.searchTerm)
        .subscribe(
          (data) => {
            this.employees = data;
            console.log(this.employees);
            this.openSearchDialog();
          },
          (error) => {
            console.log('An error occurred while searching employees.');
          }
        );
    } else {
      this.employees = [];
      this.openSearchDialog();
    }
  }

  
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/auth/login']);
  }

  selectConvention(index: number): void {
    this.selectedConventionIndex = index;
  }
  getNouveautes(){
    this.nouvService.getLatestNouveautés().subscribe(
      data => {
        this.latestNouveautes = data;
        this.latestNouveautes.sort((a, b) => new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime());
        console.log(this.nouveautes);
      },
      error => {
        console.error(error);
      }
    );
  }
  getEvenements(){
    this.service.getLatestEvenements().subscribe(
      data => {
        this.latestEvenements = data;
        this.latestEvenements.sort((a, b) => new Date(b.dateEvent).getTime() - new Date(a.dateEvent).getTime());
      },
      error => {
        console.error(error);
      }
    );
  }

  getEmployéMois(){
    this.employeMoisService.GetEmployesMois().subscribe(
      (data: EmployéMois[]) => {
        if (data.length > 0) {
          this.latestEmployee = data[data.length - 1];
          console.log(data);
        }
      },
      error => console.log(error)
    );
  }

  getProjectSuccesses() {
    this.projectSuccessService.getLatestProjectSuccess().subscribe(
      data => {
        // Triez les données par ID dans l'ordre décroissant
        const sortedData = data.sort((a, b) => b.id - a.id);
        // Récupérez les 5 derniers projets succès
        this.projectSuccesses = sortedData;
        console.log(this.projectSuccesses);
      },
      error => {
        console.error(error);
      }
    );
  }
  
  getImageUrl(base64String: string): string {
    if (base64String.startsWith('data:image/jpeg')) {
      return base64String;
    } else if (base64String.startsWith('data:image/png')) {
      return base64String;
    } else {
      return 'data:image/jpeg;base64,' + base64String;
    }
  }
  

  getProjets(){
    this.projetService.GetProjets().subscribe(projets => {
      this.projets = projets;
    });
  }

  getProjetNom(id: number): string {
    const projet = this.projets.find(s => s.id === id);
    return projet ? (projet.nom) : '';
  }

  getUtilisateurs(): void {
    this.apiService.GetUtilisateurs().subscribe(utilisateurs => {
      this.utilisateurs = utilisateurs;
    });
  }

  getUtilisateurNom(id: number): string {
    const utilisateur = this.utilisateurs.find(s => s.id === id);
    return utilisateur ? (utilisateur.nom + ' ' + utilisateur.prenom) : '';
  }
  
  getConventions(){
    this.convService.GetConventionsActives().subscribe(data => {
      this.conventions = data;
    })
  }

  getMariageNaissances(){
    this.MNService.GetMariageNaissances().subscribe(data => {
      this.MariageNaissances = data;
      this.MariageNaissances.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      console.log(data);
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

  getLatestUtilisateurs(): void{
    this.apiService.getLatestUtilisateurs().subscribe(utilisateurs => {
      this.latestUtilisateurs = utilisateurs;
      this.latestUtilisateurs.sort((a, b) => new Date(b.dateEmbauche).getTime() - new Date(a.dateEmbauche).getTime());
    })
  }

  getAnniversaires(): void{
    this.apiService.getAnniversaires().subscribe(data => {
      this.anniversaires = data;
      console.log(this.anniversaires)
    })
  }

  getSites(){
    this.siteService.GetSites().subscribe(data => {
      this.sites = data;
    })
  }

  agenda(id: string) {
    this.router.navigate(['/agenda', id]);
  }


  getUserDetails(id: number) {
    this.apiService.GetUtilisateur(id).subscribe(
      (data) => {
        const dialogRef = this.dialog.open(UserCardComponent, {
          data: data,
        });
        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTypeDetails(type: string, id: number) {
    this.type = type;
    if (type === 'evenement') {
        this.service.GetEvenement(id).subscribe(
          (data) => {
            const dialogRef = this.dialog.open(DialogInformationComponent, {
              data: {
                ...data,
                type: type
              }
            });
            console.log(data);
          }
        );
      
    } else if (type === 'nouveaute') {
        this.nouvService.GetNouveauté(id).subscribe(
          (data) => {
            const dialogRef = this.dialog.open(DialogInformationComponent, {
              data: {
                ...data,
                type: type
              }
            });
            console.log(data);
          }
        );
      
    }
  }
  
  
  
  
}
