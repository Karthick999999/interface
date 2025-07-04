import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  FAB,
  Searchbar,
  Card,
  Text,
  Chip,
  IconButton,
  Menu,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { useTasks } from '../context/TaskContext';
import { Task, TaskFilters } from '../types';
import TaskItem from '../components/TaskItem';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';

const TasksScreen: React.FC = () => {
  const {
    filteredTasks,
    filters,
    isLoading,
    setFilters,
    refreshTasks,
    deleteTask,
    toggleTaskStatus,
  } = useTasks();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshTasks();
    setRefreshing(false);
  }, [refreshTasks]);

  const handleTaskPress = (task: Task) => {
    setSelectedTask(task);
    setEditModalVisible(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const handleToggleStatus = async (taskId: string) => {
    try {
      await toggleTaskStatus(taskId);
    } catch (error) {
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const updateSearch = (search: string) => {
    setFilters({ ...filters, search });
  };

  const updateStatusFilter = (status: TaskFilters['status']) => {
    setFilters({ ...filters, status });
    setFilterMenuVisible(false);
  };

  const updatePriorityFilter = (priority: TaskFilters['priority']) => {
    setFilters({ ...filters, priority });
    setFilterMenuVisible(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'all':
        return '#2196F3';
      case 'open':
        return '#FF9800';
      case 'complete':
        return '#4CAF50';
      default:
        return '#2196F3';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'all':
        return '#2196F3';
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FF9800';
      case 'high':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onPress={() => handleTaskPress(item)}
      onToggleStatus={() => handleToggleStatus(item.id)}
      onDelete={() => handleDeleteTask(item.id)}
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No tasks found
      </Text>
      <Text variant="bodyMedium" style={styles.emptyDescription}>
        {filters.search || filters.status !== 'all' || filters.priority !== 'all'
          ? 'Try adjusting your filters'
          : 'Create your first task to get started'}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" style={styles.loadingText}>
          Loading tasks...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Search tasks..."
        onChangeText={updateSearch}
        value={filters.search || ''}
        style={styles.searchBar}
      />

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <Text variant="bodySmall" style={styles.filterLabel}>
            Status:
          </Text>
          <Menu
            visible={filterMenuVisible}
            onDismiss={() => setFilterMenuVisible(false)}
            anchor={
              <Chip
                selected={filters.status !== 'all'}
                onPress={() => setFilterMenuVisible(true)}
                style={[
                  styles.filterChip,
                  { backgroundColor: getStatusColor(filters.status || 'all') + '20' },
                ]}
                textStyle={{ color: getStatusColor(filters.status || 'all') }}
              >
                {filters.status || 'all'}
              </Chip>
            }
          >
            <Menu.Item
              title="All"
              onPress={() => updateStatusFilter('all')}
            />
            <Menu.Item
              title="Open"
              onPress={() => updateStatusFilter('open')}
            />
            <Menu.Item
              title="Complete"
              onPress={() => updateStatusFilter('complete')}
            />
            <Divider />
            <Menu.Item
              title="Low Priority"
              onPress={() => updatePriorityFilter('low')}
            />
            <Menu.Item
              title="Medium Priority"
              onPress={() => updatePriorityFilter('medium')}
            />
            <Menu.Item
              title="High Priority"
              onPress={() => updatePriorityFilter('high')}
            />
            <Menu.Item
              title="All Priorities"
              onPress={() => updatePriorityFilter('all')}
            />
          </Menu>

          {filters.priority !== 'all' && (
            <Chip
              selected
              style={[
                styles.filterChip,
                { backgroundColor: getPriorityColor(filters.priority || 'all') + '20' },
              ]}
              textStyle={{ color: getPriorityColor(filters.priority || 'all') }}
              onClose={() => updatePriorityFilter('all')}
            >
              {filters.priority}
            </Chip>
          )}
        </View>

        {/* Clear Filters */}
        {(filters.search || filters.status !== 'all' || filters.priority !== 'all') && (
          <IconButton
            icon="filter-remove"
            size={20}
            onPress={() => setFilters({ status: 'all', priority: 'all', search: '' })}
            style={styles.clearFiltersButton}
          />
        )}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTaskItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyList}
      />

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setCreateModalVisible(true)}
        label="Add Task"
      />

      {/* Modals */}
      <CreateTaskModal
        visible={createModalVisible}
        onDismiss={() => setCreateModalVisible(false)}
      />

      {selectedTask && (
        <EditTaskModal
          visible={editModalVisible}
          task={selectedTask}
          onDismiss={() => {
            setEditModalVisible(false);
            setSelectedTask(null);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterLabel: {
    marginRight: 8,
    color: '#666',
  },
  filterChip: {
    marginRight: 8,
  },
  clearFiltersButton: {
    marginLeft: 8,
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});

export default TasksScreen;