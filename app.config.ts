import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'PayCheck-mobile',
  slug: 'PayCheck-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    eas: {
      projectId: '29f43f5b-d91e-4f24-9d57-7307abc841c3',
    },
    backendApiUrl: process.env.EXPO_PUBLIC_BACKEND_API_URL || 'http://localhost:3000',
    appEnv: process.env.EXPO_PUBLIC_APP_ENV || 'development',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: 'https://u.expo.dev/29f43f5b-d91e-4f24-9d57-7307abc841c3',
  },
  plugins: [
    'expo-font',
    "expo-build-properties"
  ],
};

export default config;
