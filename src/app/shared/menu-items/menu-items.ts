import { Injectable } from '@angular/core';
import { Functions } from 'app/models/shared';
import { AuthenticationService } from 'app/services/shared';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string;
  target?: boolean;
  name: string;
  type?: string;
  function?: Functions;
  children?: ChildrenItems[];
}

export interface MainMenuItems {
  state: string;
  short_label?: string;
  main_state?: string;
  target?: boolean;
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  function?: Functions;
  children?: ChildrenItems[];
}

export interface Menu {
  label: string;
  main: MainMenuItems[];
}

const MENUITEMS = [
  {
    label: 'TelnetTeam',
    main: [
      {
            state: 'utilisateur',
            name: 'Employés',
            type: 'sub',
            icon: 'people_outline'
          },
          {
            state: 'site',
            name: 'Sites',
            type: 'sub',
            icon: 'place'
          },
          {
            state: 'departement',
            name: 'Départements',
            type: 'sub',
            icon: 'domain'
          },
          {
            state: 'poste',
            name: 'Postes',
            type: 'sub',
            icon: 'desktop_mac'
          },
          {
            state: 'employeMois',
            name: 'Employé du Mois',
            type: 'sub',
            icon: 'accessibility'
          },
          {
            state: 'mariage-naissance',
            name: 'Mariage & Naissance',
            type: 'sub',
            icon: 'cake'
          },
          {
            state: 'evenement',
            name: 'Evénements',
            type: 'sub',
            icon: 'event'
          },
          {
            state: 'nouveauté',
            name: 'Nouveautés',
            type: 'sub',
            icon: 'insert_comment'
          },
          {
            state: 'project-success',
            name: 'Project Success',
            type: 'sub',
            icon: 'verified_user'
          },
          {
            state: 'convention',
            name: 'Conventions',
            type: 'sub',
            icon: 'description'
          },
          {
            state: 'categorie',
            name: 'Catégories',
            type: 'sub',
            icon: 'toc'
          },
          {
            state: 'demandes',
            name: 'Demandes',
            type: 'sub',
            icon: 'assignment'
          },
          {
            state: 'conges',
            name: 'Congés',
            type: 'sub',
            icon: 'timer_off'
          },

    ]
  }
];

@Injectable()
export class MenuItems {

  constructor(private authenticationService: AuthenticationService) {
  }

  getAll(): Menu[] {
    console.log(MENUITEMS[0].main);

    return MENUITEMS;

  }

  isVisible(functionId) {
    let result = false;
    const profile = this.authenticationService.getProfile();
    // if (!(profile === null || profile === undefined) && !(profile.currentUser === null || profile.currentUser === undefined)
    //   && !(profile.currentUser.functionsId === null || profile.currentUser.functionsId === undefined)) {
    //   result = (profile.currentUser.functionsId.indexOf(functionId) !== -1);
    // }
    return result;
  }
}
