export class Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  priority: number; // 1~5 (별 개수)
  dueDate?: string; // ISO date string
  description?: string;
} 