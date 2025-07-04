import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('todomaster-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('todomaster-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([task, ...tasks]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>
            <span className="logo">✓</span>
            TodoMaster
          </h1>
          <p>Your personal task management companion</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {/* Add Task Form */}
          <div className="add-task-section">
            <div className="input-group">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="What needs to be done?"
                className="task-input"
              />
              <button onClick={addTask} className="add-btn">
                Add Task
              </button>
            </div>
          </div>

          {/* Stats */}
          {tasks.length > 0 && (
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">{stats.total}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.active}</span>
                <span className="stat-label">Active</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.completed}</span>
                <span className="stat-label">Done</span>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="filters">
            <button 
              className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={filter === 'active' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          {/* Task List */}
          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>
                  {filter === 'completed' ? 'No completed tasks yet' :
                   filter === 'active' ? 'No active tasks' :
                   'No tasks yet'}
                </h3>
                <p>
                  {filter === 'all' ? 'Start by adding your first task above!' :
                   filter === 'active' ? 'All your tasks are completed! Great job!' :
                   'Complete some tasks to see them here.'}
                </p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="task-checkbox"
                    />
                    <span className="task-text">{task.text}</span>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="delete-btn"
                    title="Delete task"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>TodoMaster Web • Built with React</p>
      </footer>
    </div>
  );
}

export default App;