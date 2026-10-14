import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "../utils/cartSelectors";

export function ProductCard({ product, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${product.title}`}
      onPress={onPress}
      style={styles.card}
    >
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.body}>
        <Text numberOfLines={2} style={styles.title}>
          {product.title}
        </Text>
        <Text numberOfLines={1} style={styles.category}>
          {product.category}
        </Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
    flexDirection: "row",
    elevation: 1,
  },
  image: { width: 105, height: 105, backgroundColor: "#e2e8f0" },
  body: { padding: 12, flex: 1 },
  title: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  category: { color: "#64748b", marginTop: 3, textTransform: "capitalize" },
  price: { color: "#1d4ed8", fontSize: 17, fontWeight: "800", marginTop: 7 },
  rating: { color: "#b45309", marginTop: 2 },
});
