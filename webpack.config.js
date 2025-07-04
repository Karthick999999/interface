const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: [
        '@react-native-google-signin/google-signin',
        'react-native-vector-icons',
        'react-native-paper',
        'react-native-reanimated',
        'react-native-gesture-handler',
        'react-native-date-picker',
        'react-native-flash-message',
        'lottie-react-native',
      ],
    },
  }, argv);

  // Customize the config before returning it.
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
    'react-native-vector-icons': 'react-native-vector-icons/dist',
  };

  // Handle source maps
  if (argv.mode === 'production') {
    config.devtool = 'source-map';
  }

  return config;
};