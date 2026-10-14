import { Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";

let notificationsModule;
let configured = false;

function isExpoGo() {
  return Constants.executionEnvironment === "storeClient";
}

function getNotifications() {
  if (isExpoGo())
    throw new Error(
      "Notifications require an Android development build. Expo Go cannot run this notification workflow.",
    );
  if (notificationsModule) return notificationsModule;
  try {
    // Expo Go on Android SDK 53+ can reject this native module. Keep the rest
    // of the commerce flow usable and require a development build for this feature.
    notificationsModule = require("expo-notifications");
  } catch {
    throw new Error(
      "Notifications require an Android development build. Expo Go cannot run this notification workflow.",
    );
  }
  if (!configured) {
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
    configured = true;
  }
  return notificationsModule;
}

const CHANNEL_ID = "shop-events";

export async function getNotificationStatus() {
  if (isExpoGo()) return "development build required";
  return (await getNotifications().getPermissionsAsync()).status;
}

export async function requestNotificationPermission() {
  if (isExpoGo())
    throw new Error(
      "Notifications require an Android development build. Expo Go cannot run this notification workflow.",
    );
  if (!Device.isDevice)
    throw new Error("Use a physical device to test notification permissions.");
  const Notifications = getNotifications();
  if (Platform.OS === "android")
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Shop events",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  const current = await Notifications.getPermissionsAsync();
  const status = current.granted
    ? current
    : await Notifications.requestPermissionsAsync();
  return status.status;
}

export async function notifySavedProduct(product) {
  if (isExpoGo()) return false;
  const Notifications = getNotifications();
  const status = await getNotificationStatus();
  if (status !== "granted") return false;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Saved for later",
      body: `${product.title} was added to your wishlist.`,
      data: { url: `/product/${product.id}` },
    },
    trigger: null,
  });
  return true;
}
