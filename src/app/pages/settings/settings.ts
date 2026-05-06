import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../core/services/user';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  useSavedAddressByDefault = false;
  skipModifyOrderPageByDefault = false;

  userService = inject(User);
  authService = inject(Auth);

  prefMessage = signal('');
  loading = signal(false);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loading.set(true);
        this.loadData(user.uid).finally(() => this.loading.set(false));
      } else {
        this.loading.set(false);
      }
    });
  }

  async loadData(uid: string) {
    if (!uid) return;
    const data = await this.userService.getUser(uid);
    if (data) {
      this.useSavedAddressByDefault = data.useSavedAddressByDefault ?? false;
      this.skipModifyOrderPageByDefault = data.skipModifyOrderPageByDefault ?? false;
    }
  }

  async savePreferences() {
    const uid = this.authService.currentUser()?.uid;
    if (!uid) return;
    try {
      await this.userService.updateProfile(uid, {
        useSavedAddressByDefault: this.useSavedAddressByDefault,
        skipModifyOrderPageByDefault: this.skipModifyOrderPageByDefault,
      });
      this.prefMessage.set('Saved!');
    } catch (error) {
      this.prefMessage.set('Failed to save. Please try again.');
    }
  }
}
