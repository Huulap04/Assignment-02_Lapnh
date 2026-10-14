# Test Matrix

| # | Case | Expected result | Actual/evidence |
| --- | --- | --- | --- |
| 1 | API success | Catalog appears | |
| 2 | Offline API + retry | Error then successful retry | |
| 3 | Empty search | Empty state | |
| 4 | End pagination | No duplicate request/items | |
| 5 | Search hit/miss | Relevant list/empty state | |
| 6 | Add same product twice | Quantity 2 and correct total | |
| 7 | Decrease to zero | Item removed | |
| 8 | Restart | Cart restored | |
| 9 | Firebase save/read | Saved item persists | |
| 10 | Firebase failure | Feedback; app stays usable | |
| 11 | Notification denied | Clear status; no crash | |
| 12 | Notification allowed | Save event presents notification | |
| 13 | Valid AI response | Catalog-matched recommendations | |
| 14 | Bad/timeout AI response | Safe feedback; no false product | |
| 15 | Preview APK install | Core flow runs | |
