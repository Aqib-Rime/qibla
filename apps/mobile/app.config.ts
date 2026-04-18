import type { ExpoConfig } from "expo/config"

const config: ExpoConfig = {
  name: "Qibla",
  slug: "qibla",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "qibla",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.aqib.qibla",
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        "Qibla uses your location to show nearby mosques, prayer times, and the direction to Mecca.",
      ITSAppUsesNonExemptEncryption: false,
    },
    config: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_IOS,
    },
  },
  android: {
    package: "com.aqib.qibla",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "POST_NOTIFICATIONS",
    ],
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
      },
    },
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    "expo-secure-store",
    "expo-dev-client",
    [
      "expo-notifications",
      {
        color: "#2e5d45",
      },
    ],
    [
      "expo-location",
      {
        locationWhenInUsePermission:
          "Qibla uses your location to show nearby mosques and direction to Mecca.",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
    autolinkingModuleResolution: true,
  },
}

export default config
