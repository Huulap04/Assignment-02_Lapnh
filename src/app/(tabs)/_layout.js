import { Tabs } from "expo-router";
import { useCart } from "../../context/CartContext";

export default function TabLayout() {
  const { itemCount } = useCart();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        tabBarActiveTintColor: "#1d4ed8",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Shop", tabBarLabel: "Shop" }} />
      <Tabs.Screen
        name="cart"
        options={{ title: "My cart", tabBarBadge: itemCount || undefined }}
      />
      <Tabs.Screen name="saved" options={{ title: "Saved" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
