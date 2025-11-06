export default {
  expo: {
    name: "Trustify",
    slug: "trustify",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "trustify",
    userInterfaceStyle: "automatic",

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0B0C10"
    },

    assetBundlePatterns: ["**/*"],

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.trustify.app",
      buildNumber: "1.0.0",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false // ✅ Required by Apple
      }
    },

    android: {
      package: "com.trustify.app",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#0B0C10"
      }
    },

    web: {
      favicon: "./assets/icon.png"
    },

    runtimeVersion: {
      policy: "appVersion"
    },

    updates: {
      url: "https://u.expo.dev/d7e33c31-bb2c-4f76-9320-c11d12e3775b",
      fallbackToCacheTimeout: 0
    },

    extra: {
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "d7e33c31-bb2c-4f76-9320-c11d12e3775b" // ✅ Your new Expo project ID
      }
    },

    // ✅ Required by EAS build moving forward
    cli: {
      appVersionSource: "remote"
    }
  }
};
