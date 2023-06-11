import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from 'app/services/shared';
import { UserStoreService } from 'app/services/shared/user-store.service';

@Injectable()
export class RhGuard implements CanActivate {
    userId = 0;
    role!: string;
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userStore: UserStoreService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      // vérifiez si l'utilisateur a le rôle "Gestionnaire"
      this.userStore.getRoleFromStore().subscribe(val => {
        const roleFromToken = this.authenticationService.getRoleFromToken();
        this.role = val || roleFromToken;
        
      });
      console.log(this.role);
      if (this.role === 'RH' || this.role === 'Gestionnaire') {
        return true;
         // l'utilisateur est autorisé à accéder à la page
      } else {
        // rediriger l'utilisateur vers une page d'erreur ou une autre page appropriée
        this.router.navigate(['/pages/page-not-found']);
        return false;
      }
    }

}
