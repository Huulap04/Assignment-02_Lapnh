# Requirement Traceability Matrix

| ID | Requirement | UI/code evidence | Verification |
| --- | --- | --- | --- |
| R01 | Remote catalog | `productService`, Shop tab | API success and offline/retry |
| R02 | Pagination | `useProducts.loadMore` guard | Scroll end, verify no duplicates |
| R03 | Search/refresh | Shop `TextInput`, `FlatList` | hit, miss, pull-to-refresh |
| R04 | Detail | `product/[id]` | valid and missing ID |
| R05-R06 | Cart and totals | `CartContext`, `cartSelectors` | add/update/remove; 0/1/many |
| R07 | Persistence | `cartStorage` | restart and restore cart |
| R08 | Firebase use case | `firebaseService`, Saved tab | write/read/error feedback |
| R09 | Notification | `notificationService`, Settings | allow/deny/save event |
| R10 | Gemini workflow | `aiService`, AI screen | valid/invalid response fallback |
| R11 | Debug evidence | `DEBUG_LOG.md` | two root-cause/retest records |
| R12 | Release build | `eas.json` + APK/AAB evidence | install and smoke test |
