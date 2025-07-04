export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  status: 'open' | 'complete';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  dueDate?: Date;
  status?: 'open' | 'complete';
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskFilters {
  status?: 'all' | 'open' | 'complete';
  priority?: 'all' | 'low' | 'medium' | 'high';
  search?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Tasks: undefined;
  Settings: undefined;
};