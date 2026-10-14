# Lapnh Shop - MMA301 Assignment 2

An integrated Expo e-commerce mobile app: remote product catalog, persistent cart, Firebase-backed wishlist, business notifications, and a validated Gemini recommendation workflow.

## Run

1. Copy `.env.example` to `.env` and provide Firebase Web configuration plus a secure AI proxy URL.
2. Install packages: `npm install`.
3. Start the application: `npx expo start`.

Do not commit `.env`. The Gemini API key belongs only on the server/Cloud Function behind `EXPO_PUBLIC_AI_PROXY_URL`, never in this app.

## Code map

Read the project in this order:

1. `src/app/` contains screens and navigation. The `(tabs)` folder is the four bottom tabs.
2. `src/components/` contains small reusable UI pieces such as a product card.
3. `src/context/CartContext.js` owns cart state: add, remove, quantity, subtotal, and persistence.
4. `src/services/` is where API work lives: DummyJSON catalog, Firebase wishlist, notifications, and Gemini.
5. `src/storage/` contains AsyncStorage helpers; `src/utils/` contains small pure calculations.

Each screen follows the same simple pattern: load data, show loading/error/empty states, then render the successful state. Keep UI code in screens/components and keep fetch/database code in services.

## Business workflow

The catalog loads from DummyJSON with search, pull-to-refresh, pagination, and empty/error/retry states. A selected product can be added to the cart; `CartContext` derives totals from items and persists them with AsyncStorage. A product can be saved to Firestore. Once saved, the app requests/uses local notification permission to send a confirmation. The AI page sends only catalog context and the user need to a secure proxy, then accepts only response product IDs that exist in the local catalog.

## Firebase setup

Create a Firestore database and supply the web app configuration in `.env`. This app stores documents in `wishlists` with `userId`, `productId`, product snapshot fields, and `createdAt`. Configure Firestore rules before demonstrating a production-like build. Firebase errors are shown in the Saved screen and detail save flow.

## Gemini proxy contract

`POST EXPO_PUBLIC_AI_PROXY_URL` receives:

```json
{
  "need": "low-cost student gift",
  "catalog": [
    { "id": "1", "title": "...", "category": "...", "price": 10, "rating": 4.5 }
  ]
}
```

It must return exactly:

```json
{ "productIds": ["1", "8"], "reason": "Short explanation" }
```

The mobile client validates this structure and removes IDs absent from the provided catalog.

The included `functions/recommendProducts` Firebase Cloud Function is the preferred secure proxy implementation. Set its `GEMINI_API_KEY` through Firebase Secret Manager; never put that key in the mobile `.env` file. After deployment, copy the HTTPS trigger URL to `EXPO_PUBLIC_AI_PROXY_URL`.

For this assignment's no-billing demo path, the app also supports `EXPO_PUBLIC_GEMINI_API_KEY`. This is a development-only compromise: Expo public variables are bundled into the app. Use a restricted, free-tier Gemini key only, never commit `.env`, and document this limitation in the submission.

## Notifications and release

Settings exposes permission state. Saving a wishlist item triggers a local business notification only after permission is granted. For Android release evidence, run `npx eas-cli@latest build --profile preview --platform android` to create an installable APK; use `production` for AAB.

## Verification

Run `npm run lint` and `npm run typecheck` before submission. Evidence templates are in `docs/`.
