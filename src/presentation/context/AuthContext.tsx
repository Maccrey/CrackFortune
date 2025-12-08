
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { MigrationService } from '../../domain/services/MigrationService';

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
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // If we are effectively logging in manually, wait for migration to finish
      // check isMigrating ref if needed? No, state is fine because we await in loginWithGoogle
      if (!isMigrating) {
         setUser(currentUser);
         setLoading(false);
      } else {
         // If migrating, we just update the user but keep loading true via external combined state?
         // Actually onAuthStateChanged might fire *before* loginWithGoogle's await returns.
         // So we should capture the user here.
         setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [isMigrating]);

  const loginWithGoogle = async () => {
    if (!auth) {
      console.warn('Firebase Auth is not initialized');
      return;
    }
    const provider = new GoogleAuthProvider();
    setIsMigrating(true);
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Database Migration
      const migrationService = new MigrationService(result.user.uid);
      await migrationService.migrate();

    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
        setIsMigrating(false);
        setLoading(false);
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
    <AuthContext.Provider value={{ user, loading: loading || isMigrating, loginWithGoogle, logout }}>
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
