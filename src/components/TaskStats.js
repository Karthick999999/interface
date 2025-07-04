import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, ProgressBar, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const TaskStats = ({ stats }) => {
  const theme = useTheme();

  if (!stats || stats.total === 0) {
    return null;
  }

  const completionRate = stats.completionRate / 100;

  return (
    <Card style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.content}>
        {/* Main Stats Row */}
        <View style={styles.mainRow}>
          {/* Total Tasks */}
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
              <Icon name="format-list-bulleted" size={20} color={theme.colors.primary} />
            </View>
            <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
              {stats.total}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Total
            </Text>
          </View>

          {/* Completed Tasks */}
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
              <Icon name="check-circle" size={20} color={theme.colors.success} />
            </View>
            <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
              {stats.completed}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Done
            </Text>
          </View>

          {/* Open Tasks */}
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.info + '20' }]}>
              <Icon name="circle-outline" size={20} color={theme.colors.info} />
            </View>
            <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
              {stats.open}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Open
            </Text>
          </View>

          {/* Due Today */}
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '20' }]}>
              <Icon name="calendar-today" size={20} color={theme.colors.warning} />
            </View>
            <Text style={[styles.statNumber, { color: theme.colors.onSurface }]}>
              {stats.dueToday}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Today
            </Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: theme.colors.onSurface }]}>
              Progress
            </Text>
            <Text style={[styles.progressPercentage, { color: theme.colors.primary }]}>
              {stats.completionRate}%
            </Text>
          </View>
          
          <ProgressBar
            progress={completionRate}
            color={theme.colors.success}
            style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}
          />
          
          <Text style={[styles.progressSubtext, { color: theme.colors.onSurfaceVariant }]}>
            {stats.completed} of {stats.total} tasks completed
          </Text>
        </View>

        {/* Overdue Alert */}
        {stats.overdue > 0 && (
          <View style={[styles.overdueAlert, { backgroundColor: theme.colors.errorContainer }]}>
            <Icon name="alert-circle" size={16} color={theme.colors.error} />
            <Text style={[styles.overdueText, { color: theme.colors.onErrorContainer }]}>
              {stats.overdue} task{stats.overdue > 1 ? 's' : ''} overdue
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    borderRadius: 16,
  },
  content: {
    paddingVertical: 16,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  progressSubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
  overdueAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  overdueText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default TaskStats;