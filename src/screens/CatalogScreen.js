import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { ProductCard } from "../components/ProductCard";
import { ProductListState } from "../components/ProductListState";
import { Screen } from "../components/Screen";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useProducts } from "../hooks/useProducts";

export default function CatalogScreen() {
  const [search, setSearch] = useState("");
  const products = useProducts(useDebouncedValue(search));
  if (products.loading)
    return (
      <Screen>
        <ProductListState loading title="Loading catalog…" />
      </Screen>
    );
  if (products.error && products.products.length === 0)
    return (
      <Screen>
        <ProductListState
          title="Could not load catalog"
          message={products.error}
          actionLabel="Try again"
          onAction={products.retry}
        />
      </Screen>
    );
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.heading}>Discover products</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search products"
          returnKeyType="search"
          style={styles.input}
          accessibilityLabel="Search products"
        />
      </View>
      {products.error && (
        <Text style={styles.error}>{products.error} Pull down to retry.</Text>
      )}
      <FlatList
        data={products.products}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/product/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={products.refreshing}
        onRefresh={products.refresh}
        onEndReached={products.loadMore}
        onEndReachedThreshold={0.45}
        ListEmptyComponent={
          <ProductListState
            title="No products found"
            message="Try a different search term."
          />
        }
        ListFooterComponent={
          products.loadingMore ? (
            <ActivityIndicator color="#1d4ed8" style={styles.footer} />
          ) : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, paddingBottom: 5 },
  heading: {
    fontSize: 25,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  list: { padding: 16, paddingTop: 8 },
  footer: { marginVertical: 14 },
  error: { color: "#b91c1c", paddingHorizontal: 16, paddingBottom: 6 },
});
