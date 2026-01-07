export interface TaskBoardResponse {
  todo: Array<{
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  inProgress: Array<{
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  done: Array<{
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
  }>;
}
