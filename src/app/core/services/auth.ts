import { Injectable, signal } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth, db } from '../../firebase.config';
import { doc, setDoc } from 'firebase/firestore';

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

  async signUp(name: string, email: string, password: string) {
    try {
      this.errorMessage.set('');
      // Create User
      const userObj = await createUserWithEmailAndPassword(auth, email, password);
      const user = userObj.user;

      await updateProfile(user, { displayName: name });
      // onAuthStateChanged doesn't re-fire after updateProfile, so force the signal
      // to pick up the mutated displayName
      this.currentUser.set(null);
      this.currentUser.set(auth.currentUser);

      // Store Additional Fields
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
      });
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

  async updateDisplayName(name: string) {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name });
      this.currentUser.set(null);
      this.currentUser.set(auth.currentUser);
    }
  }

  async signOut() {
    await signOut(auth);
  }
}
