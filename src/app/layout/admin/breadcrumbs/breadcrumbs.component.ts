import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent {
  tempState = [];
  breadcrumbs: Array<Object>;
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = [];
        this.tempState = [];
        let currentRoute = this.route.root,
          url = '';
        do {
          const childrenRoutes = currentRoute.children;
          currentRoute = null;
          childrenRoutes.forEach(routes => {
            if (routes.outlet === 'primary') {
              const routeSnapshot = routes.snapshot;
              url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
              if (routes.snapshot.data.title !== undefined) {
                if (!this.tempState.includes(routes.snapshot.data.title)) {
                  this.tempState.push(routes.snapshot.data.title);
                  this.breadcrumbs.push({
                    label: routes.snapshot.data.title,
                    icon: this.getIcon(routes),
                    caption: this.getCaption(routes),
                    status: this.getStatus(routes),
                    url: url
                  });
                }
              }
              currentRoute = routes;
            }
          });
        } while (currentRoute);
      });
  }

  getStatus(routes: ActivatedRoute): boolean {
    let status = true;
    if (routes.snapshot.data.status !== undefined) {
      status = routes.snapshot.data.status;
    }
    return status;
  }

  getIcon(routes: ActivatedRoute): boolean {
    let icon = false;
    if (routes.snapshot.data.icon !== undefined) {
      icon = routes.snapshot.data.icon;
    }
    return icon;
  }

  getCaption(routes: ActivatedRoute): boolean {
    let caption = false;
    if (routes.snapshot.data.caption !== undefined) {
      caption = routes.snapshot.data.caption;
    }
    return caption;
  }
}
