const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { GoogleGenAI } = require("@google/genai");

const geminiApiKey = defineSecret("GEMINI_API_KEY");

function validateInput(body) {
  if (!body || typeof body.need !== "string" || !Array.isArray(body.catalog))
    return null;
  const need = body.need.trim().slice(0, 500);
  const catalog = body.catalog
    .slice(0, 100)
    .map((product) => ({
      id: String(product.id || ""),
      title: String(product.title || "").slice(0, 120),
      category: String(product.category || "").slice(0, 80),
      price: Number(product.price),
      rating: Number(product.rating),
    }))
    .filter((product) => product.id && product.title && Number.isFinite(product.price));
  return need && catalog.length ? { need, catalog } : null;
}

exports.recommendProducts = onRequest(
  {
    region: "asia-southeast1",
    cors: true,
    timeoutSeconds: 60,
    secrets: [geminiApiKey],
  },
  async (request, response) => {
    if (request.method !== "POST")
      return response.status(405).json({ error: "Use POST." });
    const input = validateInput(request.body);
    if (!input)
      return response
        .status(400)
        .json({ error: "A need and non-empty catalog are required." });

    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });
      const prompt = [
        "You are a shopping recommendation service.",
        `Customer need: ${input.need}`,
        "Choose up to 3 product IDs only from this catalog.",
        "Return only valid JSON with this exact shape:",
        '{"productIds":["id"],"reason":"brief explanation"}',
        `Catalog: ${JSON.stringify(input.catalog)}`,
      ].join("\n");
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      const parsed = JSON.parse(result.text || "");
      if (!Array.isArray(parsed.productIds) || typeof parsed.reason !== "string")
        throw new Error("Invalid Gemini response shape.");
      return response.status(200).json({
        productIds: parsed.productIds.map(String).slice(0, 3),
        reason: parsed.reason.slice(0, 500),
      });
    } catch (error) {
      console.error("recommendProducts failed", error);
      return response
        .status(502)
        .json({ error: "AI recommendation is temporarily unavailable." });
    }
  },
);
