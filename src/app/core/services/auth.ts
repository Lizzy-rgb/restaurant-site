import { Injectable, signal } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../../firebase.config';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  currentUser = signal<User | null>(null);
  errorMessage = signal('');

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);
      this.errorMessage.set('');
    });
  }

  async signIn(email: string, password: string) {
    try {
      this.errorMessage.set('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      const code = error?.code;
      if (code === 'Sample Error Message') {
        // Put any specific error messages in an else-if ladder here.
        this.errorMessage.set('Error Message to Display to User');
      } else {
        this.errorMessage.set('Error attempting to sign in');
      }
      throw error; // Potential Security Vulnurability?
    }
  }

  async signUp(email: string, password: string) {
    try {
      this.errorMessage.set('');
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      const code = error?.code;
      if (code === 'Sample Error Message') {
        // Put any specific error messages in an else-if ladder here.
        this.errorMessage.set('Error Message to Display to User');
      } else {
        this.errorMessage.set('Error attempting to sign in');
      }
      throw error; // Potential Security Vulnurability?
    }
  }

  async signOut() {
    await signOut(auth);
  }
}
