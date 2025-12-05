import { buildFortuneId, type Fortune } from '../entities/fortune';
import type { UserProfile } from '../entities/user';
import type { FortuneGenerator } from '../repositories/fortuneGenerator';
import type { FortuneRepository } from '../repositories/fortuneRepository';

export interface GetDailyFortuneParams {
  user: UserProfile;
  date?: string; // YYYY-MM-DD, defaults to today
}

export class GetDailyFortuneUseCase {
  private readonly fortuneRepository: FortuneRepository;
  private readonly fortuneGenerator: FortuneGenerator;

  constructor(fortuneRepository: FortuneRepository, fortuneGenerator: FortuneGenerator) {
    this.fortuneRepository = fortuneRepository;
    this.fortuneGenerator = fortuneGenerator;
  }

  async execute({ user, date }: GetDailyFortuneParams): Promise<Fortune> {
    const today = date ?? new Date().toISOString().slice(0, 10);
    const cacheHit = await this.fortuneRepository.getFortuneByDate(user.id, today);
    if (cacheHit) {
      return cacheHit;
    }

    const generated = await this.fortuneGenerator.generateDailyFortune(user, today);
    const fortune: Fortune = {
      id: buildFortuneId(user.id, today),
      userId: user.id,
      date: today,
      summary: generated.summary,
      fullText: generated.fullText,
      precision: generated.precision,
      locale: user.locale,
      model: generated.model,
      keywords: generated.keywords,
      createdAt: new Date().toISOString(),
    };

    await this.fortuneRepository.saveFortune(fortune);
    return fortune;
  }
}
