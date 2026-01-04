import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AwardXpCommand } from '../commands/award-xp.command';
import { Inject } from '@nestjs/common';
import { UserStatsRepository } from '../../domain/ports/user-stats.repository';
import { UserStats } from '../../domain/user-stats.entity';
import { GamificationGateway } from '../../presentation/gamification.gateway';

@CommandHandler(AwardXpCommand)
export class AwardXpHandler implements ICommandHandler<AwardXpCommand> {
  constructor(
    @Inject('UserStatsRepository')
    private readonly userStatsRepository: UserStatsRepository,
    private readonly gamificationGateway: GamificationGateway,
  ) {}

  async execute(command: AwardXpCommand): Promise<void> {
    const { userId, amount, reason } = command;

    let stats = await this.userStatsRepository.findByUserId(userId);

    if (!stats) {
      stats = UserStats.create(userId);
    }

    stats.addXp(amount);

    await this.userStatsRepository.save(stats);

    this.gamificationGateway.emitXpAwarded(userId, {
      xp: amount,
      newLevel: stats.level,
      reason: reason || 'XP Awarded',
    });
  }
}
