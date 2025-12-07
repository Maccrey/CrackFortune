
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { FirebaseUserRepository } from '../../data/repositories/FirebaseUserRepository';
import { FirebaseFortuneRepository } from '../../data/repositories/FirebaseFortuneRepository';
import type { UserProfile } from '../../domain/entities/user';
import type { Fortune } from '../../domain/entities/fortune';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (!auth) {
      console.warn('Firebase Auth is not initialized');
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Migrate local data if exists
      const performMigration = async (uid: string) => {
          try {
              // 1. Profile Migration
              const localProfileJson = localStorage.getItem('fortunecrack:user');
              if (localProfileJson) {
                  const localProfile = JSON.parse(localProfileJson) as UserProfile;
                  const userRepo = new FirebaseUserRepository(uid);
                  // Keep local data but update ID
                  await userRepo.saveProfile({ ...localProfile, id: uid });
                  localStorage.removeItem('fortunecrack:user');
                  console.log('Profile migrated to Firebase');
              }

              // 2. Fortune Migration
              const localFortunesJson = localStorage.getItem('fortunecrack:fortunes');
              if (localFortunesJson) {
                  const fortunesMap = JSON.parse(localFortunesJson) as Record<string, Fortune>;
                  const fortuneRepo = new FirebaseFortuneRepository(uid);
                  
                  const migrations = Object.values(fortunesMap).map(fortune => {
                      const migratedFortune = { ...fortune, userId: uid };
                      return fortuneRepo.saveFortune(migratedFortune);
                  });
                  
                  await Promise.all(migrations);
                  localStorage.removeItem('fortunecrack:fortunes');
                  console.log(`Migrated ${migrations.length} fortunes to Firebase`);
              }
          } catch (e) {
              console.error('Data migration failed:', e);
          }
      };

      await performMigration(result.user.uid);

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
