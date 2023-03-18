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
        state: 'human-resources',
        name: 'Human Resources',
        type: 'sub',
        icon: 'icon-user',
        children: [       
          {
            state: 'work-from-home',
            name: 'Work From Home',
            type: 'sub',
            icon: 'icon-user',
            function: Functions.WorkFromHome,
            children: [
              {
                state: 'work-from-home',
                name: 'Requests',
                target: true,
                function: Functions.WorkFromHome
              }
            ]
          }
        ]
      },
      {
        state: 'project-management',
        name: 'Project Management',
        type: 'sub',
        icon: 'icon-briefcase',
        children: [
          {
            state: 'project',
            name: 'Project',
            type: 'sub',
            icon: 'icon-briefcase',
            function: Functions.Project,
            children: [
              {
                state: 'references',
                name: 'References',
                target: true,
                function: Functions.References
              }
            ]
          }
        ]
      }
    ]
  }
];

@Injectable()
export class MenuItems {

  constructor(private authenticationService: AuthenticationService) {
  }

  getAll(): Menu[] {
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
