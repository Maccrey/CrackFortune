
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { UserRepository } from '../../domain/repositories/userRepository';
import type { UserProfile } from '../../domain/entities/user';

export class FirebaseUserRepository implements UserRepository {
  constructor(private readonly authUserId: string) {
    if (!db) throw new Error('Firebase Firestore is not initialized');
  }

  async getProfile(): Promise<UserProfile> {
    if (!db) throw new Error('Firestore not initialized');
    
    // Default profile if not found, to match LocalUserRepository behavior?
    // LocalUserRepository creates a default one if missing.
    // For Firebase, we should probably fetch, if missing return a default one with the auth ID.
    
    const userDocRef = doc(db, 'users', this.authUserId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data() as UserProfile; // simplified cast
    }
    
    // Return default profile structure if new user
    return {
       id: this.authUserId,
       name: '',
       birthDate: '',
       birthTime: '',
       birthTimeAccuracy: 'unknown',
       locale: 'en', // default
       createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString()
    };
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    if (!db) return;
    const userDocRef = doc(db, 'users', this.authUserId);
    // Ensure we don't overwrite ID with something else, or just trust the profile
    await setDoc(userDocRef, { ...profile, id: this.authUserId }, { merge: true });
  }

  async clearUserProfile(): Promise<void> {
    // In Firebase context, clearing profile might mean implementation specific.
    // Usually we don't delete the user document on logout, 
    // but if "Reset App" is requested, we might.
    // For now, we'll just implement it as no-op or specific fields reset if needed.
    // Given the interface, maybe we should delete the doc? 
    // Let's decided to NOT delete data on "clear" for cloud storage usually, 
    // but the interface implies simplified local storage behavior.
    
    // For cloud integration, likely "disconnect" or "delete account" is different.
    // Here we will do nothing for logout-like clearing, or delete if explicitly requested.
    // Let's assume this method is used for "Reset" feature. 
    console.warn('clearUserProfile called in Firebase Repo - ignoring for data safety');
  }
}
