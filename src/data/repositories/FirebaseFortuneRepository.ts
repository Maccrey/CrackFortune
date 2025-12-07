
import { collection, doc, getDoc, setDoc, query, orderBy, getDocs, limit, where } from 'firebase/firestore';
import type { FortuneRepository } from '../../domain/repositories/fortuneRepository';
import type { Fortune } from '../../domain/entities/fortune';
import { db } from '../../config/firebase';

export class FirebaseFortuneRepository implements FortuneRepository {
  constructor(private readonly authUserId: string) {
    if (!db) throw new Error('Firebase Firestore is not initialized');
  }

  async getFortuneByDate(userId: string, date: string): Promise<Fortune | null> {
    if (!db) return null;
    // userId param is redudant if we enforce authUserId, but we check to be safe or ignore it.
    // We'll use authUserId to ensure security.
    
    const fortuneRef = doc(db, 'users', this.authUserId, 'fortunes', date);
    const fortuneSnap = await getDoc(fortuneRef);

    if (fortuneSnap.exists()) {
      return fortuneSnap.data() as Fortune;
    }
    return null;
  }

  async saveFortune(fortune: Fortune): Promise<void> {
    if (!db) return;
    // We use fortune.date as ID for easy retrieval by date
    // Or we use fortune.id. LocalFortuneRepository uses `${userId}:${date}` as key but stores object.
    // Let's use date as document ID for subcollection 'fortunes'.
    const fortuneRef = doc(db, 'users', this.authUserId, 'fortunes', fortune.date);
    await setDoc(fortuneRef, fortune);
  }

  async listRecentFortunes(userId: string, limitCount = 10): Promise<Fortune[]> {
    if (!db) return [];
    
    const fortunesRef = collection(db, 'users', this.authUserId, 'fortunes');
    const q = query(fortunesRef, orderBy('date', 'desc'), limit(limitCount));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Fortune);
  }
}
