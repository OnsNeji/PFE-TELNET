import { trigger, transition, style, animate, state } from '@angular/animations';


export const expandCollapse = trigger('expandCollapse', [
  state('*', style({
    // 'overflow': 'hidden',
    'height': '*',
    'opacity': 1,
    // 'width' : '*',
  })),
  state('void', style({
    'height': '0',
    'opacity': 0,
    // 'width' : '0',
    'overflow': 'hidden'
  })),
  transition('* => void', animate('300ms ease-out')),
  transition('void => *', animate('300ms ease-in'))
]);

