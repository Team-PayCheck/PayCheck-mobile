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
    bundleIdentifier: 'com.teampaycheck.paycheck',
    supportsTablet: true,
    appleTeamId: '4XTGL2D5GF',
    "infoPlist": {
      "ITSAppUsesNonExemptEncryption": false
    },
  },
  android: {
    package: 'com.teampaycheck.paycheck',
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
    kakaoAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY || '',
    kakaoRestApiKey: process.env.KAKAO_REST_API_KEY || '',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  updates: {
    url: 'https://u.expo.dev/29f43f5b-d91e-4f24-9d57-7307abc841c3',
  },
  plugins: [
    [
      "@react-native-seoul/kakao-login",
      {
        kakaoAppKey: process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY,
        kotlinVersion: "1.9.0", 
      },
    ],
    "expo-dev-client",
    'expo-font',
    [
      "expo-build-properties",
      {
        ios: {
          
        },
        android: {
          kotlinVersion: "1.9.0",
          enableProguardInReleaseBuilds: true,
        },
      },
    ],
  ],
};

export default config;
