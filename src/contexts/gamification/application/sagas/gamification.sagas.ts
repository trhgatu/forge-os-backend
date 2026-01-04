import { Injectable } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ProjectCreatedEvent } from '../../../engineering/project/domain/events/project-created.event';
import { ProjectSyncedEvent } from '../../../engineering/project/domain/events/project-synced.event';
import { AwardXpCommand } from '../commands/award-xp.command';

@Injectable()
export class GamificationSagas {
  // Helper method to extract userId from events (handles both string and Value Object)
  private extractUserId(userId: unknown): string {
    if (typeof userId === 'string') {
      return userId;
    }
    if (typeof userId === 'object' && userId !== null && 'value' in userId) {
      return String((userId as { value: unknown }).value);
    }
    return String(userId);
  }
  @Saga()
  projectCreated = (
    events$: Observable<ProjectCreatedEvent>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(ProjectCreatedEvent),
      map((event: ProjectCreatedEvent) => {
        const userId = this.extractUserId(event.userId);

        // Award 50 XP for creating a project
        return new AwardXpCommand(
          userId,
          50,
          'project-creation',
          `Created project: ${event.title}`,
        );
      }),
    );
  };

  @Saga()
  projectSynced = (
    events$: Observable<ProjectSyncedEvent>,
  ): Observable<ICommand> => {
    return events$.pipe(
      ofType(ProjectSyncedEvent),
      filter((event: ProjectSyncedEvent) => event.newCommitCount > 0), // Filter out zero-commit syncs
      map((event: ProjectSyncedEvent) => {
        const xpAmount = 10 + event.newCommitCount * 2; // Base 10 + 2 per commit
        const cap = 100; // Max 100 XP per sync
        const awardedXp = Math.min(xpAmount, cap);

        // Extract userId using helper method
        const userId = this.extractUserId(event.userId);

        return new AwardXpCommand(
          userId,
          awardedXp,
          'project-sync',
          `Synced project ${event.id}. Fetched ${event.newCommitCount} commits.`,
        );
      }),
    );
  };
}
