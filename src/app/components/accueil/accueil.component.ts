import { Component, OnInit, AfterViewInit } from '@angular/core';
import '../../../assets/vendor/animate.css/animate.min.css';
import '../../../assets/vendor/bootstrap/css/bootstrap.min.css';
import '../../../assets/vendor/bootstrap-icons/bootstrap-icons.css';
import '../../../assets/vendor/boxicons/css/boxicons.min.css';
import '../../../assets/vendor/glightbox/css/glightbox.min.css';
import '../../../assets/vendor/swiper/swiper-bundle.min.css';
import "../../../assets/vendor/bootstrap/js/bootstrap.bundle.min.js";
import "../../../assets/vendor/glightbox/js/glightbox.min.js";
import "../../../assets/vendor/swiper/swiper-bundle.min.js";
import "../../../assets/vendor/isotope-layout/isotope.pkgd.min.js";
import 'jquery';
import 'bootstrap';
import GLightbox from 'glightbox';

import 'isotope-layout';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import 'swiper/swiper-bundle.min.css';

SwiperCore.use([Navigation, Pagination]);

import Swiper from 'swiper';
import 'swiper/swiper-bundle.min.css';
import Isotope from 'isotope-layout';
import { Evenement } from 'app/models/shared/evenement.model';
import { MediaEvent } from 'app/models/shared/mediaEvent.model';
import { EvenementService } from 'app/services/shared/evenement.service';
import { MediaEventService } from 'app/services/shared/media-event.service';




@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class AccueilComponent implements OnInit {
  evenements: Evenement[] = [];
  mediaEvents: MediaEvent[];
  evenement: Evenement = new Evenement();
  mediaEvent : MediaEvent = new MediaEvent();
  id: number;

  constructor(private service: EvenementService, private mediaService: MediaEventService) { }

  ngOnInit(): void {
    
    this.service.GetEvenements().subscribe(
      data => {
        this.evenements = data;
      },
      error => {
        console.error(error);
      }
    );
  }

}
