import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth';
import { User } from '../../core/services/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  authService = inject(Auth);
  userService = inject(User);

  name = '';
  email = '';
  newPassword = '';
  confirmPassword = '';
  street = '';
  city = '';
  state = '';
  zip = '';

  profileMessage = signal('');
  loginMessage = signal('');

  async ngOnInit() {
    const uid = this.authService.currentUser()?.uid;
    if (!uid) return;
    const data = await this.userService.getUser(uid);
    if (data) {
      this.name = data.name ?? '';
      this.street = data.street ?? '';
      this.city = data.city ?? '';
      this.state = data.state ?? '';
      this.zip = data.zip ?? '';
    }
    this.email = this.authService.currentUser()?.email ?? '';
  }

  async saveAddress() {
    const uid = this.authService.currentUser()?.uid;
    if (!uid) return;
    try {
      await this.userService.updateProfile(uid, {
        name: this.name,
        street: this.street,
        city: this.city,
        state: this.state,
        zip: this.zip,
      });
      this.profileMessage.set('Saved!');
    } catch {
      this.profileMessage.set('Failed to save. Please try again.');
    }
  }

  async saveLoginChanges() {
    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      this.loginMessage.set('Passwords do not match.');
      return;
    }
    try {
      if (this.email && this.email !== this.authService.currentUser()?.email) {
        await this.userService.updateEmail(this.email);
      }
      if (this.newPassword) {
        await this.userService.updatePassword(this.newPassword);
      }
      this.newPassword = '';
      this.confirmPassword = '';
      this.loginMessage.set('Saved!');
    } catch {
      this.loginMessage.set('Failed to save. You may need to sign out and sign back in first.');
    }
  }
}
