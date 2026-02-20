// src/types/index.ts
export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export type TaskWithoutId = Omit<Task, 'id'>;

export interface ApiError {
  error: string;
}