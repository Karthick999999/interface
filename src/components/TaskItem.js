import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import {
  Card,
  Checkbox,
  IconButton,
  useTheme,
  Button,
  Surface,
} from 'react-native-paper';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import RNAnimated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  TaskStatus,
  getPriorityConfig,
  getStatusConfig,
} from '../types/Task';

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete, index }) => {
  const theme = useTheme();
  const [showActions, setShowActions] = useState(false);
  
  // Animation values
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);

  // Gesture handlers
  const panGesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(0.95);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      scale.value = withSpring(1);
      
      if (event.translationX < -100) {
        // Swipe left - show delete
        translateX.value = withSpring(-80);
        runOnJS(setShowActions)(true);
      } else if (event.translationX > 100) {
        // Swipe right - toggle complete
        translateX.value = withSpring(0);
        runOnJS(handleToggleComplete)();
      } else {
        // Return to original position
        translateX.value = withSpring(0);
        runOnJS(setShowActions)(false);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const animatedActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -50 ? 1 : 0,
    transform: [{ translateX: translateX.value + 80 }],
  }));

  // Handle functions
  const handleToggleComplete = () => {
    onToggleComplete(task.id);
    setShowActions(false);
  };

  const handleEdit = () => {
    onEdit(task);
    setShowActions(false);
  };

  const handleDelete = () => {
    // Animate out
    opacity.value = withSpring(0, {}, () => {
      runOnJS(onDelete)(task.id);
    });
  };

  const resetPosition = () => {
    translateX.value = withSpring(0);
    setShowActions(false);
  };

  // Format due date
  const formatDueDate = (date) => {
    if (!date) return null;
    
    const dueDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dueDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return dueDate.toLocaleDateString();
    }
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate || task.status === TaskStatus.COMPLETED) return false;
    return new Date(task.dueDate) < new Date();
  };

  const dueDateText = formatDueDate(task.dueDate);
  const overdue = isOverdue();

  return (
    <View style={styles.container}>
      {/* Background Action Buttons */}
      <RNAnimated.View style={[styles.actionsContainer, animatedActionStyle]}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={handleDelete}
        >
          <Icon name="delete" size={24} color={theme.colors.onError} />
        </TouchableOpacity>
      </RNAnimated.View>

      {/* Task Card */}
      <GestureDetector gesture={panGesture}>
        <RNAnimated.View style={animatedCardStyle}>
          <Card 
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderLeftColor: priorityConfig.color,
              },
            ]}
            onPress={() => !showActions ? onEdit(task) : resetPosition()}
          >
            <Card.Content style={styles.cardContent}>
              {/* Main Row */}
              <View style={styles.mainRow}>
                {/* Checkbox */}
                <Checkbox
                  status={task.status === TaskStatus.COMPLETED ? 'checked' : 'unchecked'}
                  onPress={handleToggleComplete}
                  color={theme.colors.primary}
                />

                {/* Content */}
                <View style={styles.contentContainer}>
                  {/* Title and Priority */}
                  <View style={styles.titleRow}>
                    <Text
                      style={[
                        styles.title,
                        {
                          color: theme.colors.onSurface,
                          textDecorationLine: task.status === TaskStatus.COMPLETED ? 'line-through' : 'none',
                          opacity: task.status === TaskStatus.COMPLETED ? 0.7 : 1,
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {task.title}
                    </Text>
                    
                    <View style={styles.priorityContainer}>
                      <Icon
                        name={priorityConfig.icon}
                        size={16}
                        color={priorityConfig.color}
                      />
                    </View>
                  </View>

                  {/* Description */}
                  {task.description ? (
                    <Text
                      style={[
                        styles.description,
                        {
                          color: theme.colors.onSurfaceVariant,
                          opacity: task.status === TaskStatus.COMPLETED ? 0.5 : 1,
                        },
                      ]}
                      numberOfLines={2}
                    >
                      {task.description}
                    </Text>
                  ) : null}

                  {/* Footer Row */}
                  <View style={styles.footerRow}>
                    {/* Due Date */}
                    {dueDateText && (
                      <View style={styles.dueDateContainer}>
                        <Icon
                          name="calendar-clock"
                          size={14}
                          color={overdue ? theme.colors.error : theme.colors.onSurfaceVariant}
                        />
                        <Text
                          style={[
                            styles.dueDate,
                            {
                              color: overdue ? theme.colors.error : theme.colors.onSurfaceVariant,
                              fontWeight: overdue ? '600' : 'normal',
                            },
                          ]}
                        >
                          {dueDateText}
                        </Text>
                      </View>
                    )}

                    {/* Status Badge */}
                    <View style={[styles.statusBadge, { backgroundColor: statusConfig.color + '20' }]}>
                      <Icon
                        name={statusConfig.icon}
                        size={12}
                        color={statusConfig.color}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusConfig.color },
                        ]}
                      >
                        {statusConfig.label}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        </RNAnimated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    position: 'relative',
  },
  actionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  actionButton: {
    width: 60,
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
  card: {
    elevation: 2,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginHorizontal: 2,
  },
  cardContent: {
    padding: 16,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  priorityContainer: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDate: {
    fontSize: 12,
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
});

export default TaskItem;