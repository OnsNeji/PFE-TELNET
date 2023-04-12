import { Component, OnInit, ViewChild} from '@angular/core';
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

  constructor(private service: EvenementService, 
              private siteService: ApiService,
              private nouvService: NouveautéService,
              private employeMoisService: EmployeMoisService, 
              private projectSuccessService: ProjectSuccessService,
              private projetService: ProjetService,
              private apiService: ApiService,
              private convService: ConventionService,
              private MNService: MariageNaissanceService,
              private router: Router,
              public dialog: MatDialog, ) {}

  ngOnInit(): void {

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
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return Array.from(document.querySelectorAll(el))

    } else {
      return document.querySelector(el)
    }
  }
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }
  let selectHeader = select('#header')
  let selectTopbar = select('#topbar')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
        if (selectTopbar) {
          selectTopbar.classList.add('topbar-scrolled')
        }
      } else {
        selectHeader.classList.remove('header-scrolled')
        if (selectTopbar) {
          selectTopbar.classList.remove('topbar-scrolled')
        }
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });
  let heroCarouselIndicators = select("#hero-carousel-indicators")
  let heroCarouselItems = select('#heroCarousel .carousel-item', true)

  heroCarouselItems.forEach((item, index) => {
    (index === 0) ?
    heroCarouselIndicators.innerHTML += "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "' class='active'></li>":
      heroCarouselIndicators.innerHTML += "<li data-bs-target='#heroCarousel' data-bs-slide-to='" + index + "'></li>"
  });
  window.addEventListener('load', () => {
    let menuContainer = select('.menu-container');
    if (menuContainer) {
      let menuIsotope = new Isotope(menuContainer, {
        itemSelector: '.menu-item',
        layoutMode: 'fitRows'
      });

      let menuFilters = select('#menu-flters li', true);

      on('click', '#menu-flters li', function(e) {
        e.preventDefault();
        menuFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        menuIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });

      }, true);
    }

  });
  new Swiper('.events-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });
  const mediaEventsSliders = document.querySelectorAll('.mediaEvents-slider');
    mediaEventsSliders.forEach(mediaEventsSlider => {
  const slider = new Swiper('.mediaEvents-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });
});
new Swiper(".mySwiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
    clickable: true
  }
});
new Swiper(".mySwipeeer", {
  effect: "cards",
  grabCursor: true,
});
  const galleryLightbox = GLightbox({
    selector: '.gallery-lightbox'
  });
  new Swiper('.testimonials-slider', {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });
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

  getProjectSuccesses(){
    this.projectSuccessService.GetProjectSuccesses().subscribe(
      (data: ProjectSuccess[]) => {
        if (data.length > 0) {
          this.projectSuccess = data[data.length - 1];
          console.log(this.projectSuccess);
        }
      },
      error => console.log(error)
    );
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
    this.convService.GetConventions().subscribe(data => {
      this.conventions = data;
    })
  }

  getMariageNaissances(){
    this.MNService.GetMariageNaissances().subscribe(data => {
      this.MariageNaissances = data;
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
  
  
}
