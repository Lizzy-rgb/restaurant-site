import { Component, effect, inject, signal } from '@angular/core';
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
export class Profile {
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

  nameMessage = signal('');
  emailMessage = signal('');
  passwordMessage = signal('');
  addressMessage = signal('');
  loading = signal(false);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loading.set(true);
        this.loadData(user.uid, user.email ?? '').finally(() => this.loading.set(false));
      } else {
        this.loading.set(false);
      }
    });
  }

  private async loadData(uid: string, email: string) {
    const data = await this.userService.getUser(uid);
    if (data) {
      this.name = data.name ?? '';
      this.street = data.street ?? '';
      this.city = data.city ?? '';
      this.state = data.state ?? '';
      this.zip = data.zip ?? '';
    }
    this.email = email;
  }

  async saveName() {
    const uid = this.authService.currentUser()?.uid;
    if (!uid) return;
    try {
      await Promise.all([
        this.userService.updateProfile(uid, { name: this.name }),
        this.authService.updateDisplayName(this.name),
      ]);
      this.nameMessage.set('Saved!');
    } catch {
      this.nameMessage.set('Failed to save. Please try again.');
    }
  }

  async saveEmail() {
    try {
      await this.userService.updateEmail(this.email);
      this.emailMessage.set('Saved!');
    } catch {
      this.emailMessage.set('Failed to save. You may need to sign out and sign back in first.');
    }
  }

  async savePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMessage.set('Passwords do not match.');
      return;
    }
    try {
      await this.userService.updatePassword(this.newPassword);
      this.newPassword = '';
      this.confirmPassword = '';
      this.passwordMessage.set('Saved!');
    } catch {
      this.passwordMessage.set('Failed to save. You may need to sign out and sign back in first.');
    }
  }

  async saveAddress() {
    const uid = this.authService.currentUser()?.uid;
    if (!uid) return;
    try {
      await this.userService.updateProfile(uid, {
        street: this.street,
        city: this.city,
        state: this.state,
        zip: this.zip,
      });
      this.addressMessage.set('Saved!');
    } catch {
      this.addressMessage.set('Failed to save. Please try again.');
    }
  }
}
