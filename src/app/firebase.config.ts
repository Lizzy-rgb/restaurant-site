import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyB6AGrNn89LdcPYWhfgXIq5LhFA-3iJtOU',
  authDomain: 'restaurant-site-final-project.firebaseapp.com',
  projectId: 'restaurant-site-final-project',
  storageBucket: 'restaurant-site-final-project.firebasestorage.app',
  messagingSenderId: '703598883328',
  appId: '1:703598883328:web:d7227b8493b744b090dee5',
};

const firebase_app = initializeApp(firebaseConfig);
export const db = getFirestore(firebase_app);
export const auth = getAuth(firebase_app);
