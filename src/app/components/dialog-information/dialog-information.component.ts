import { Component, Inject, OnInit } from '@angular/core';
import * as myScript from '../../../assets/js/cardInformation.js';
import { Evenement } from 'app/models/shared/evenement.model';
import { Nouveauté } from 'app/models/shared/nouveauté.model';
import { EvenementService } from 'app/services/shared/evenement.service';
import { NouveautéService } from 'app/services/shared/nouveauté.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';
import Swiper from 'swiper';

import Isotope from 'isotope-layout';

@Component({
  selector: 'app-dialog-information',
  templateUrl: './dialog-information.component.html',
  styleUrls: ['./dialog-information.component.scss']
})
export class DialogInformationComponent implements OnInit {

  evenement: Evenement;
  evenements: Evenement[];
  nouveauté: Nouveauté;
  nouveautés: Nouveauté[];
  
  constructor(private eventService: EvenementService,
              private nouvService: NouveautéService,
              private dialogRef: MatDialogRef<DialogInformationComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              private route: ActivatedRoute,) { }

  ngOnInit(): void {
    myScript.Information();
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getEvenement(id);
    });
    const select = (el, all = false) => {
      el = el.trim()
      if (all) {
        return Array.from(document.querySelectorAll(el))
  
      } else {
        return document.querySelector(el)
      }
    }

    let heroCarouselIndicators = select("#hero-carousel-indicators")
    let heroCarouselItems = select('#dialogHeroCarousel .carousel-item', true)
  
    heroCarouselItems.forEach((item, index) => {
      (index === 0) ?
      heroCarouselIndicators.innerHTML += "<li data-bs-target='#dialogHeroCarousel' data-bs-slide-to='" + index + "' class='active'></li>":
        heroCarouselIndicators.innerHTML += "<li data-bs-target='#dialogHeroCarousel' data-bs-slide-to='" + index + "'></li>"
    });

  }

  getEvenement(id: number) {
    this.eventService.GetEvenement(id).subscribe(data => {
      this.evenement = data;
    });
  }

  close() {
    this.dialogRef.close();
  }


}
