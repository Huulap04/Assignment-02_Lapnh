import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export function ProductListState({ title, message, actionLabel, onAction, loading }) {
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#1d4ed8" />}
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && (
        <Pressable style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 10,
  },
  title: { color: "#0f172a", fontSize: 18, fontWeight: "700" },
  message: { textAlign: "center", color: "#64748b" },
  button: {
    backgroundColor: "#1d4ed8",
    borderRadius: 9,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 6,
  },
  buttonText: { color: "#fff", fontWeight: "700" },
});
