import type { UserProfile } from '../../domain/entities/user';
import type { GeneratedFortune, FortuneGenerator } from '../../domain/repositories/fortuneGenerator';
import { GroqClient } from '../services/GroqClient';

export class GroqFortuneRepository implements FortuneGenerator {
  private readonly client: GroqClient;

  constructor(client: GroqClient) {
    this.client = client;
  }

  async generateDailyFortune(user: UserProfile, date: string): Promise<GeneratedFortune> {
    return this.client.requestDailyFortune(user, date);
  }
}
