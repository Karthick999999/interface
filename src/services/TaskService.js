import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { showMessage } from 'react-native-flash-message';
import * as Sentry from '@sentry/react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  createTask,
  TaskStatus,
  TaskPriority,
  FilterType,
  SortType,
  validateTask,
} from '../types/Task';

const STORAGE_KEYS = {
  TASKS: '@tasks',
  PENDING_OPERATIONS: '@pending_operations',
  LAST_SYNC: '@last_sync',
};

class TaskManagementService {
  constructor() {
    this.tasks = [];
    this.pendingOperations = [];
    this.isOnline = true;
    this.listeners = [];
    
    this.initialize();
  }

  // Initialize service
  async initialize() {
    try {
      // Load tasks from storage
      await this.loadTasks();
      
      // Setup network listener
      this.setupNetworkListener();
      
      // Load pending operations
      await this.loadPendingOperations();
      
      // Sync if online
      if (this.isOnline) {
        await this.syncPendingOperations();
      }
    } catch (error) {
      console.error('TaskService initialization error:', error);
      Sentry.captureException(error);
    }
  }

  // Setup network connectivity listener
  setupNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected;
      
      // If coming back online, sync pending operations
      if (wasOffline && this.isOnline) {
        this.syncPendingOperations();
        showMessage({
          message: 'Back online',
          description: 'Syncing your changes...',
          type: 'info',
        });
      }
    });
  }

  // Add task change listener
  addListener(listener) {
    this.listeners.push(listener);
  }

  // Remove task change listener
  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // Notify listeners of changes
  notifyListeners() {
    this.listeners.forEach(listener => {
      if (typeof listener === 'function') {
        listener(this.tasks);
      }
    });
  }

  // Create new task
  async createTask(taskData) {
    try {
      const validation = validateTask(taskData);
      if (!validation.isValid) {
        showMessage({
          message: 'Validation Error',
          description: Object.values(validation.errors)[0],
          type: 'danger',
        });
        return { success: false, errors: validation.errors };
      }

      const task = createTask({
        ...taskData,
        id: uuid.v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add to local state
      this.tasks.unshift(task);
      
      // Save to storage
      await this.saveTasks();
      
      // Add to pending operations if offline
      if (!this.isOnline) {
        await this.addPendingOperation('create', task);
      }
      
      this.notifyListeners();
      
      showMessage({
        message: 'Task created',
        description: `"${task.title}" has been added`,
        type: 'success',
      });

      return { success: true, task };
    } catch (error) {
      console.error('Create task error:', error);
      Sentry.captureException(error);
      
      showMessage({
        message: 'Error creating task',
        description: 'Please try again',
        type: 'danger',
      });
      
      return { success: false, error: error.message };
    }
  }

  // Update existing task
  async updateTask(taskId, updates) {
    try {
      const taskIndex = this.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      const updatedTask = {
        ...this.tasks[taskIndex],
        ...updates,
        updatedAt: new Date(),
      };

      const validation = validateTask(updatedTask);
      if (!validation.isValid) {
        showMessage({
          message: 'Validation Error',
          description: Object.values(validation.errors)[0],
          type: 'danger',
        });
        return { success: false, errors: validation.errors };
      }

      // Update in local state
      this.tasks[taskIndex] = updatedTask;
      
      // Save to storage
      await this.saveTasks();
      
      // Add to pending operations if offline
      if (!this.isOnline) {
        await this.addPendingOperation('update', updatedTask);
      }
      
      this.notifyListeners();
      
      showMessage({
        message: 'Task updated',
        description: `"${updatedTask.title}" has been updated`,
        type: 'success',
      });

      return { success: true, task: updatedTask };
    } catch (error) {
      console.error('Update task error:', error);
      Sentry.captureException(error);
      
      showMessage({
        message: 'Error updating task',
        description: error.message,
        type: 'danger',
      });
      
      return { success: false, error: error.message };
    }
  }

  // Delete task
  async deleteTask(taskId) {
    try {
      const taskIndex = this.tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      const task = this.tasks[taskIndex];
      
      // Remove from local state
      this.tasks.splice(taskIndex, 1);
      
      // Save to storage
      await this.saveTasks();
      
      // Add to pending operations if offline
      if (!this.isOnline) {
        await this.addPendingOperation('delete', { id: taskId });
      }
      
      this.notifyListeners();
      
      showMessage({
        message: 'Task deleted',
        description: `"${task.title}" has been removed`,
        type: 'info',
      });

      return { success: true };
    } catch (error) {
      console.error('Delete task error:', error);
      Sentry.captureException(error);
      
      showMessage({
        message: 'Error deleting task',
        description: error.message,
        type: 'danger',
      });
      
      return { success: false, error: error.message };
    }
  }

  // Mark task as complete/incomplete
  async toggleTaskComplete(taskId) {
    try {
      const task = this.tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      const newStatus = task.status === TaskStatus.COMPLETED 
        ? TaskStatus.OPEN 
        : TaskStatus.COMPLETED;
        
      const completedAt = newStatus === TaskStatus.COMPLETED ? new Date() : null;

      return await this.updateTask(taskId, { 
        status: newStatus,
        completedAt,
      });
    } catch (error) {
      console.error('Toggle task complete error:', error);
      Sentry.captureException(error);
      return { success: false, error: error.message };
    }
  }

  // Get all tasks
  getAllTasks() {
    return [...this.tasks];
  }

  // Get task by ID
  getTaskById(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }

  // Filter and sort tasks
  getFilteredTasks(filter = FilterType.ALL, sortBy = SortType.DATE_CREATED, searchQuery = '') {
    let filteredTasks = [...this.tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (filter) {
      case FilterType.OPEN:
        filteredTasks = filteredTasks.filter(task => task.status !== TaskStatus.COMPLETED);
        break;
      case FilterType.COMPLETED:
        filteredTasks = filteredTasks.filter(task => task.status === TaskStatus.COMPLETED);
        break;
      case FilterType.TODAY:
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        filteredTasks = filteredTasks.filter(task => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return taskDate >= today && taskDate < tomorrow;
        });
        break;
      case FilterType.OVERDUE:
        const now = new Date();
        filteredTasks = filteredTasks.filter(task => {
          if (!task.dueDate || task.status === TaskStatus.COMPLETED) return false;
          return new Date(task.dueDate) < now;
        });
        break;
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      switch (sortBy) {
        case SortType.TITLE:
          return a.title.localeCompare(b.title);
        case SortType.DUE_DATE:
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case SortType.PRIORITY:
          const priorityOrder = {
            [TaskPriority.URGENT]: 0,
            [TaskPriority.HIGH]: 1,
            [TaskPriority.MEDIUM]: 2,
            [TaskPriority.LOW]: 3,
          };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case SortType.DATE_CREATED:
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filteredTasks;
  }

  // Get task statistics
  getTaskStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    const open = this.tasks.filter(task => task.status !== TaskStatus.COMPLETED).length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueToday = this.tasks.filter(task => {
      if (!task.dueDate || task.status === TaskStatus.COMPLETED) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate >= today && taskDate < tomorrow;
    }).length;
    
    const overdue = this.tasks.filter(task => {
      if (!task.dueDate || task.status === TaskStatus.COMPLETED) return false;
      return new Date(task.dueDate) < today;
    }).length;

    return {
      total,
      completed,
      open,
      dueToday,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  // Save tasks to storage
  async saveTasks() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      Sentry.captureException(error);
    }
  }

  // Load tasks from storage
  async loadTasks() {
    try {
      const tasksData = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      if (tasksData) {
        this.tasks = JSON.parse(tasksData);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      Sentry.captureException(error);
      this.tasks = [];
    }
  }

  // Add pending operation for offline sync
  async addPendingOperation(operation, data) {
    try {
      this.pendingOperations.push({
        id: uuid.v4(),
        operation,
        data,
        timestamp: new Date(),
      });
      
      await AsyncStorage.setItem(
        STORAGE_KEYS.PENDING_OPERATIONS,
        JSON.stringify(this.pendingOperations)
      );
    } catch (error) {
      console.error('Error adding pending operation:', error);
      Sentry.captureException(error);
    }
  }

  // Load pending operations
  async loadPendingOperations() {
    try {
      const operationsData = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_OPERATIONS);
      if (operationsData) {
        this.pendingOperations = JSON.parse(operationsData);
      }
    } catch (error) {
      console.error('Error loading pending operations:', error);
      Sentry.captureException(error);
      this.pendingOperations = [];
    }
  }

  // Sync pending operations when online
  async syncPendingOperations() {
    if (this.pendingOperations.length === 0) return;

    try {
      // Here you would sync with your backend API
      // For this demo, we'll just clear pending operations
      this.pendingOperations = [];
      await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_OPERATIONS);
      
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
      
      showMessage({
        message: 'Sync completed',
        description: 'All changes have been synchronized',
        type: 'success',
      });
    } catch (error) {
      console.error('Sync error:', error);
      Sentry.captureException(error);
    }
  }

  // Clear all tasks (for testing)
  async clearAllTasks() {
    try {
      this.tasks = [];
      await this.saveTasks();
      this.notifyListeners();
      
      showMessage({
        message: 'All tasks cleared',
        type: 'info',
      });
    } catch (error) {
      console.error('Error clearing tasks:', error);
      Sentry.captureException(error);
    }
  }
}

// Export singleton instance
export const TaskService = new TaskManagementService();