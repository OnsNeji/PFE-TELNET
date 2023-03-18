import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';
import { MenuItems } from 'app/shared/menu-items/menu-items';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'environments/environment';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LockScreenComponent } from 'app/components/auth/lock-screen/lock-screen.component';
import { ExpirationSessionComponent } from 'app/components/auth/expiration-session/expiration-session.component';
import { ChangePasswordComponent } from 'app/components/auth/change-password/change-password.component';
import { AuthenticationService, DateTimeService, NotificationService } from 'app/services/shared';
import { User } from 'app/models/shared';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';

declare var require: any;
const FileSaver = require('file-saver');

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [
    trigger('notificationBottom', [
      state('an-off, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('an-animate',
        style({
          overflow: 'hidden',
          height: AUTO_STYLE,
        })
      ),
      transition('an-off <=> an-animate', [
        animate('400ms ease-in-out')
      ])
    ]),
    trigger('slideInOut', [
      state('in', style({
        width: '300px',
        // transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        width: '0',
        // transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
    trigger('mobileHeaderNavRight', [
      state('nav-off, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('nav-on',
        style({
          height: AUTO_STYLE,
        })
      ),
      transition('nav-off <=> nav-on', [
        animate('400ms ease-in-out')
      ])
    ]),
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translate(0)' }),
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('mobileMenuTop', [
      state('no-block, void',
        style({
          overflow: 'hidden',
          height: '0px',
        })
      ),
      state('yes-block',
        style({
          height: AUTO_STYLE,
        })
      ),
      transition('no-block <=> yes-block', [
        animate('400ms ease-in-out')
      ])
    ])
  ]
})

export class AdminComponent implements OnInit, OnDestroy {

  displayEditdialogRef: MatDialogRef<ChangePasswordComponent>;

  dialog: MatDialog;
  authenticationService: AuthenticationService;
  notificationService: NotificationService;
  dateTimeService: DateTimeService;
  menuItems: MenuItems;
  idle: Idle;
  keepalive: Keepalive;
  router: Router;
  location: Location;

  imgUrl: string;

  constructor(injector: Injector,
    private cookieService: CookieService) {
    this.dialog = injector.get<MatDialog>(MatDialog);
    this.authenticationService = injector.get<AuthenticationService>(AuthenticationService);
    this.notificationService = injector.get<NotificationService>(NotificationService);
    this.dateTimeService = injector.get<DateTimeService>(DateTimeService);
    this.menuItems = injector.get<MenuItems>(MenuItems);
    this.idle = injector.get<Idle>(Idle);
    this.keepalive = injector.get<Keepalive>(Keepalive);
    this.router = injector.get<Router>(Router);
    this.location = injector.get<Location>(Location);

    this.currentUser = Object.assign(new User, JSON.parse(localStorage.getItem('currentUser')));
    this.imgUrl = this.currentUser.image ? 'data:image/png;base64,' + this.currentUser.image : 'assets/images/avatar.png';
    this.navType = 'st1';
    this.themeLayout = 'vertical';
    this.verticalPlacement = 'left';
    this.verticalLayout = 'wide';
    this.pcodedDeviceType = 'desktop';
    this.verticalNavType = 'expanded';
    this.verticalEffect = 'shrink';
    this.vnavigationView = 'view1';
    this.freamType = 'theme1';
    this.sidebarImg = 'false';
    this.sidebarImgType = 'img1';
    this.layoutType = 'light'; // light(default) dark(dark)

    this.headerTheme = 'theme1'; // theme1(default)
    this.pcodedHeaderPosition = 'fixed';

    this.headerFixedTop = 'auto';

    this.liveNotification = 'an-off';
    this.profileNotification = 'an-off';

    this.chatSlideInOut = 'out';
    this.innerChatSlideInOut = 'out';

    this.searchWidth = 0;

    this.navRight = 'nav-on';

    this.windowWidth = window.innerWidth;
    this.setHeaderAttributes(this.windowWidth);

    this.toggleOn = true;
    this.navBarTheme = 'themelight1'; // themelight1(default) theme1(dark)
    this.activeItemTheme = 'theme1';
    this.pcodedSidebarPosition = 'fixed';
    this.menuTitleTheme = 'theme1'; // theme1(default) theme10(dark)
    this.dropDownIcon = 'style1';
    this.subItemIcon = 'style7';

    this.displayBoxLayout = 'd-none';
    this.isVerticalLayoutChecked = false;
    this.isSidebarChecked = true;
    this.isHeaderChecked = true;
    this.headerFixedMargin = '56px';
    this.sidebarFixedHeight = 'calc(100vh - 236px)'; // calc(100vh - 236px)
    this.itemBorderStyle = 'none';
    this.subItemBorder = true;
    this.itemBorder = true;

    this.isCollapsedSideBar = 'no-block';

    this.setMenuAttributes(this.windowWidth);
    this.setHeaderAttributes(this.windowWidth);
  }

  public navType: string;
  public themeLayout: string;
  public verticalPlacement: string;
  public verticalLayout: string;
  public pcodedDeviceType: string;
  public verticalNavType: string;
  public verticalEffect: string;
  public vnavigationView: string;
  public freamType: string;
  public sidebarImg: string;
  public sidebarImgType: string;
  public layoutType: string;

  public headerTheme: string;
  public pcodedHeaderPosition: string;

  public liveNotification: string;
  public liveNotificationClass: string;

  public profileNotification: string;
  public profileNotificationClass: string;

  public chatSlideInOut: string;
  public innerChatSlideInOut: string;

  public searchWidth: number;
  public searchWidthString: string;

  public navRight: string;
  public windowWidth: number;
  public chatTopPosition: string;

  public toggleOn: boolean;
  public navBarTheme: string;
  public activeItemTheme: string;
  public pcodedSidebarPosition: string;

  public headerFixedTop: string;

  public menuTitleTheme: string;
  public dropDownIcon: string;
  public subItemIcon: string;

  public configOpenRightBar: string;
  public displayBoxLayout: string;
  public isVerticalLayoutChecked: boolean;
  public isSidebarChecked: boolean;
  public isHeaderChecked: boolean;
  public headerFixedMargin: string;
  public sidebarFixedHeight: string;
  public sidebarFixedNavHeight: string;
  public itemBorderStyle: string;
  public subItemBorder: boolean;
  public itemBorder: boolean;

  public isCollapsedSideBar: string;
  public psDisabled: string;

  public config: any;
  public currentUser: User = new User;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  idlestart = false;
  inactivityTimeoutPeriode = environment.inactivityTimeoutPeriode;
  inactivityTimeoutPing = environment.inactivityTimeoutPing;
  DialogExpirationSessionOpened = false;
  DialogLockScreenOpened = false;
  checkCurrentUserInterval: any;

  private jwtHelper = new JwtHelperService();
  private id: string = '';
  public prenom: string = '';

  scroll = (): void => {
    const scrollPosition = window.pageYOffset;
    if (scrollPosition > 56) {
      if (this.isSidebarChecked === true) {
        this.pcodedSidebarPosition = 'fixed';
      }
      this.headerFixedTop = '0';
      this.sidebarFixedNavHeight = '100%';
    } else {
      this.headerFixedTop = 'auto';
      this.pcodedSidebarPosition = 'absolute';
      this.sidebarFixedNavHeight = '';
    }
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.id = decodedToken.nameid;
      this.prenom = decodedToken.unique_name;
    }

    this.Inactive();
    this.reset();
    if (this.authenticationService.isAuthenticatedButTokenExpired()) {
      this.authenticationService.resetProfile();
    }

    const timeBeforeSessionExpiration = environment.timeBeforeSessionExpiration;
    const sessionExpiresIn = new Date(localStorage.getItem('expires_in'));
    const sessionDuration = this.dateTimeService.getDiff(sessionExpiresIn, new Date(Date.now()));

    setTimeout(() => {
      this.logout();
    }, sessionDuration - timeBeforeSessionExpiration);

    if (JSON.parse(sessionStorage.getItem('DialogExpirationSessionOpened')) === true) {
      if (!this.DialogExpirationSessionOpened) {
        setTimeout(() => {
          this.openDialogLockScreen();
        });
      }
    }

    this.checkCurrentUserInterval = setInterval(() => {
      this.checkCurrentUser();
      // Check Time Zone
    }, 1000);

    const passwordStrength = this.cookieService.get('passwordStrength');
    if (passwordStrength === 'Week') {
      this.notificationService.danger('Your password is not secure. It should be at least 10 characters long, contain letters and numbers and special characters. You should change it and reconnect.');
      setTimeout(() => {
        this.changePassword();
      });
    }
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }

  checkTimeZone() {
    const localTimeString = new Date().toTimeString().slice(9);
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localTimeZoneOffSet = new Date().getTimezoneOffset() / -60;

    if (localTimeString !== 'GMT+0100 (heure normale d’Afrique de l’Ouest)' &&
      localTimeZone !== 'Africa/Lagos' && localTimeZoneOffSet !== 1) {
      clearTimeout(this.checkCurrentUserInterval);
      this.notificationService.danger('You should set your TimeZone to GMT+1 West Africa and restart your browser.');
    }
  }

  checkCurrentUser() {
    const localStorageUser = Object.assign(new User, JSON.parse(localStorage.getItem('currentUser')));
    if (localStorageUser.userId === undefined) {
      clearTimeout(this.checkCurrentUserInterval);
    } else if (localStorageUser.userId !== this.currentUser.id) {
      this.currentUser = Object.assign(new User, JSON.parse(localStorage.getItem('currentUser')));
      this.imgUrl = this.currentUser.image ? 'data:image/png;base64,' + this.currentUser.image : 'assets/images/avatar.png';
      this.router.navigate(['/dashboard']);
    }
  }

  // getAsideItemLength(asideItem): number {
  //   // let itemsVisibleCount = 0;
  //   // asideItem.children.forEach(chidren => {
  //   //   if (!(this.currentUser === null || this.currentUser === undefined)
  //   //     && !(this.currentUser.functionsId === null || this.currentUser.functionsId === undefined)) {
  //   //     if (this.currentUser.functionsId.indexOf(chidren.function) !== -1) {
  //   //       itemsVisibleCount++;
  //   //     }
  //   //   }
  //   // });
  //   return itemsVisibleCount;
  // }

  onResize(event) {
    this.windowWidth = event.target.innerWidth;
    this.setHeaderAttributes(this.windowWidth);

    let reSizeFlag = true;
    if ((this.pcodedDeviceType === 'tablet' && this.windowWidth >= 768 && this.windowWidth <= 1024) ||
      (this.pcodedDeviceType === 'mobile' && this.windowWidth < 768)) {
      reSizeFlag = false;
    }
    /* for check device */
    if (reSizeFlag) {
      this.setMenuAttributes(this.windowWidth);
    }
  }

  setHeaderAttributes(windowWidth) {
    if (windowWidth < 992) {
      this.navRight = 'nav-off';
    } else {
      this.navRight = 'nav-on';
    }
  }

  setMenuAttributes(windowWidth) {
    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.pcodedDeviceType = 'tablet';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'overlay';
    } else if (windowWidth < 768) {
      this.pcodedDeviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'overlay';
    } else {
      this.pcodedDeviceType = 'desktop';
      this.verticalNavType = 'expanded';
      this.verticalEffect = 'shrink';
    }
  }

  toggleHeaderNavRight() {
    this.navRight = this.navRight === 'nav-on' ? 'nav-off' : 'nav-on';
    this.chatTopPosition = this.chatTopPosition === 'nav-on' ? '112px' : '';
    if (this.navRight === 'nav-off' && this.innerChatSlideInOut === 'in') {
      this.toggleInnerChat();
    }
    if (this.navRight === 'nav-off' && this.chatSlideInOut === 'in') {
      this.toggleChat();
    }
  }

  toggleLiveNotification() {
    this.liveNotification = this.liveNotification === 'an-off' ? 'an-animate' : 'an-off';
    this.liveNotificationClass = this.liveNotification === 'an-animate' ? 'active' : '';

    if (this.liveNotification === 'an-animate' && this.innerChatSlideInOut === 'in') {
      this.toggleInnerChat();
    }
    if (this.liveNotification === 'an-animate' && this.chatSlideInOut === 'in') {
      this.toggleChat();
    }
  }

  toggleProfileNotification() {
    this.profileNotification = this.profileNotification === 'an-off' ? 'an-animate' : 'an-off';
    this.profileNotificationClass = this.profileNotification === 'an-animate' ? 'active' : '';

    if (this.profileNotification === 'an-animate' && this.innerChatSlideInOut === 'in') {
      this.toggleInnerChat();
    }
    if (this.profileNotification === 'an-animate' && this.chatSlideInOut === 'in') {
      this.toggleChat();
    }
  }

  notificationOutsideClick(ele: string) {
    if (ele === 'live' && this.liveNotification === 'an-animate') {
      this.toggleLiveNotification();
    } else if (ele === 'profile' && this.profileNotification === 'an-animate') {
      this.toggleProfileNotification();
    }
  }

  toggleChat() {
    this.chatSlideInOut = this.chatSlideInOut === 'out' ? 'in' : 'out';
    if (this.innerChatSlideInOut === 'in') {
      this.innerChatSlideInOut = 'out';
    }
  }

  toggleInnerChat() {
    this.innerChatSlideInOut = this.innerChatSlideInOut === 'out' ? 'in' : 'out';
  }

  searchOn() {
    document.querySelector('#main-search').classList.add('open');
    const searchInterval = setInterval(() => {
      if (this.searchWidth >= 200) {
        clearInterval(searchInterval);
        return false;
      }
      this.searchWidth = this.searchWidth + 15;
      this.searchWidthString = this.searchWidth + 'px';
    }, 35);
  }

  searchOff() {
    const searchInterval = setInterval(() => {
      if (this.searchWidth <= 0) {
        document.querySelector('#main-search').classList.remove('open');
        clearInterval(searchInterval);
        return false;
      }
      this.searchWidth = this.searchWidth - 15;
      this.searchWidthString = this.searchWidth + 'px';
    }, 35);
  }

  toggleOpened() {
    if (this.windowWidth < 992) {
      this.toggleOn = this.verticalNavType === 'offcanvas' ? true : this.toggleOn;
      if (this.navRight === 'nav-on') {
        this.toggleHeaderNavRight();
      }
    }
    this.verticalNavType = this.verticalNavType === 'expanded' ? 'offcanvas' : 'expanded';
  }

  onClickedOutsideSidebar(e: Event) {
    if ((this.windowWidth < 992 && this.toggleOn && this.verticalNavType !== 'offcanvas') || this.verticalEffect === 'overlay') {
      this.toggleOn = true;
      this.verticalNavType = 'offcanvas';
    }
  }

  toggleRightbar() {
    this.configOpenRightBar = this.configOpenRightBar === 'open' ? '' : 'open';
  }

  setNavBarTheme(theme: string) {
    if (theme === 'themelight1') {
      this.navBarTheme = 'themelight1';
      this.menuTitleTheme = 'theme1';
      this.sidebarImg = 'false';
    } else {
      this.menuTitleTheme = 'theme9';
      this.navBarTheme = 'theme1';
      this.sidebarImg = 'false';
    }
  }

  setLayoutType(type: string) {
    if (type === 'dark') {
      this.layoutType = type;
      this.headerTheme = 'theme6';
      this.sidebarImg = 'false';
      this.navBarTheme = 'theme1';
      this.menuTitleTheme = 'theme9';
      this.freamType = 'theme6';
      document.querySelector('body').classList.add('dark');
      this.setBackgroundPattern('theme6');
      this.activeItemTheme = 'theme1';
    } else if (type === 'light') {
      this.layoutType = type;
      this.sidebarImg = 'false';
      this.headerTheme = 'theme1';
      this.navBarTheme = 'themelight1';
      this.menuTitleTheme = 'theme1';
      this.freamType = 'theme1';
      document.querySelector('body').classList.remove('dark');
      this.setBackgroundPattern('theme1');
      this.activeItemTheme = 'theme1';
    } else if (type === 'img') {
      this.sidebarImg = 'true';
      this.navBarTheme = 'themelight1';
      this.menuTitleTheme = 'theme1';
      this.freamType = 'theme1';
      document.querySelector('body').classList.remove('dark');
      this.setBackgroundPattern('theme1');
      this.activeItemTheme = 'theme1';
    }
  }

  setVerticalLayout() {
    this.isVerticalLayoutChecked = !this.isVerticalLayoutChecked;
    if (this.isVerticalLayoutChecked) {
      this.verticalLayout = 'box';
      this.displayBoxLayout = '';
    } else {
      this.verticalLayout = 'wide';
      this.displayBoxLayout = 'd-none';
    }
  }

  setBackgroundPattern(pattern: string) {
    document.querySelector('body').setAttribute('themebg-pattern', pattern);
  }

  setSidebarPosition() {
    this.isSidebarChecked = !this.isSidebarChecked;
    this.pcodedSidebarPosition = this.isSidebarChecked === true ? 'fixed' : 'absolute';
    this.sidebarFixedHeight = this.isSidebarChecked === true ? 'calc(100vh - 236px)' : 'calc(100vh + 236px)';
  }

  setHeaderPosition() {
    this.isHeaderChecked = !this.isHeaderChecked;
    this.pcodedHeaderPosition = this.isHeaderChecked === true ? 'fixed' : 'relative';
    this.headerFixedMargin = this.isHeaderChecked === true ? '56px' : '';
    if (this.isHeaderChecked === false) {
      window.addEventListener('scroll', this.scroll, true);
      window.scrollTo(0, 0);
    } else {
      window.removeEventListener('scroll', this.scroll, true);
      this.headerFixedTop = 'auto';
      this.pcodedSidebarPosition = 'fixed';
      this.sidebarFixedHeight = this.isSidebarChecked === true ? 'calc(100vh - 292px)' : 'calc(100vh + 292px)';
    }
  }

  toggleOpenedSidebar() {
    this.isCollapsedSideBar = this.isCollapsedSideBar === 'yes-block' ? 'no-block' : 'yes-block';
    this.sidebarFixedHeight = this.isCollapsedSideBar === 'yes-block' ? 'calc(100vh - 353px)' : 'calc(100vh - 236px)';
  }

  lockScreen() {
    sessionStorage.setItem('DialogExpirationSessionOpened', 'true');
    this.openDialogLockScreen();
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
    this.DialogLockScreenOpened = false;
  }

  openDialogExpirationSession(): void {
    this.DialogExpirationSessionOpened = true;
    const dialogRef = this.dialog.open(ExpirationSessionComponent, {
      width: '250px',
      data: {}
    });
    dialogRef.afterClosed()
      .subscribe(() => {
        this.DialogExpirationSessionOpened = false;
      });
  }

  openDialogLockScreen(): void {
    this.DialogLockScreenOpened = true;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.hasBackdrop = true;

    const dialogRef = this.dialog.open(LockScreenComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe(() => {
      this.dialog.closeAll();
    });
    dialogRef.afterClosed().subscribe(() => {
      this.reset();
    });
  }

  Inactive() {
    // sets an idle timeout of 5 seconds, for testing purposes.
    this.idle.setIdle(this.inactivityTimeoutPing);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(this.inactivityTimeoutPeriode);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onTimeout.subscribe(() => {
      const currentPath = this.location.path();
      if (currentPath.search('/auth/login') === -1) {
        this.idleState = 'Timed out!';
        if (!this.DialogExpirationSessionOpened) {
          sessionStorage.setItem('DialogExpirationSessionOpened', 'true');
          this.openDialogLockScreen();
        }
        this.timedOut = true;
      }
    });

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!';
    });

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);

    this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/auth/login']);
  }

  editProfile() {
    this.router.navigate(['/profil', this.id]);
  }

  changePassword() {
    const config: MatDialogConfig = {
      disableClose: false,
      panelClass: 'form_modal',
      width: '400px',
      height: '460px',
      hasBackdrop: true,
      autoFocus: true
    };
    this.displayEditdialogRef = this.dialog.open(ChangePasswordComponent, config);
  }

  feedback() {
    // do nothing
  }

  dialogClose() {
    this.dialog.closeAll();
  }

  convertToDate(countdown: number): Date {
    if (countdown !== undefined) {
      return new Date(countdown * 1000);
    } else {
      return new Date(0);
    }
  }

  downloadUserGuide() {
    const pdfUrl = './assets/docs/MyTelnetTeam - Manuel utilisateur-v1.0.pdf';
    const pdfName = 'User Guide MyTelnetTeam';
    FileSaver.saveAs(pdfUrl, pdfName);
  }
}


