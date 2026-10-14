import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Screen } from "../../components/Screen";
import { useCart } from "../../context/CartContext";
import { saveProduct } from "../../services/firebaseService";
import { notifySavedProduct } from "../../services/notificationService";
import { getProduct } from "../../services/productService";
import { formatCurrency } from "../../utils/cartSelectors";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { add } = useCart();
  const [state, setState] = useState({
    loading: true,
    product: null,
    error: null,
    saving: false,
  });

  useEffect(() => {
    getProduct(id)
      .then((product) => {
        setState({ loading: false, product, error: null, saving: false });
      })
      .catch((error) => {
        setState({
          loading: false,
          product: null,
          error: error.message,
          saving: false,
        });
      });
  }, [id]);

  if (state.loading) {
    return (
      <Screen style={styles.center}>
        <ActivityIndicator size="large" color="#1d4ed8" />
      </Screen>
    );
  }

  if (!state.product) {
    return (
      <Screen style={styles.center}>
        <Text style={styles.error}>{state.error || "Product not found."}</Text>
      </Screen>
    );
  }

  const product = state.product;
  const addToCart = () => {
    add(product);
    Alert.alert("Added to cart", `${product.title} is in your cart.`);
  };

  const saveToWishlist = async () => {
    setState((current) => ({ ...current, saving: true }));

    try {
      const result = await saveProduct(product);

      if (!result.alreadySaved) {
        await notifySavedProduct(product);
      }

      Alert.alert(
        result.alreadySaved ? "Already saved" : "Saved",
        result.alreadySaved ? "This item is already in your wishlist." : "Item saved.",
      );
    } catch (error) {
      Alert.alert("Could not save item", error.message);
    } finally {
      setState((current) => ({ ...current, saving: false }));
    }
  };

  const openAiHelper = () => {
    router.push({
      pathname: "/ai-recommendation",
      params: { productId: product.id },
    });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        <Text style={styles.rating}>
          ★ {product.rating.toFixed(1)} · {product.stock} in stock
        </Text>
        <Text style={styles.description}>{product.description}</Text>

        <Pressable style={styles.primary} onPress={addToCart}>
          <Text style={styles.primaryText}>Add to cart</Text>
        </Pressable>
        <Pressable
          disabled={state.saving}
          style={styles.secondary}
          onPress={saveToWishlist}
        >
          <Text style={styles.secondaryText}>
            {state.saving ? "Saving…" : "Save to wishlist"}
          </Text>
        </Pressable>
        <Pressable style={styles.ai} onPress={openAiHelper}>
          <Text style={styles.aiText}>Ask AI for alternatives</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center", padding: 24 },
  content: { padding: 18 },
  image: {
    height: 280,
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#e2e8f0",
  },
  category: { color: "#64748b", textTransform: "capitalize", marginTop: 16 },
  title: { fontSize: 26, fontWeight: "800", color: "#0f172a", marginTop: 4 },
  price: { color: "#1d4ed8", fontSize: 22, fontWeight: "800", marginTop: 10 },
  rating: { color: "#b45309", marginTop: 6 },
  description: { color: "#334155", fontSize: 16, lineHeight: 23, marginTop: 16 },
  primary: {
    backgroundColor: "#1d4ed8",
    padding: 15,
    borderRadius: 11,
    alignItems: "center",
    marginTop: 24,
  },
  primaryText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  secondary: {
    borderWidth: 1,
    borderColor: "#1d4ed8",
    padding: 14,
    borderRadius: 11,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryText: { color: "#1d4ed8", fontWeight: "800" },
  ai: { padding: 14, alignItems: "center", marginTop: 5 },
  aiText: { color: "#7c3aed", fontWeight: "700" },
  error: { color: "#b91c1c" },
});
