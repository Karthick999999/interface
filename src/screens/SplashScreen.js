import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* App Logo/Animation */}
      <View style={styles.logoContainer}>
        <View style={[styles.logoCircle, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.logoText, { color: theme.colors.primary }]}>
            ✓
          </Text>
        </View>
        <Text style={[styles.appName, { color: theme.colors.surface }]}>
          TodoMaster
        </Text>
        <Text style={[styles.tagline, { color: theme.colors.primaryContainer }]}>
          Organize your tasks efficiently
        </Text>
      </View>

      {/* Loading Indicator */}
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color={theme.colors.surface} 
          style={styles.loader}
        />
        <Text style={[styles.loadingText, { color: theme.colors.surface }]}>
          Loading your tasks...
        </Text>
      </View>

      {/* Version Info */}
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: theme.colors.primaryContainer }]}>
          Version 1.0.0
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.15,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  loadingContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: height * 0.2,
  },
  loader: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.8,
  },
  versionContainer: {
    position: 'absolute',
    bottom: 40,
  },
  versionText: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default SplashScreen;