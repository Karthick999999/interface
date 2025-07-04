import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {
  Appbar,
  Card,
  Text,
  Button,
  List,
  Divider,
  useTheme,
  Surface,
  Avatar,
  ProgressBar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthService } from '../services/AuthService';
import { TaskService } from '../services/TaskService';

const ProfileScreen = ({ navigation, route }) => {
  const theme = useTheme();
  const { onLogout } = route.params || {};
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserData();
    loadTaskStats();
  }, []);

  const loadUserData = () => {
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
  };

  const loadTaskStats = () => {
    const taskStats = TaskService.getTaskStats();
    setStats(taskStats);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            await AuthService.signOut();
            if (onLogout) {
              onLogout();
            }
            setIsLoading(false);
          },
        },
      ]
    );
  };

  const handleClearAllTasks = () => {
    Alert.alert(
      'Clear All Tasks',
      'Are you sure you want to delete all tasks? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await TaskService.clearAllTasks();
            loadTaskStats();
          },
        },
      ]
    );
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getCompletionMessage = () => {
    const { completionRate, total } = stats;
    
    if (total === 0) {
      return "Ready to start your productivity journey!";
    }
    
    if (completionRate === 100) {
      return "Outstanding! You've completed all your tasks! 🎉";
    } else if (completionRate >= 80) {
      return "Excellent progress! You're almost there! 🚀";
    } else if (completionRate >= 60) {
      return "Great work! Keep up the momentum! 💪";
    } else if (completionRate >= 40) {
      return "Good start! You're making progress! ⭐";
    } else {
      return "Every journey begins with a single step! 🌱";
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* App Bar */}
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="Profile" titleStyle={styles.appBarTitle} />
        <Appbar.Action
          icon="cog"
          onPress={() => navigation.navigate('Settings')}
        />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <Card style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.profileContent}>
            <View style={styles.profileHeader}>
              {user?.photoUrl ? (
                <Avatar.Image
                  size={80}
                  source={{ uri: user.photoUrl }}
                  style={styles.avatar}
                />
              ) : (
                <Avatar.Text
                  size={80}
                  label={getUserInitials(user?.name)}
                  style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
                />
              )}
              
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.colors.onSurface }]}>
                  {user?.name || 'User'}
                </Text>
                <Text style={[styles.userEmail, { color: theme.colors.onSurfaceVariant }]}>
                  {user?.email || 'user@example.com'}
                </Text>
                <View style={styles.providerBadge}>
                  <Icon name="google" size={16} color={theme.colors.primary} />
                  <Text style={[styles.providerText, { color: theme.colors.primary }]}>
                    Google Account
                  </Text>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Task Statistics Card */}
        <Card style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Your Progress
            </Text>
            
            <Text style={[styles.completionMessage, { color: theme.colors.onSurfaceVariant }]}>
              {getCompletionMessage()}
            </Text>

            {stats.total > 0 && (
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressLabel, { color: theme.colors.onSurface }]}>
                    Overall Completion
                  </Text>
                  <Text style={[styles.progressPercentage, { color: theme.colors.primary }]}>
                    {stats.completionRate}%
                  </Text>
                </View>
                
                <ProgressBar
                  progress={stats.completionRate / 100}
                  color={theme.colors.success}
                  style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}
                />
                
                <Text style={[styles.progressSubtext, { color: theme.colors.onSurfaceVariant }]}>
                  {stats.completed} of {stats.total} tasks completed
                </Text>
              </View>
            )}

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                  {stats.total || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Total Tasks
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.success }]}>
                  {stats.completed || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Completed
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.warning }]}>
                  {stats.dueToday || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Due Today
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.error }]}>
                  {stats.overdue || 0}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Overdue
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions Card */}
        <Card style={[styles.actionsCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Quick Actions
            </Text>
            
            <List.Item
              title="Settings"
              description="App preferences and configuration"
              left={(props) => <List.Icon {...props} icon="cog" color={theme.colors.primary} />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => navigation.navigate('Settings')}
            />
            
            <Divider style={{ marginVertical: 8 }} />
            
            <List.Item
              title="Clear All Tasks"
              description="Remove all tasks from your list"
              left={(props) => <List.Icon {...props} icon="delete-sweep" color={theme.colors.warning} />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleClearAllTasks}
            />
            
            <Divider style={{ marginVertical: 8 }} />
            
            <List.Item
              title="Sign Out"
              description="Sign out of your account"
              left={(props) => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleLogout}
            />
          </Card.Content>
        </Card>

        {/* App Info Card */}
        <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              About TodoMaster
            </Text>
            
            <View style={styles.appInfoRow}>
              <Text style={[styles.appInfoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Version
              </Text>
              <Text style={[styles.appInfoValue, { color: theme.colors.onSurface }]}>
                1.0.0
              </Text>
            </View>
            
            <View style={styles.appInfoRow}>
              <Text style={[styles.appInfoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Build
              </Text>
              <Text style={[styles.appInfoValue, { color: theme.colors.onSurface }]}>
                React Native
              </Text>
            </View>
            
            <Text style={[styles.appDescription, { color: theme.colors.onSurfaceVariant }]}>
              Your personal task management companion. Simple, efficient, and always in sync.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 16,
  },
  profileContent: {
    paddingVertical: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 8,
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  statsCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  completionMessage: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 16,
  },
  infoCard: {
    elevation: 2,
    borderRadius: 16,
  },
  appInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  appInfoLabel: {
    fontSize: 14,
  },
  appInfoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  appDescription: {
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ProfileScreen;