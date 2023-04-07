import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Site } from 'app/models/shared/site.model';
import { ApiService } from 'app/services/shared/api.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss']
})
export class AgendaComponent implements OnInit {

  site: Site;

  constructor(private route: ActivatedRoute, private siteService: ApiService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getSiteById(id);
    });
  }

  getSiteById(id: number) {
    this.siteService.GetSite(id).subscribe(data => {
      this.site = data;
    });
  }

}
