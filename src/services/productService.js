const API_URL = "https://dummyjson.com/products";

function normalizeProduct(product) {
  return {
    id: String(product.id),
    title: product.title,
    description: product.description,
    price: Number(product.price),
    rating: Number(product.rating || 0),
    category: product.category,
    image: product.thumbnail || product.images?.[0],
    stock: Number(product.stock || 0),
  };
}

export async function getProducts({ query = "", skip = 0, limit = 12, signal } = {}) {
  const endpoint = query.trim()
    ? `${API_URL}/search?q=${encodeURIComponent(query.trim())}&limit=${limit}&skip=${skip}`
    : `${API_URL}?limit=${limit}&skip=${skip}`;
  const response = await fetch(endpoint, { signal });
  if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
  const data = await response.json();
  return {
    products: (data.products || []).map(normalizeProduct),
    total: Number(data.total || 0),
  };
}

export async function getProduct(id) {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Product request failed (${response.status})`);
  return normalizeProduct(await response.json());
}
