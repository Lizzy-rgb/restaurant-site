import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { AuthGuard } from './auth-guard';

@Injectable({
  providedIn: 'root',
})
export class StaffOOB implements CanActivate {
  authService = inject(Auth);
  router = inject(Router);
  authGuard = inject(AuthGuard);

  canActivate() {
    if (
      this.authGuard.canActivate() &&
      this.authService.currentUser()?.uid === 'wshyoEAhFKQNjtPvtQsbUcQFFXu1'
    ) {
      this.router.navigate(['/active-orders']);
      return false;
    }
    return true;
  }
}
