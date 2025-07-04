import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FilterType } from '../types/Task';

const { width, height } = Dimensions.get('window');

const EmptyState = ({ filter, searchQuery, onAddTask }) => {
  const theme = useTheme();

  // Get appropriate message and icon based on current filter/search
  const getEmptyStateContent = () => {
    if (searchQuery && searchQuery.trim().length > 0) {
      return {
        icon: 'magnify',
        title: 'No tasks found',
        message: `No tasks match "${searchQuery}". Try a different search term or create a new task.`,
        buttonText: 'Create Task',
        buttonIcon: 'plus',
      };
    }

    switch (filter) {
      case FilterType.COMPLETED:
        return {
          icon: 'check-circle-outline',
          title: 'No completed tasks',
          message: 'Complete some tasks to see them here. You\'ve got this!',
          buttonText: 'View All Tasks',
          buttonIcon: 'format-list-bulleted',
        };
      
      case FilterType.OPEN:
        return {
          icon: 'circle-outline',
          title: 'All tasks completed!',
          message: 'Congratulations! You\'ve completed all your open tasks.',
          buttonText: 'Add New Task',
          buttonIcon: 'plus',
        };
      
      case FilterType.TODAY:
        return {
          icon: 'calendar-today',
          title: 'No tasks due today',
          message: 'You have a clear schedule for today. Time to add some new goals!',
          buttonText: 'Add Task for Today',
          buttonIcon: 'plus',
        };
      
      case FilterType.OVERDUE:
        return {
          icon: 'calendar-alert',
          title: 'No overdue tasks',
          message: 'Great job! You\'re staying on top of your deadlines.',
          buttonText: 'View All Tasks',
          buttonIcon: 'format-list-bulleted',
        };
      
      default:
        return {
          icon: 'clipboard-text-outline',
          title: 'No tasks yet',
          message: 'Start organizing your life by creating your first task. Every great journey begins with a single step!',
          buttonText: 'Create Your First Task',
          buttonIcon: 'plus',
        };
    }
  };

  const content = getEmptyStateContent();

  const handleButtonPress = () => {
    if (content.buttonIcon === 'plus') {
      onAddTask();
    } else {
      // Handle other actions like "View All Tasks" if needed
      // For now, we'll just trigger add task
      onAddTask();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
          <Icon 
            name={content.icon} 
            size={80} 
            color={theme.colors.onPrimaryContainer} 
          />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          {content.title}
        </Text>

        {/* Message */}
        <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
          {content.message}
        </Text>

        {/* Action Button */}
        <Button
          mode="contained"
          onPress={handleButtonPress}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          contentStyle={styles.buttonContent}
          labelStyle={[styles.buttonLabel, { color: theme.colors.onPrimary }]}
          icon={content.buttonIcon}
        >
          {content.buttonText}
        </Button>

        {/* Additional Tips */}
        {filter === FilterType.ALL && !searchQuery && (
          <View style={styles.tipsContainer}>
            <Text style={[styles.tipsTitle, { color: theme.colors.onSurfaceVariant }]}>
              Quick Tips:
            </Text>
            
            <View style={styles.tipItem}>
              <Icon name="gesture-swipe-right" size={16} color={theme.colors.primary} />
              <Text style={[styles.tipText, { color: theme.colors.onSurfaceVariant }]}>
                Swipe right to complete tasks
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Icon name="gesture-swipe-left" size={16} color={theme.colors.primary} />
              <Text style={[styles.tipText, { color: theme.colors.onSurfaceVariant }]}>
                Swipe left to delete tasks
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Icon name="filter-variant" size={16} color={theme.colors.primary} />
              <Text style={[styles.tipText, { color: theme.colors.onSurfaceVariant }]}>
                Use filters to organize your view
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    opacity: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    borderRadius: 12,
    marginBottom: 32,
  },
  buttonContent: {
    height: 48,
    paddingHorizontal: 24,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  tipsContainer: {
    alignSelf: 'stretch',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  tipText: {
    fontSize: 12,
    marginLeft: 12,
    flex: 1,
  },
});

export default EmptyState;