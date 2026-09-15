import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vizu.app',
  appName: 'Vizu',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  }
};

export default config;
