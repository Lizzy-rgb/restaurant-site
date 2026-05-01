import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  authService = inject(Auth);
  router = inject(Router);
  error = signal('');

  async signIn(email: string, password: string) {
    try {
      await this.authService.signIn(email, password);
      this.router.navigate(['']);
    } catch (error: any) {
      this.error.set(this.authService.errorMessage());
    }
  }
}
