import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { showMessage } from 'react-native-flash-message';
import * as Sentry from '@sentry/react-native';
import { createUser } from '../types/Task';

const STORAGE_KEYS = {
  USER: '@user',
  AUTH_TOKEN: '@auth_token',
  REFRESH_TOKEN: '@refresh_token',
};

class AuthenticationService {
  constructor() {
    this.currentUser = null;
    this.initialize();
  }

  // Initialize Google Sign-In
  async initialize() {
    try {
      GoogleSignin.configure({
        webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your Google web client ID
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });
    } catch (error) {
      console.error('Google Sign-In initialization error:', error);
      Sentry.captureException(error);
    }
  }

  // Sign in with Google
  async signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      const user = createUser({
        id: userInfo.user.id,
        name: userInfo.user.name,
        email: userInfo.user.email,
        photoUrl: userInfo.user.photo,
        provider: 'google',
        accessToken: userInfo.idToken,
      });

      // Store user data and tokens
      await this.storeUserData(user);
      await this.storeTokens(userInfo.idToken, userInfo.serverAuthCode);
      
      this.currentUser = user;
      
      showMessage({
        message: 'Sign-in successful!',
        description: `Welcome back, ${user.name}`,
        type: 'success',
        icon: 'success',
      });

      return { success: true, user };
    } catch (error) {
      console.error('Google Sign-In error:', error);
      
      let errorMessage = 'Sign-in failed. Please try again.';
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Sign-in was cancelled.';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Sign-in is already in progress.';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services not available.';
      }
      
      showMessage({
        message: 'Sign-in Error',
        description: errorMessage,
        type: 'danger',
        icon: 'danger',
      });

      Sentry.captureException(error);
      return { success: false, error: errorMessage };
    }
  }

  // Sign out
  async signOut() {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await this.clearStoredData();
      
      this.currentUser = null;
      
      showMessage({
        message: 'Signed out successfully',
        type: 'info',
        icon: 'info',
      });

      return { success: true };
    } catch (error) {
      console.error('Sign-out error:', error);
      Sentry.captureException(error);
      
      // Even if Google sign-out fails, clear local data
      await this.clearStoredData();
      this.currentUser = null;
      
      return { success: true };
    }
  }

  // Check current authentication state
  async checkAuthState() {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      
      if (isSignedIn) {
        const storedUser = await this.getStoredUser();
        if (storedUser) {
          this.currentUser = storedUser;
          return true;
        }
        
        // If no stored user but Google says signed in, get current user info
        const userInfo = await GoogleSignin.getCurrentUser();
        if (userInfo) {
          const user = createUser({
            id: userInfo.user.id,
            name: userInfo.user.name,
            email: userInfo.user.email,
            photoUrl: userInfo.user.photo,
            provider: 'google',
          });
          
          await this.storeUserData(user);
          this.currentUser = user;
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Auth state check error:', error);
      Sentry.captureException(error);
      return false;
    }
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Store user data
  async storeUserData(user) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
      Sentry.captureException(error);
    }
  }

  // Get stored user data
  async getStoredUser() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      Sentry.captureException(error);
      return null;
    }
  }

  // Store authentication tokens
  async storeTokens(accessToken, refreshToken) {
    try {
      if (accessToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
      }
      if (refreshToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
    } catch (error) {
      console.error('Error storing tokens:', error);
      Sentry.captureException(error);
    }
  }

  // Get stored tokens
  async getStoredTokens() {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);
      
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error getting stored tokens:', error);
      Sentry.captureException(error);
      return { accessToken: null, refreshToken: null };
    }
  }

  // Clear all stored authentication data
  async clearStoredData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
      ]);
    } catch (error) {
      console.error('Error clearing stored data:', error);
      Sentry.captureException(error);
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    try {
      const tokens = await GoogleSignin.getTokens();
      await this.storeTokens(tokens.accessToken, tokens.refreshToken);
      return tokens.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      Sentry.captureException(error);
      return null;
    }
  }
}

// Export singleton instance
export const AuthService = new AuthenticationService();