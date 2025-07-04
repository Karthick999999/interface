import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  ScrollView,
} from 'react-native';
import {
  Button,
  Card,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthService } from '../services/AuthService';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ onAuthSuccess }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await AuthService.signInWithGoogle();
      
      if (result.success) {
        onAuthSuccess();
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={[styles.logoCircle, { backgroundColor: theme.colors.primary }]}>
            <Icon 
              name="check-circle" 
              size={60} 
              color={theme.colors.surface} 
            />
          </View>
          
          <Text style={[styles.appTitle, { color: theme.colors.onBackground }]}>
            Welcome to TodoMaster
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Organize your life, one task at a time
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Icon 
              name="lightning-bolt" 
              size={32} 
              color={theme.colors.primary} 
              style={styles.featureIcon}
            />
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: theme.colors.onBackground }]}>
                Fast & Intuitive
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.onSurfaceVariant }]}>
                Create and manage tasks effortlessly
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon 
              name="cloud-sync" 
              size={32} 
              color={theme.colors.primary} 
              style={styles.featureIcon}
            />
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: theme.colors.onBackground }]}>
                Sync Everywhere
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.onSurfaceVariant }]}>
                Access your tasks from any device
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Icon 
              name="shield-check" 
              size={32} 
              color={theme.colors.primary} 
              style={styles.featureIcon}
            />
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: theme.colors.onBackground }]}>
                Secure & Private
              </Text>
              <Text style={[styles.featureDescription, { color: theme.colors.onSurfaceVariant }]}>
                Your data is protected and encrypted
              </Text>
            </View>
          </View>
        </View>

        {/* Login Section */}
        <Card style={[styles.loginCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.loginContent}>
            <Text style={[styles.loginTitle, { color: theme.colors.onSurface }]}>
              Get Started
            </Text>
            
            <Text style={[styles.loginSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Sign in with your Google account to continue
            </Text>

            <Button
              mode="contained"
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              style={[styles.googleButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.buttonContent}
              labelStyle={[styles.buttonLabel, { color: theme.colors.onPrimary }]}
              icon={({ size, color }) => (
                <Icon name="google" size={size} color={color} />
              )}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={theme.colors.onPrimary} />
              ) : (
                'Continue with Google'
              )}
            </Button>

            <Text style={[styles.termsText, { color: theme.colors.onSurfaceVariant }]}>
              By signing in, you agree to our Terms of Service and Privacy Policy
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.08,
    paddingBottom: 32,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 48,
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
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIcon: {
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  loginCard: {
    elevation: 4,
    borderRadius: 16,
  },
  loginContent: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  googleButton: {
    marginBottom: 24,
    borderRadius: 12,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.8,
  },
});

export default LoginScreen;