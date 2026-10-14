import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { ProductListState } from "../../components/ProductListState";
import { Screen } from "../../components/Screen";
import { formatCurrency } from "../../utils/cartSelectors";

export default function CartScreen() {
  const { items, subtotal, setQuantity, remove, clear } = useCart();
  if (!items.length)
    return (
      <Screen>
        <ProductListState
          title="Your cart is empty"
          message="Add a product from the catalog to get started."
        />
      </Screen>
    );
  return (
    <Screen>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.body}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              <View style={styles.quantity}>
                <Pressable
                  onPress={() => setQuantity(item.id, item.quantity - 1)}
                  style={styles.quantityButton}
                >
                  <Text>−</Text>
                </Pressable>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <Pressable
                  onPress={() => setQuantity(item.id, item.quantity + 1)}
                  style={styles.quantityButton}
                >
                  <Text>+</Text>
                </Pressable>
                <Pressable onPress={() => remove(item.id)}>
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.summary}>
            <Text style={styles.total}>Subtotal: {formatCurrency(subtotal)}</Text>
            <Pressable
              style={styles.checkout}
              onPress={() => {
                Alert.alert("Demo checkout", "Your cart has been cleared.");
                clear();
              }}
            >
              <Text style={styles.checkoutText}>Checkout (demo)</Text>
            </Pressable>
          </View>
        }
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  list: { padding: 16, gap: 10 },
  row: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    gap: 10,
  },
  image: { width: 75, height: 75, borderRadius: 8, backgroundColor: "#e2e8f0" },
  body: { flex: 1 },
  title: { color: "#0f172a", fontWeight: "700" },
  price: { color: "#1d4ed8", fontWeight: "700", marginTop: 4 },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: "#e2e8f0",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: { fontWeight: "700" },
  remove: { color: "#b91c1c", marginLeft: 6 },
  summary: { paddingTop: 18 },
  total: {
    fontSize: 19,
    color: "#0f172a",
    fontWeight: "800",
    textAlign: "right",
  },
  checkout: {
    backgroundColor: "#1d4ed8",
    marginTop: 12,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontWeight: "800" },
});
