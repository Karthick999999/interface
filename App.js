import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FlashMessage from 'react-native-flash-message';
import { StatusBar, StyleSheet } from 'react-native';
import * as Sentry from '@sentry/react-native';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import SplashScreen from './src/screens/SplashScreen';

// Import services
import { AuthService } from './src/services/AuthService';
import { theme } from './src/theme/theme';

// Initialize Sentry for crash reporting
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN_HERE', // Replace with your Sentry DSN
  debug: __DEV__,
});

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const authState = await AuthService.checkAuthState();
      setIsAuthenticated(authState);
    } catch (error) {
      console.error('Error checking auth state:', error);
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
              <Stack.Screen name="Main">
                {(props) => <MainTabNavigator {...props} onLogout={handleLogout} />}
              </Stack.Screen>
            ) : (
              <Stack.Screen name="Login">
                {(props) => <LoginScreen {...props} onAuthSuccess={handleAuthSuccess} />}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <FlashMessage position="top" />
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Sentry.wrap(App);