import type { UserProfile } from '../../domain/entities/user';
import type { GeneratedFortune, FortuneGenerator } from '../../domain/repositories/fortuneGenerator';
import { GeminiClient } from '../services/GeminiClient';

export class GeminiFortuneRepository implements FortuneGenerator {
  private readonly client: GeminiClient;

  constructor(client: GeminiClient) {
    this.client = client;
  }

  async generateDailyFortune(user: UserProfile, date: string): Promise<GeneratedFortune> {
    return this.client.requestDailyFortune(user, date);
  }
}
