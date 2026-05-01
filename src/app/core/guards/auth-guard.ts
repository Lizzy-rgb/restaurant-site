import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../services/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  authService = inject(Auth);
  router = inject(Router);

  canActivate() {
    if (this.authService.currentUser()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
