import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ProductCard } from "../components/ProductCard";
import { ProductListState } from "../components/ProductListState";
import { Screen } from "../components/Screen";
import { getProducts } from "../services/productService";
import { requestRecommendations } from "../services/aiService";

export default function AiRecommendationScreen() {
  const { productId } = useLocalSearchParams();
  const [need, setNeed] = useState(
    productId ? "Show alternatives that are good value." : "",
  );
  const [catalog, setCatalog] = useState([]);
  const [state, setState] = useState({
    loadingCatalog: true,
    loading: false,
    result: null,
    error: null,
  });
  useEffect(() => {
    getProducts({ limit: 100 })
      .then(({ products }) => {
        setCatalog(products);
        setState((current) => ({ ...current, loadingCatalog: false }));
      })
      .catch((error) =>
        setState((current) => ({
          ...current,
          loadingCatalog: false,
          error: error.message,
        })),
      );
  }, []);
  const ask = async () => {
    if (!need.trim())
      return setState((current) => ({
        ...current,
        error: "Describe what you need first.",
      }));
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const result = await requestRecommendations({ need, products: catalog });
      setState((current) => ({ ...current, loading: false, result }));
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error.message,
      }));
    }
  };
  if (state.loadingCatalog)
    return (
      <Screen>
        <ProductListState loading title="Preparing catalog context…" />
      </Screen>
    );
  const matches = state.result
    ? catalog.filter((product) => state.result.productIds.includes(product.id))
    : [];
  return (
    <Screen>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/product/${item.id}`)}
          />
        )}
        ListHeaderComponent={
          <View>
            <Text style={styles.description}>
              Tell the assistant what you need. It only receives the displayed catalog
              and recommendations are checked against actual product IDs before showing.
            </Text>
            <TextInput
              value={need}
              onChangeText={setNeed}
              placeholder="Example: a low-cost gift for a tech student"
              multiline
              style={styles.input}
            />
            <Pressable style={styles.button} onPress={ask} disabled={state.loading}>
              {state.loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Get recommendations</Text>
              )}
            </Pressable>
            {state.error && <Text style={styles.error}>{state.error}</Text>}
            {state.result && <Text style={styles.reason}>{state.result.reason}</Text>}
          </View>
        }
        ListEmptyComponent={
          state.result ? (
            <ProductListState
              title="No validated matches"
              message="Try changing your need."
            />
          ) : null
        }
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  list: { padding: 16 },
  description: { color: "#334155", lineHeight: 21, marginBottom: 13 },
  input: {
    minHeight: 90,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#7c3aed",
    marginVertical: 12,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "800" },
  error: { color: "#b91c1c", marginBottom: 10 },
  reason: {
    backgroundColor: "#ede9fe",
    color: "#4c1d95",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    lineHeight: 20,
  },
});
