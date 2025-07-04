import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Text,
  useTheme,
  SegmentedButtons,
  Surface,
  Chip,
  IconButton,
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';

import { TaskService } from '../services/TaskService';
import {
  createTask,
  TaskPriority,
  TaskStatus,
  validateTask,
  getPriorityConfig,
} from '../types/Task';

const TaskDetailScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const existingTask = route.params?.task;
  const isEditing = !!existingTask;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState(null);
  const [status, setStatus] = useState(TaskStatus.OPEN);
  
  // UI state
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load existing task data
  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title || '');
      setDescription(existingTask.description || '');
      setPriority(existingTask.priority || TaskPriority.MEDIUM);
      setStatus(existingTask.status || TaskStatus.OPEN);
      setDueDate(existingTask.dueDate ? new Date(existingTask.dueDate) : null);
    }
  }, [existingTask]);

  // Priority options
  const priorityOptions = [
    {
      value: TaskPriority.LOW,
      label: 'Low',
      icon: 'arrow-down',
      showSelectedCheck: false,
    },
    {
      value: TaskPriority.MEDIUM,
      label: 'Medium',
      icon: 'minus',
      showSelectedCheck: false,
    },
    {
      value: TaskPriority.HIGH,
      label: 'High',
      icon: 'arrow-up',
      showSelectedCheck: false,
    },
    {
      value: TaskPriority.URGENT,
      label: 'Urgent',
      icon: 'alert',
      showSelectedCheck: false,
    },
  ];

  // Status options (for editing)
  const statusOptions = [
    {
      value: TaskStatus.OPEN,
      label: 'Open',
    },
    {
      value: TaskStatus.IN_PROGRESS,
      label: 'In Progress',
    },
    {
      value: TaskStatus.COMPLETED,
      label: 'Completed',
    },
  ];

  // Validation
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setTitleError('');
    setDescriptionError('');
    
    // Validate title
    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else if (title.length > 100) {
      setTitleError('Title must be less than 100 characters');
      isValid = false;
    }
    
    // Validate description
    if (description.length > 500) {
      setDescriptionError('Description must be less than 500 characters');
      isValid = false;
    }
    
    return isValid;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        dueDate: dueDate ? dueDate.toISOString() : null,
      };

      let result;
      if (isEditing) {
        result = await TaskService.updateTask(existingTask.id, taskData);
      } else {
        result = await TaskService.createTask(taskData);
      }

      if (result.success) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving task:', error);
      showMessage({
        message: 'Error saving task',
        description: 'Please try again',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            const result = await TaskService.deleteTask(existingTask.id);
            if (result.success) {
              navigation.goBack();
            }
            setIsLoading(false);
          },
        },
      ]
    );
  };

  // Format date display
  const formatDateDisplay = (date) => {
    if (!date) return 'Set due date';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Input */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <TextInput
              label="Task Title"
              value={title}
              onChangeText={setTitle}
              error={!!titleError}
              mode="outlined"
              style={styles.input}
              maxLength={100}
              placeholder="What needs to be done?"
              left={<TextInput.Icon icon="clipboard-text" />}
            />
            {titleError ? (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {titleError}
              </Text>
            ) : null}
          </Card.Content>
        </Card>

        {/* Description Input */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <TextInput
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              error={!!descriptionError}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={4}
              maxLength={500}
              placeholder="Add more details about this task..."
              left={<TextInput.Icon icon="text" />}
            />
            {descriptionError ? (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {descriptionError}
              </Text>
            ) : null}
            <Text style={[styles.charCount, { color: theme.colors.onSurfaceVariant }]}>
              {description.length}/500 characters
            </Text>
          </Card.Content>
        </Card>

        {/* Priority Selection */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Priority
            </Text>
            <View style={styles.priorityContainer}>
              {priorityOptions.map((option) => {
                const config = getPriorityConfig(option.value);
                const isSelected = priority === option.value;
                
                return (
                  <Chip
                    key={option.value}
                    selected={isSelected}
                    onPress={() => setPriority(option.value)}
                    icon={option.icon}
                    style={[
                      styles.priorityChip,
                      {
                        backgroundColor: isSelected ? config.color + '20' : theme.colors.surfaceVariant,
                        borderColor: isSelected ? config.color : 'transparent',
                        borderWidth: isSelected ? 2 : 0,
                      },
                    ]}
                    textStyle={{
                      color: isSelected ? config.color : theme.colors.onSurfaceVariant,
                      fontWeight: isSelected ? '600' : 'normal',
                    }}
                  >
                    {option.label}
                  </Chip>
                );
              })}
            </View>
          </Card.Content>
        </Card>

        {/* Due Date */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Due Date
            </Text>
            <Surface
              style={[styles.dateButton, { backgroundColor: theme.colors.surfaceVariant }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon
                name="calendar-clock"
                size={20}
                color={dueDate ? theme.colors.primary : theme.colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.dateButtonText,
                  {
                    color: dueDate ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
                    fontWeight: dueDate ? '600' : 'normal',
                  },
                ]}
              >
                {formatDateDisplay(dueDate)}
              </Text>
              {dueDate && (
                <IconButton
                  icon="close"
                  size={16}
                  onPress={() => setDueDate(null)}
                />
              )}
            </Surface>
          </Card.Content>
        </Card>

        {/* Status Selection (only for editing) */}
        {isEditing && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Status
              </Text>
              <SegmentedButtons
                value={status}
                onValueChange={setStatus}
                buttons={statusOptions}
                style={styles.statusButtons}
              />
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <Surface style={[styles.actionContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.actionButtons}>
          {isEditing && (
            <Button
              mode="outlined"
              onPress={handleDelete}
              disabled={isLoading}
              style={[styles.deleteButton, { borderColor: theme.colors.error }]}
              labelStyle={{ color: theme.colors.error }}
              icon="delete"
            >
              Delete
            </Button>
          )}
          
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isLoading}
            disabled={isLoading || !title.trim()}
            style={[
              styles.saveButton,
              { backgroundColor: theme.colors.primary },
              !isEditing && styles.saveButtonFull,
            ]}
            labelStyle={{ color: theme.colors.onPrimary }}
            icon={isEditing ? "content-save" : "plus"}
          >
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </View>
      </Surface>

      {/* Date Picker Modal */}
      <DatePicker
        modal
        open={showDatePicker}
        date={dueDate || new Date()}
        mode="datetime"
        onConfirm={(selectedDate) => {
          setShowDatePicker(false);
          setDueDate(selectedDate);
        }}
        onCancel={() => setShowDatePicker(false)}
        minimumDate={new Date()}
        title="Select due date and time"
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  priorityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  dateButtonText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  statusButtons: {
    borderRadius: 8,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteButton: {
    flex: 1,
    borderRadius: 8,
  },
  saveButton: {
    flex: 1,
    borderRadius: 8,
  },
  saveButtonFull: {
    flex: 2,
  },
});

export default TaskDetailScreen;