import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "@lapnh-shop/cart-v1";
const DEVICE_ID_KEY = "@lapnh-shop/device-id-v1";

export async function loadCart() {
  const raw = await AsyncStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCart(items) {
  return AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
}

export async function getDeviceId() {
  const current = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (current) return current;
  const next = `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(DEVICE_ID_KEY, next);
  return next;
}
