import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import {
  Card,
  Text,
  Switch,
  List,
  Divider,
  useTheme,
  Button,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();
  
  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleAbout = () => {
    Alert.alert(
      'About TodoMaster',
      'TodoMaster v1.0.0\n\nA cross-platform task management app built with React Native.\n\nDeveloped with ❤️ for productivity enthusiasts.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Your privacy is important to us. This app stores your task data locally on your device and syncs with your Google account when signed in.\n\nWe do not share your personal data with third parties.',
      [{ text: 'OK' }]
    );
  };

  const handleTermsOfService = () => {
    Alert.alert(
      'Terms of Service',
      'By using TodoMaster, you agree to use the app responsibly and in accordance with applicable laws.\n\nThe app is provided "as is" without warranties of any kind.',
      [{ text: 'OK' }]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Send Feedback',
      'We\'d love to hear from you! Please share your thoughts, suggestions, or report any issues.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Email', 
          onPress: () => {
            Linking.openURL('mailto:support@todomaster.com?subject=TodoMaster Feedback');
          }
        },
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate TodoMaster',
      'If you enjoy using TodoMaster, please consider rating it on the app store!',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { 
          text: 'Rate Now', 
          onPress: () => {
            // In a real app, this would open the app store
            Alert.alert('Thank you!', 'This would open the app store in a real app.');
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export your tasks to a file for backup or transfer to another device.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            // In a real app, this would export task data
            Alert.alert('Success', 'Data exported successfully!');
          }
        },
      ]
    );
  };

  const SettingSection = ({ title, children }) => (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
          {title}
        </Text>
        {children}
      </Card.Content>
    </Card>
  );

  const SettingItem = ({ 
    title, 
    description, 
    icon, 
    iconColor, 
    value, 
    onValueChange, 
    onPress,
    showSwitch = false,
    showChevron = false 
  }) => (
    <List.Item
      title={title}
      description={description}
      left={(props) => <List.Icon {...props} icon={icon} color={iconColor || theme.colors.primary} />}
      right={() => {
        if (showSwitch) {
          return (
            <Switch
              value={value}
              onValueChange={onValueChange}
              color={theme.colors.primary}
            />
          );
        }
        if (showChevron) {
          return <List.Icon icon="chevron-right" color={theme.colors.onSurfaceVariant} />;
        }
        return null;
      }}
      onPress={onPress}
      titleStyle={{ color: theme.colors.onSurface }}
      descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Notifications Settings */}
        <SettingSection title="Notifications">
          <SettingItem
            title="Push Notifications"
            description="Receive notifications for due tasks"
            icon="bell"
            value={notifications}
            onValueChange={setNotifications}
            showSwitch
          />
          
          <Divider style={styles.divider} />
          
          <SettingItem
            title="Email Notifications"
            description="Get task reminders via email"
            icon="email"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
            showSwitch
          />
          
          <Divider style={styles.divider} />
          
          <SettingItem
            title="Sound"
            description="Play sound for notifications"
            icon="volume-high"
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            showSwitch
          />
          
          <Divider style={styles.divider} />
          
          <SettingItem
            title="Vibration"
            description="Vibrate for notifications"
            icon="vibrate"
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            showSwitch
          />
        </SettingSection>

        {/* App Preferences */}
        <SettingSection title="Preferences">
          <SettingItem
            title="Auto Sync"
            description="Automatically sync tasks when online"
            icon="sync"
            value={autoSync}
            onValueChange={setAutoSync}
            showSwitch
          />
          
          <Divider style={styles.divider} />
          
          <SettingItem
            title="Dark Mode"
            description="Use dark theme (Coming Soon)"
            icon="theme-light-dark"
            value={darkMode}
            onValueChange={setDarkMode}
            showSwitch
          />
        </SettingSection>

        {/* Data Management */}
        <SettingSection title="Data Management">
          <SettingItem
            title="Export Data"
            description="Export tasks to a file"
            icon="export"
            onPress={handleExportData}
            showChevron
          />
          
          <Divider style={styles.divider} />
          
          <SettingItem
            title="Storage Used"
            description="View app storage usage"
            icon="harddisk"
            onPress={() => Alert.alert('Storage', 'Approximately 2.5 MB used')}
            showChevron
          />
        </SettingSection>

        {/* Support & Feedback */}
        <SettingSection title="Support & Feedback">
          <SettingItem
            title="Send Feedback"
            description="Share your thoughts and suggestions"
            icon="message-text"
            onPress={handleFeedback}
            showChevron
          />
          
          <Divider style={styles.divider} />
          
          <SettingItem
            title="Rate App"
            description="Rate TodoMaster on the app store"
            icon="star"
            iconColor={theme.colors.warning}
            onPress={handleRateApp}
            showChevron
          />
          
          <Divider style={styles.divider} />
          
          <SettingItem
            title="Help & FAQ"
            description="Get help using the app"
            icon="help-circle"
            onPress={() => Alert.alert('Help', 'Help documentation would be available here.')}
            showChevron
          />
        </SettingSection>

        {/* Legal */}
        <SettingSection title="Legal">
          <SettingItem
            title="Privacy Policy"
            description="How we handle your data"
            icon="shield-account"
            onPress={handlePrivacyPolicy}
            showChevron
          />
          
          <Divider style={styles.divider} />
          
          <SettingItem
            title="Terms of Service"
            description="App usage terms and conditions"
            icon="file-document"
            onPress={handleTermsOfService}
            showChevron
          />
          
          <Divider style={styles.divider} />
          
          <SettingItem
            title="About"
            description="App version and information"
            icon="information"
            onPress={handleAbout}
            showChevron
          />
        </SettingSection>

        {/* Version Info */}
        <Card style={[styles.versionCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content style={styles.versionContent}>
            <Icon name="clipboard-check" size={32} color={theme.colors.primary} />
            <Text style={[styles.versionText, { color: theme.colors.onSurfaceVariant }]}>
              TodoMaster v1.0.0
            </Text>
            <Text style={[styles.buildText, { color: theme.colors.onSurfaceVariant }]}>
              Build 2024.01.01
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 8,
  },
  versionCard: {
    elevation: 1,
    borderRadius: 12,
    marginTop: 16,
  },
  versionContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  buildText: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default SettingsScreen;