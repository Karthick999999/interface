# TodoMaster - Cross-Platform Task Management App

A beautiful and intuitive cross-platform mobile application for managing personal tasks, built with React Native. TodoMaster helps you organize your life with a clean, modern interface and powerful features.

![TodoMaster](https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.72.0-61DAFB)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔐 Authentication
- **Google Sign-In** - Secure authentication using Google accounts
- **Session Management** - Persistent login with automatic token refresh
- **Error Handling** - Comprehensive error states and user feedback

### 📝 Task Management
- **Full CRUD Operations** - Create, Read, Update, Delete tasks
- **Task Fields**:
  - Title and description
  - Due date and time
  - Priority levels (Low, Medium, High, Urgent)
  - Status tracking (Open, In Progress, Completed)
- **Smart Filtering**:
  - All tasks
  - Open tasks
  - Completed tasks
  - Due today
  - Overdue tasks
- **Search & Sort** - Find tasks quickly with search and multiple sorting options

### 🎨 User Experience
- **Material Design 3** - Modern, beautiful UI following Google's design guidelines
- **Smooth Animations** - Fluid interactions powered by React Native Reanimated
- **Gesture Support**:
  - Swipe right to complete tasks
  - Swipe left to delete tasks
- **Pull-to-Refresh** - Easy data refreshing
- **Empty States** - Helpful guidance when no tasks are available
- **Progress Tracking** - Visual progress indicators and statistics

### 📱 Mobile-First Design
- **Cross-Platform** - Single codebase for iOS and Android
- **Responsive Layout** - Optimized for different screen sizes
- **Touch-Friendly** - Large touch targets and intuitive gestures
- **Accessibility** - Built with accessibility best practices

### 🔄 Offline Support
- **Local Storage** - Tasks stored locally using AsyncStorage
- **Offline Operations** - Create, edit, and delete tasks offline
- **Sync on Reconnect** - Automatic synchronization when back online
- **Network Status** - Visual indicators for connection status

### 🛠 Developer Features
- **Crash Reporting** - Integrated Sentry for error tracking
- **Performance Monitoring** - Optimized for smooth performance
- **Modular Architecture** - Clean, maintainable code structure
- **TypeScript-like** - Strong typing patterns for better development

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 16.0.0)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- CocoaPods (for iOS dependencies)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/todomaster.git
   cd todomaster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Configure Google Sign-In**
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/)
   - Enable Google Sign-In API
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Place the files in the appropriate directories
   - Update the `webClientId` in `src/services/AuthService.js`

5. **Configure Sentry** (Optional)
   - Create a Sentry account and project
   - Update the DSN in `App.js`

### Running the App

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

#### Development Server
```bash
npm start
```

## 📁 Project Structure

```
TodoMaster/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── TaskItem.js      # Individual task display component
│   │   ├── TaskStats.js     # Task statistics component
│   │   └── EmptyState.js    # No data state component
│   ├── navigation/          # Navigation configuration
│   │   └── MainTabNavigator.js
│   ├── screens/             # Main app screens
│   │   ├── SplashScreen.js
│   │   ├── LoginScreen.js
│   │   ├── TaskListScreen.js
│   │   ├── TaskDetailScreen.js
│   │   ├── ProfileScreen.js
│   │   └── SettingsScreen.js
│   ├── services/            # Business logic and APIs
│   │   ├── AuthService.js   # Authentication management
│   │   └── TaskService.js   # Task CRUD operations
│   ├── theme/               # Design system
│   │   └── theme.js         # Material Design 3 theme
│   └── types/               # Type definitions
│       └── Task.js          # Task-related types and utilities
├── App.js                   # Main app component
├── index.js                 # App entry point
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🎯 Core Components

### TaskService
Central service for all task-related operations:
- CRUD operations with local storage
- Offline support with sync capabilities
- Real-time updates via listeners
- Data validation and error handling

### AuthService
Handles all authentication flows:
- Google Sign-In integration
- Token management and refresh
- Secure storage of user data
- Session persistence

### Navigation
Structured navigation with:
- Tab-based main navigation
- Stack navigation for detailed views
- Proper back navigation handling
- Deep linking support

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
GOOGLE_WEB_CLIENT_ID=your_google_web_client_id
SENTRY_DSN=your_sentry_dsn
API_BASE_URL=your_api_base_url
```

### Google Sign-In Setup

1. **Android Configuration**
   - Place `google-services.json` in `android/app/`
   - Update `android/app/build.gradle` with the plugin

2. **iOS Configuration**
   - Place `GoogleService-Info.plist` in `ios/TodoTaskManager/`
   - Add URL scheme to `ios/TodoTaskManager/Info.plist`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📦 Building for Production

### Android
```bash
cd android
./gradlew assembleRelease
```

### iOS
```bash
xcodebuild -workspace ios/TodoTaskManager.xcworkspace \
           -scheme TodoTaskManager \
           -configuration Release
```

## 🚀 Deployment

### Android (Google Play Store)
1. Generate signed APK/AAB
2. Upload to Google Play Console
3. Follow the release process

### iOS (App Store)
1. Archive the app in Xcode
2. Upload to App Store Connect
3. Submit for review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and structure
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Test on both iOS and Android

## 📋 Roadmap

- [ ] Dark mode support
- [ ] Push notifications
- [ ] Task categories and tags
- [ ] Recurring tasks
- [ ] Team collaboration features
- [ ] Calendar integration
- [ ] Widget support
- [ ] Export/import functionality
- [ ] Voice input for tasks
- [ ] Apple Sign-In support

## 🐛 Known Issues

- Dark mode toggle is present but not fully implemented
- Some animations may lag on older devices
- Offline sync requires manual trigger in some cases

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Native](https://reactnative.dev/) - The framework that powers this app
- [React Native Paper](https://reactnativepaper.com/) - Material Design components
- [React Navigation](https://reactnavigation.org/) - Navigation library
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animation library
- [Google Sign-In](https://developers.google.com/identity/sign-in/android) - Authentication
- [Sentry](https://sentry.io/) - Error tracking and monitoring

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/your-username/todomaster/issues) section
2. Create a new issue if your problem isn't already reported
3. Contact us at support@todomaster.com

---

**Made with ❤️ by the TodoMaster Team**
