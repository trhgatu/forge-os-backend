export interface GithubStatsResponse {
  languages: Record<string, number>;
  commitActivity: { week: string; commits: number }[];
  recentCommits: {
    date: string;
    message: string;
    author: string;
    url: string;
  }[];
  contributors: { login: string; avatar_url: string; contributions: number }[];
  issuesList: Array<{
    id: number;
    number: number;
    title: string;
    state: string;
    html_url: string;
    labels: Array<{ name: string; color: string }>;
    assignee: { login: string; avatar_url: string } | null;
    created_at: string;
  }>;
  pullRequests: Array<{
    id: number;
    number: number;
    title: string;
    state: string;
    html_url: string;
    user: { login: string; avatar_url: string };
    created_at: string;
  }>;
}
