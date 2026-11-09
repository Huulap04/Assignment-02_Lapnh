import { Tabs } from "expo-router";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useCart } from "../context/CartContext";

export default function TabLayout() {
  const { itemCount } = useCart();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        tabBarActiveTintColor: "#1d4ed8",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Shop",
          tabBarLabel: "Shop",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "storefront" : "storefront-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "My cart",
          tabBarBadge: itemCount || undefined,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "bookmark" : "bookmark-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
