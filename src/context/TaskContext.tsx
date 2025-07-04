import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filters: TaskFilters;
  isLoading: boolean;
  createTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'tasks';

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setTaskFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    search: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks: Task[] = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const createTask = async (input: CreateTaskInput) => {
    try {
      const newTask: Task = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
        status: 'open',
        priority: input.priority,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const updateTask = async (input: UpdateTaskInput) => {
    try {
      const updatedTasks = tasks.map(task => {
        if (task.id === input.id) {
          return {
            ...task,
            ...input,
            updatedAt: new Date(),
          };
        }
        return task;
      });

      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      await saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const toggleTaskStatus = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task) {
        await updateTask({
          id,
          status: task.status === 'open' ? 'complete' : 'open',
        });
      }
    } catch (error) {
      console.error('Error toggling task status:', error);
      throw error;
    }
  };

  const setFilters = (newFilters: TaskFilters) => {
    setTaskFilters(newFilters);
  };

  const refreshTasks = async () => {
    await loadTasks();
  };

  // Filter tasks based on current filters
  const filteredTasks = tasks.filter(task => {
    // Status filter
    if (filters.status && filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority && filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // Search filter
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = task.description.toLowerCase().includes(searchTerm);
      if (!titleMatch && !descriptionMatch) {
        return false;
      }
    }

    return true;
  });

  const contextValue: TaskContextType = {
    tasks,
    filteredTasks,
    filters,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    setFilters,
    refreshTasks,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};