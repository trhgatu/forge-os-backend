import { Project } from '../domain/project.entity';
import { ProjectResponse } from './dto/project.response';
import { ProjectSummaryResponse } from './dto/project-summary.response';
import { GithubStatsResponse } from './dto/github-stats.response';
import { ReadmeResponse } from './dto/readme.response';
import { TaskBoardResponse } from './dto/taskboard.response';
import { PaginatedLogsResponse } from './dto/logs.response';

export class ProjectPresenter {
  /**
   * @deprecated Use toSummaryResponse instead for better performance
   */
  static toResponse(entity: Project): ProjectResponse {
    return {
      id: entity.id.toString(),
      title: entity.title,
      description: entity.description,
      status: entity.status,
      tags: entity.tags,
      isPinned: entity.isPinned,
      githubStats: entity.githubStats,
      metadata: entity.metadata,
      progress: entity.progress,
      taskBoard: entity.taskBoard,
      links: entity.links,
      logs: entity.logs.map((log, index) => ({
        ...log,
        id:
          log.id ||
          (log as any)._id?.toString() ||
          `log-${index}-${new Date(log.date).getTime()}`,
      })),
      createdAt: new Date(entity.createdAt).toISOString(),
      updatedAt: new Date(entity.updatedAt).toISOString(),
      isDeleted: entity.isProjectDeleted,
      deletedAt: entity.deletedDate
        ? new Date(entity.deletedDate).toISOString()
        : null,

      // Frontend Compatibility
      technologies: entity.metadata?.technologies as string[],
      currentMilestone: entity.metadata?.currentMilestone as any,
      dueDate: entity.metadata?.dueDate as string,
      team: entity.metadata?.team as any,
      lead: entity.metadata?.lead as any,
    };
  }

  static toSummaryResponse(
    entity: Project,
    baseUrl: string,
  ): ProjectSummaryResponse {
    return {
      id: entity.id.toString(),
      title: entity.title,
      description: entity.description,
      status: entity.status,
      tags: entity.tags,
      isPinned: entity.isPinned,
      progress: entity.progress,
      links:
        entity.links?.map((link) => ({
          title: link.title,
          url: link.url,
          icon: (link.icon === 'github' ? 'github' : 'link') as
            | 'github'
            | 'link',
        })) || [],
      stats: {
        stars: entity.githubStats?.stars || 0,
        forks: entity.githubStats?.forks || 0,
        issues: entity.githubStats?.issues || 0,
        language: entity.githubStats?.language || 'Unknown',
      },
      createdAt: new Date(entity.createdAt).toISOString(),
      updatedAt: new Date(entity.updatedAt).toISOString(),
      _links: {
        githubStats: `${baseUrl}/projects/${entity.id}/github-stats`,
        readme: `${baseUrl}/projects/${entity.id}/readme`,
        taskboard: `${baseUrl}/projects/${entity.id}/taskboard`,
        logs: `${baseUrl}/projects/${entity.id}/logs`,
      },
    };
  }

  static toGithubStatsResponse(entity: Project): GithubStatsResponse {
    return {
      languages: entity.githubStats?.languages || {},
      commitActivity:
        entity.githubStats?.commitActivity?.map((activity) => ({
          week: activity.date,
          commits: activity.count,
        })) || [],
      recentCommits:
        entity.githubStats?.recentCommits?.map((commit) => ({
          ...commit,
          date: commit.date || new Date().toISOString(),
          author: commit.author || 'Unknown',
        })) || [],
      contributors: entity.githubStats?.contributors || [],
      issuesList: entity.githubStats?.issuesList || [],
      pullRequests: entity.githubStats?.pullRequests || [],
    };
  }

  static toReadmeResponse(entity: Project): ReadmeResponse {
    return {
      content: entity.githubStats?.readme || '',
    };
  }

  static toTaskBoardResponse(entity: Project): TaskBoardResponse {
    return {
      todo: entity.taskBoard?.todo || [],
      inProgress: entity.taskBoard?.inProgress || [],
      done: entity.taskBoard?.done || [],
    };
  }

  static toLogsResponse(
    entity: Project,
    page: number = 1,
    limit: number = 20,
  ): PaginatedLogsResponse {
    const allLogs = entity.logs || [];
    const sortedLogs = [...allLogs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = sortedLogs.slice(startIndex, endIndex);

    return {
      data: paginatedLogs.map((log, index) => ({
        id: log.id || (log as any)._id?.toString() || `log-${index}`,
        content: log.content,
        date: log.date,
        type: log.type,
      })),
      total: allLogs.length,
      page,
      limit,
    };
  }
}
