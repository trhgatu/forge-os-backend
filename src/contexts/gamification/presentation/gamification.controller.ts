import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { GetUserStatsQuery } from '../application/queries/get-user-stats.query';
import { JwtAuthGuard } from '../../iam/auth/application/guards/jwt-auth.guard';
import { UserStats } from '../domain/user-stats.entity';

@Controller('gamification')
@UseGuards(JwtAuthGuard)
export class GamificationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('stats')
  async getUserStats(
    @Req() req: Request & { user: { id: string } },
  ): Promise<UserStats> {
    const userId = String(req.user.id);
    const stats = await this.queryBus.execute(new GetUserStatsQuery(userId));

    if (!stats) {
      return UserStats.create(userId);
    }

    return stats;
  }
}
