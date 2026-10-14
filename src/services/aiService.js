export async function requestRecommendations({ need, products }) {
  const endpoint = process.env.EXPO_PUBLIC_AI_PROXY_URL;
  const catalog = products.map(({ id, title, category, price, rating }) => ({
    id,
    title,
    category,
    price,
    rating,
  }));
  let data;
  if (endpoint) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ need, catalog }),
    });
    if (!response.ok) throw new Error(`AI request failed (${response.status})`);
    data = await response.json();
  } else {
    data = await requestGeminiDirectly({ need, catalog });
  }
  if (!Array.isArray(data.productIds) || typeof data.reason !== "string")
    throw new Error("AI returned an invalid response.");
  const ids = new Set(products.map((product) => product.id));
  const matchedIds = data.productIds.filter((id) => ids.has(String(id))).map(String);
  if (matchedIds.length === 0)
    throw new Error("AI suggested products not present in this catalog.");
  return { productIds: matchedIds, reason: data.reason.slice(0, 500) };
}

const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
];

async function callGeminiModel({ model, apiKey, prompt }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    return await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                productIds: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                  maxItems: 3,
                },
                reason: { type: "STRING" },
              },
              required: ["productIds", "reason"],
            },
          },
        }),
      },
    );
  } finally {
    clearTimeout(timeout);
  }
}

async function requestGeminiDirectly({ need, catalog }) {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey)
    throw new Error(
      "AI is not configured. Add EXPO_PUBLIC_GEMINI_API_KEY to .env, then restart Expo.",
    );
  const prompt = [
    "You are a shopping recommendation service.",
    `Customer need: ${need}`,
    "Choose up to 3 product IDs only from the given catalog. Do not invent products.",
    `Catalog: ${JSON.stringify(catalog)}`,
  ].join("\n");

  let lastError = null;
  for (const model of GEMINI_MODELS) {
    let response;
    try {
      response = await callGeminiModel({ model, apiKey, prompt });
    } catch (_error) {
      lastError = new Error(`Gemini ${model} timed out or could not be reached.`);
      continue;
    }
    if (response.status === 503 || response.status === 429) {
      // Overloaded — try next model
      let detail = "";
      try {
        detail = (await response.json()).error?.message || "";
      } catch {
        /* ignore */
      }
      lastError = new Error(detail || `Gemini request failed (${response.status})`);
      continue;
    }
    if (!response.ok) {
      let detail = "";
      try {
        detail = (await response.json()).error?.message || "";
      } catch {
        /* Preserve the status fallback. */
      }
      throw new Error(
        detail
          ? `Gemini error: ${detail}`
          : `Gemini request failed (${response.status})`,
      );
    }
    const raw = await response.json();
    const text = raw.candidates?.[0]?.content?.parts?.[0]?.text;
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("Gemini returned unreadable JSON.");
    }
  }
  throw lastError ?? new Error("All Gemini models are currently unavailable.");
}
