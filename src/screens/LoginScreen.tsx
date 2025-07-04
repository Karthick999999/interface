import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Button,
  Card,
  Text,
  ActivityIndicator,
  Snackbar,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const { signIn, isLoading } = useAuth();
  const [error, setError] = useState<string>('');

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      await signIn();
    } catch (err) {
      const errorMessage = 'Failed to sign in. Please try again.';
      setError(errorMessage);
      Alert.alert('Sign In Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* App Logo/Icon */}
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: 'https://img.icons8.com/color/96/000000/todo-list.png',
            }}
            style={styles.logo}
          />
          <Text variant="headlineLarge" style={styles.title}>
            Todo Manager
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Organize your tasks efficiently
          </Text>
        </View>

        {/* Login Card */}
        <Card style={styles.loginCard}>
          <Card.Content style={styles.cardContent}>
            <Text variant="headlineSmall" style={styles.welcomeText}>
              Welcome!
            </Text>
            <Text variant="bodyMedium" style={styles.descriptionText}>
              Sign in with your Google account to get started
            </Text>

            <Button
              mode="contained"
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              style={styles.signInButton}
              icon="google"
              contentStyle={styles.buttonContent}
            >
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>

            {isLoading && (
              <ActivityIndicator
                animating={true}
                size="small"
                style={styles.loadingIndicator}
              />
            )}
          </Card.Content>
        </Card>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text variant="titleSmall" style={styles.featuresTitle}>
            Features:
          </Text>
          <Text variant="bodySmall" style={styles.featureText}>
            • Create and manage tasks
          </Text>
          <Text variant="bodySmall" style={styles.featureText}>
            • Set due dates and priorities
          </Text>
          <Text variant="bodySmall" style={styles.featureText}>
            • Filter and search tasks
          </Text>
          <Text variant="bodySmall" style={styles.featureText}>
            • Offline support
          </Text>
        </View>
      </View>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError('')}
        duration={4000}
        style={styles.snackbar}
      >
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2196F3',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  loginCard: {
    width: width * 0.9,
    maxWidth: 400,
    elevation: 4,
    marginBottom: 30,
  },
  cardContent: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  descriptionText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  signInButton: {
    marginBottom: 16,
    paddingVertical: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loadingIndicator: {
    marginTop: 8,
  },
  featuresContainer: {
    alignItems: 'flex-start',
    width: width * 0.8,
    maxWidth: 300,
  },
  featuresTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  featureText: {
    color: '#666',
    marginBottom: 4,
  },
  snackbar: {
    marginBottom: 20,
  },
});

export default LoginScreen;