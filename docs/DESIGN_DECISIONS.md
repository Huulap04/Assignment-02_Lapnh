# Design Decision Record

1. **Context + reducer for cart.** Cart changes are cross-screen but modest in scope; this keeps actions and derived values explainable without Redux overhead.
2. **DummyJSON with skip/limit.** It provides server pagination, so `onEndReached` can be tested against a known total.
3. **AsyncStorage only for cart/device ID.** Cart remains usable when network/Firebase/AI fail; storage keys are centralized.
4. **Firestore wishlist is the Firebase business use case.** It represents a useful user action and demonstrates write/read/delete/error states.
5. **Gemini via server proxy.** API credentials are not safe in a mobile bundle. The client sends bounded catalog context and validates structured IDs before display.
6. **Local notification after wishlist save.** It is a concrete business event, works as a reliable demo, and permission denial does not block saving.
7. **Service/UI separation.** Screens bind UI events; services perform I/O; hooks/context own state; this makes failure paths and interview explanations clear.
