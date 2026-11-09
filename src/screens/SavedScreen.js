import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { ProductListState } from "../components/ProductListState";
import { Screen } from "../components/Screen";
import { listSavedProducts, removeSavedProduct } from "../services/firebaseService";
import { formatCurrency } from "../utils/cartSelectors";

export default function SavedScreen() {
  const [state, setState] = useState({ loading: true, items: [], error: null });
  const load = useCallback(() => {
    setState((current) => ({ ...current, loading: true, error: null }));
    listSavedProducts()
      .then((items) => setState({ loading: false, items, error: null }))
      .catch((error) => setState({ loading: false, items: [], error: error.message }));
  }, []);
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );
  const remove = async (item) => {
    try {
      await removeSavedProduct(item.docId);
      setState((current) => ({
        ...current,
        items: current.items.filter((saved) => saved.docId !== item.docId),
      }));
    } catch (error) {
      Alert.alert("Could not remove item", error.message);
    }
  };
  if (state.loading)
    return (
      <Screen>
        <ProductListState loading title="Loading saved items…" />
      </Screen>
    );
  if (state.error)
    return (
      <Screen>
        <ProductListState
          title="Could not load saved items"
          message={state.error}
          actionLabel="Try again"
          onAction={load}
        />
      </Screen>
    );
  if (!state.items.length)
    return (
      <Screen>
        <ProductListState
          title="No saved items"
          message="Save an item from product details to store it in Firebase."
        />
      </Screen>
    );
  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.list}
        data={state.items}
        keyExtractor={(item) => item.docId}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => router.push(`/product/${item.productId}`)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.body}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>{formatCurrency(item.price)}</Text>
              <Pressable onPress={() => remove(item)} hitSlop={8}>
                <Text style={styles.remove}>Remove</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  list: { padding: 16, gap: 10 },
  row: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
  },
  image: { width: 76, height: 76, borderRadius: 9, backgroundColor: "#e2e8f0" },
  body: { flex: 1 },
  title: { color: "#0f172a", fontWeight: "700" },
  price: { color: "#1d4ed8", fontWeight: "700", marginTop: 5 },
  remove: { color: "#b91c1c", marginTop: 10, fontWeight: "700" },
});
