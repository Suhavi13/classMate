export type Priority = 'high' | 'medium' | 'low';

export type Task = {
  id: string;
  name: string;
  notes: string;
  dateISO: string; // yyyy-mm-dd
  reminderTime: string; // ex: 9:00am
  priority: Priority;
  completed: boolean;
  createdAt: number;
};

export type Habit = {
  id: string;
  name: string;
  description: string;
  startDateISO: string;
  endDateISO: string;
  reminderTime: string;
  priority: Priority;
  completions: Record<string, boolean>; 
  createdAt: number;
};

export type AppState = {
  tasks: Task[];
  habits: Habit[];
};
