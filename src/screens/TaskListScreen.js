import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  StatusBar,
  Animated,
} from 'react-native';
import {
  Appbar,
  FAB,
  Searchbar,
  Chip,
  Text,
  useTheme,
  Menu,
  IconButton,
  Surface,
  Button,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import services and components
import { TaskService } from '../services/TaskService';
import { FilterType, SortType } from '../types/Task';
import TaskItem from '../components/TaskItem';
import TaskStats from '../components/TaskStats';
import EmptyState from '../components/EmptyState';

const TaskListScreen = ({ navigation }) => {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(FilterType.ALL);
  const [sortBy, setSortBy] = useState(SortType.DATE_CREATED);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [stats, setStats] = useState({});

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  // Load tasks on screen focus
  useFocusEffect(
    useCallback(() => {
      loadTasks();
      
      // Add task change listener
      const handleTaskChange = (updatedTasks) => {
        setTasks(updatedTasks);
        updateStats(updatedTasks);
      };
      
      TaskService.addListener(handleTaskChange);
      
      return () => {
        TaskService.removeListener(handleTaskChange);
      };
    }, [])
  );

  // Load tasks from service
  const loadTasks = async () => {
    try {
      const allTasks = TaskService.getAllTasks();
      setTasks(allTasks);
      updateStats(allTasks);
      
      // Animate entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update task statistics
  const updateStats = (taskList) => {
    const taskStats = TaskService.getTaskStats();
    setStats(taskStats);
  };

  // Filter and sort tasks when dependencies change
  useEffect(() => {
    const filtered = TaskService.getFilteredTasks(activeFilter, sortBy, searchQuery);
    setFilteredTasks(filtered);
  }, [tasks, searchQuery, activeFilter, sortBy]);

  // Handle pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  }, []);

  // Handle task toggle completion
  const handleToggleComplete = async (taskId) => {
    await TaskService.toggleTaskComplete(taskId);
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    await TaskService.deleteTask(taskId);
  };

  // Handle task edit
  const handleEditTask = (task) => {
    navigation.navigate('TaskDetail', { task });
  };

  // Handle add new task
  const handleAddTask = () => {
    navigation.navigate('TaskDetail');
  };

  // Filter options
  const filterOptions = [
    { key: FilterType.ALL, label: 'All', icon: 'format-list-bulleted' },
    { key: FilterType.OPEN, label: 'Open', icon: 'circle-outline' },
    { key: FilterType.COMPLETED, label: 'Completed', icon: 'check-circle' },
    { key: FilterType.TODAY, label: 'Today', icon: 'calendar-today' },
    { key: FilterType.OVERDUE, label: 'Overdue', icon: 'alert-circle' },
  ];

  // Sort options
  const sortOptions = [
    { key: SortType.DATE_CREATED, label: 'Date Created', icon: 'calendar-plus' },
    { key: SortType.DUE_DATE, label: 'Due Date', icon: 'calendar-clock' },
    { key: SortType.PRIORITY, label: 'Priority', icon: 'flag' },
    { key: SortType.TITLE, label: 'Title', icon: 'alphabetical' },
  ];

  // Render task item
  const renderTaskItem = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: slideAnim.interpolate({
              inputRange: [0, 50],
              outputRange: [0, 50],
            }),
          },
        ],
      }}
    >
      <TaskItem
        task={item}
        onToggleComplete={handleToggleComplete}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        index={index}
      />
    </Animated.View>
  );

  // Render filter chip
  const renderFilterChip = (filter) => (
    <Chip
      key={filter.key}
      selected={activeFilter === filter.key}
      onPress={() => setActiveFilter(filter.key)}
      icon={filter.icon}
      style={[
        styles.filterChip,
        {
          backgroundColor: activeFilter === filter.key 
            ? theme.colors.primaryContainer 
            : theme.colors.surface,
        },
      ]}
      textStyle={{
        color: activeFilter === filter.key 
          ? theme.colors.onPrimaryContainer 
          : theme.colors.onSurface,
      }}
    >
      {filter.label}
    </Chip>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      
      {/* App Bar */}
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="My Tasks" titleStyle={styles.appBarTitle} />
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon="sort"
              onPress={() => setSortMenuVisible(true)}
            />
          }
        >
          {sortOptions.map((option) => (
            <Menu.Item
              key={option.key}
              onPress={() => {
                setSortBy(option.key);
                setSortMenuVisible(false);
              }}
              title={option.label}
              leadingIcon={option.icon}
            />
          ))}
        </Menu>
      </Appbar.Header>

      {/* Search Bar */}
      <Surface style={styles.searchContainer}>
        <Searchbar
          placeholder="Search tasks..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          icon="magnify"
          clearIcon="close"
        />
      </Surface>

      {/* Task Statistics */}
      <TaskStats stats={stats} />

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterOptions}
          renderItem={({ item }) => renderFilterChip(item)}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filtersContent}
        />
      </View>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          filter={activeFilter}
          searchQuery={searchQuery}
          onAddTask={handleAddTask}
        />
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddTask}
        label="Add Task"
        extended={filteredTasks.length === 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 12,
  },
  searchInput: {
    fontSize: 16,
  },
  filtersContainer: {
    paddingVertical: 12,
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterChip: {
    marginRight: 8,
    borderRadius: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    borderRadius: 16,
  },
});

export default TaskListScreen;