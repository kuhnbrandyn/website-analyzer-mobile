export default {
  expo: {
    name: "Trustify",
    slug: "trustify",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0B0C10"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.trustify.app",
      buildNumber: "1.0.0"
    },
    android: {
      package: "com.trustify.app",
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#0B0C10"
      },
      versionCode: 1
    },
    web: {
      favicon: "./assets/icon.png"
    },
    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "d7e33c31-bb2c-4f76-9320-c11d12e3775b" // ✅ your new Expo project ID
      }
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    updates: {
      url: "https://u.expo.dev/d7e33c31-bb2c-4f76-9320-c11d12e3775b"
    }
  }
};
