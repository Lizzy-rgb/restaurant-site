import { Injectable } from '@angular/core';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail, updatePassword } from 'firebase/auth';
import { db, auth } from '../../firebase.config';

export interface UserProfile {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  useSavedAddressByDefault: boolean;
  skipModifyOrderPageByDefault: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class User {
  async getUser(uid: string): Promise<Partial<UserProfile> | null> {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? (snap.data() as Partial<UserProfile>) : null;
  }

  async updateProfile(uid: string, data: Partial<UserProfile>) {
    await updateDoc(doc(db, 'users', uid), data);
  }

  async updateEmail(newEmail: string) {
    if (auth.currentUser) await updateEmail(auth.currentUser, newEmail);
  }

  async updatePassword(newPassword: string) {
    if (auth.currentUser) await updatePassword(auth.currentUser, newPassword);
  }
}
