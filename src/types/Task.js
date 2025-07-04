// Task Status Enum
export const TaskStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

// Task Priority Enum
export const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Filter Types
export const FilterType = {
  ALL: 'all',
  OPEN: 'open',
  COMPLETED: 'completed',
  TODAY: 'today',
  OVERDUE: 'overdue',
};

// Sort Types
export const SortType = {
  DATE_CREATED: 'date_created',
  DUE_DATE: 'due_date',
  PRIORITY: 'priority',
  TITLE: 'title',
};

// Task interface structure
export const createTask = ({
  id = null,
  title = '',
  description = '',
  dueDate = null,
  status = TaskStatus.OPEN,
  priority = TaskPriority.MEDIUM,
  createdAt = new Date(),
  updatedAt = new Date(),
  completedAt = null,
}) => ({
  id,
  title,
  description,
  dueDate,
  status,
  priority,
  createdAt,
  updatedAt,
  completedAt,
});

// User interface structure
export const createUser = ({
  id = null,
  name = '',
  email = '',
  photoUrl = null,
  provider = 'google',
  accessToken = null,
}) => ({
  id,
  name,
  email,
  photoUrl,
  provider,
  accessToken,
});

// Validation functions
export const validateTask = (task) => {
  const errors = {};
  
  if (!task.title || task.title.trim().length === 0) {
    errors.title = 'Title is required';
  }
  
  if (task.title && task.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }
  
  if (task.description && task.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }
  
  if (task.dueDate && new Date(task.dueDate) < new Date()) {
    errors.dueDate = 'Due date cannot be in the past';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Priority colors and icons
export const getPriorityConfig = (priority) => {
  const configs = {
    [TaskPriority.LOW]: {
      color: '#4CAF50',
      icon: 'arrow-down',
      label: 'Low',
    },
    [TaskPriority.MEDIUM]: {
      color: '#FF9800',
      icon: 'minus',
      label: 'Medium',
    },
    [TaskPriority.HIGH]: {
      color: '#F44336',
      icon: 'arrow-up',
      label: 'High',
    },
    [TaskPriority.URGENT]: {
      color: '#9C27B0',
      icon: 'alert',
      label: 'Urgent',
    },
  };
  
  return configs[priority] || configs[TaskPriority.MEDIUM];
};

// Status colors and icons
export const getStatusConfig = (status) => {
  const configs = {
    [TaskStatus.OPEN]: {
      color: '#2196F3',
      icon: 'circle-outline',
      label: 'Open',
    },
    [TaskStatus.IN_PROGRESS]: {
      color: '#FF9800',
      icon: 'clock-outline',
      label: 'In Progress',
    },
    [TaskStatus.COMPLETED]: {
      color: '#4CAF50',
      icon: 'check-circle',
      label: 'Completed',
    },
  };
  
  return configs[status] || configs[TaskStatus.OPEN];
};