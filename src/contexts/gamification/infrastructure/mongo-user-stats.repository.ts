import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserStatsRepository } from '../domain/ports/user-stats.repository';
import { UserStats } from '../domain/user-stats.entity';
import { UserStatsDocument, UserStatsModel } from './user-stats.schema';

@Injectable()
export class MongoUserStatsRepository implements UserStatsRepository {
  constructor(
    @InjectModel(UserStatsModel.name)
    private readonly userStatsModel: Model<UserStatsDocument>,
  ) {}

  async findByUserId(userId: string): Promise<UserStats | null> {
    const doc = await this.userStatsModel.findOne({ userId }).exec();
    if (!doc) return null;
    return this.toDomain(doc);
  }

  async save(stats: UserStats): Promise<void> {
    const data = stats.toPersistence();
    await this.userStatsModel.findOneAndUpdate({ userId: data.userId }, data, {
      upsert: true,
      new: true,
    });
  }

  private toDomain(doc: UserStatsDocument): UserStats {
    return UserStats.createFromPersistence({
      userId: doc.userId,
      xp: doc.xp,
      level: doc.level,
      title: doc.title,
      streak: doc.streak,
      lastActivityDate: doc.lastActivityDate,
      achievements: doc.achievements,
    });
  }
}
