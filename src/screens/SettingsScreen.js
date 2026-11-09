import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import {
  getNotificationStatus,
  requestNotificationPermission,
} from "../services/notificationService";

export default function SettingsScreen() {
  const [status, setStatus] = useState("checking");
  const refresh = () =>
    getNotificationStatus()
      .then(setStatus)
      .catch((error) => setStatus(`error: ${error.message}`));
  useEffect(() => {
    refresh();
  }, []);
  const request = async () => {
    try {
      setStatus(await requestNotificationPermission());
    } catch (error) {
      Alert.alert("Notification unavailable", error.message);
      refresh();
    }
  };
  return (
    <Screen>
      <View style={styles.content}>
        <Text style={styles.heading}>Notifications</Text>
        <Text style={styles.text}>
          Business notifications confirm that a wishlist item was saved. Permission
          status: <Text style={styles.status}>{status}</Text>
        </Text>
        <Pressable style={styles.button} onPress={request}>
          <Text style={styles.buttonText}>Request notification permission</Text>
        </Pressable>
        <Text style={styles.hint}>
          If permission is denied, shopping and saved items still work normally.
        </Text>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  content: { padding: 20 },
  heading: { fontSize: 22, fontWeight: "800", color: "#0f172a" },
  text: { color: "#334155", marginTop: 12, lineHeight: 22 },
  status: { fontWeight: "800", color: "#1d4ed8" },
  button: {
    backgroundColor: "#1d4ed8",
    marginTop: 20,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "800" },
  hint: { marginTop: 13, color: "#64748b", fontStyle: "italic" },
});
