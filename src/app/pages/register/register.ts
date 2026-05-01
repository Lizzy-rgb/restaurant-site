import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authService = inject(Auth);
  router = inject(Router);
  errorMessage = signal('');

  async register(name: string, email: string, password: string) {
    // Name not actually captured yet
    try {
      await this.authService.signUp(name, email, password);
      this.router.navigate(['']);
    } catch (error: any) {
      this.errorMessage.set(this.authService.errorMessage());
    }
  }
}
