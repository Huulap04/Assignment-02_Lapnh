# Kịch bản tự interview — Assignment 02

## Chuẩn bị trước khi quay

- Quay riêng video này cho Assignment 02; bật camera để thấy khuôn mặt và ghi âm rõ.
- Mở sẵn ứng dụng trên điện thoại/dev build, VS Code, GitHub repository và file `SUBMISSION_LINKS.txt`.
- Mở repository: `https://github.com/Huulap04/Assignment-02_Lapnh`.
- Không hiển thị file `.env`, API key, Firebase configuration riêng tư hoặc Gemini key.
- Nếu minh chứng notification: dùng Android development build trên thiết bị thật. Expo Go không chạy luồng notification của bài này.

## Mở đầu — 15 giây

> Em xin chào thầy/cô. Em là **[đọc mã số sinh viên] — [đọc họ và tên]**. Đây là video tự interview cho Assignment 02 của em, ứng dụng mobile **Lapnh Shop**, được xây bằng Expo/React Native và Expo Router. Em sẽ trình bày yêu cầu, giải pháp, bằng chứng Git và workflow code.

## Câu 1 — Problem, use case và phương pháp giải quyết

### 1. Tổng quan bài làm

> Mục tiêu của em là xây dựng một ứng dụng bán hàng mobile có catalog sản phẩm từ API, tìm kiếm và phân trang, chi tiết sản phẩm, giỏ hàng lưu được sau khi mở lại app, wishlist trên Firebase, notification nghiệp vụ và gợi ý sản phẩm bằng Gemini. Kiến trúc tách UI ở `src/app` và `src/components`, state dùng `context`/`hooks`, còn các tích hợp bên ngoài nằm trong `services`.

### 2. Các problem/use case và giải pháp

| Problem / UC | Cách em giải quyết | Chỗ cần quay minh chứng |
| --- | --- | --- |
| UC01 — Xem catalog từ API | `productService.js` gọi DummyJSON, chuẩn hoá dữ liệu về một shape chung; màn Shop dùng `useProducts`. | Tab **Shop**, rồi `src/services/productService.js` và `src/hooks/useProducts.js`. |
| UC02 — Search, refresh, pagination | Ô search đi qua `useDebouncedValue`; hook gọi API với `skip`/`limit=12`. `inFlight` chặn request trùng, `requestId` bỏ qua response cũ, filter ID tránh sản phẩm lặp. | Nhập search, kéo refresh, scroll xuống cuối danh sách. |
| UC03 — Xem chi tiết và thêm giỏ | Expo Router truyền `id` sang route động `product/[id]`; màn chi tiết tải product theo ID và dispatch action ADD. | Chạm một card, mở detail, bấm **Add to cart**. |
| UC04 — Giỏ hàng và tính tổng | `CartContext` quản lý state dùng `useReducer`; selector tính số lượng/tạm tính. `AsyncStorage` lưu lại cart khi state đã sẵn sàng. | Tab **My cart**, tăng/giảm/xoá sản phẩm; đóng/mở lại app để kiểm tra restore. |
| UC05 — Wishlist Firebase | Mỗi máy có `deviceId` local. `firebaseService` kiểm tra trùng theo `userId + productId`, sau đó add/read/delete document Firestore. | Detail → **Save to wishlist** → tab **Saved** → Remove. |
| UC06 — Notification nghiệp vụ | Sau khi wishlist lưu thành công và chưa trùng, app xin permission rồi schedule local notification. Nếu từ chối, việc lưu wishlist vẫn chạy. | Tab **Settings** và thao tác save trên development build Android. |
| UC07 — AI recommendation | Client gửi nhu cầu và catalog rút gọn tới proxy Firebase; response phải có `productIds`/`reason`. Client chỉ hiển thị ID thực sự có trong catalog. | Detail → **Ask AI for alternatives** hoặc màn AI; nhập nhu cầu, nhận card gợi ý. |
| UC08 — UX lỗi/loading/empty | Dùng `ProductListState` tái sử dụng cho loading, lỗi có retry và empty state. | Tìm từ khoá không có; tắt mạng hoặc cấu hình thiếu để quay error/retry. |

### 3. Lý do chọn giải pháp

> Em dùng Context + reducer vì giỏ hàng là state dùng ở nhiều màn nhưng quy mô vừa phải; reducer làm các action add, cập nhật quantity, remove, clear rõ ràng và dễ giải thích. Em không đặt fetch trực tiếp trong component để màn hình chỉ lo UI, còn service phụ trách I/O. API key Gemini không nên nằm trong app mobile vì biến `EXPO_PUBLIC_*` sẽ được bundle; luồng ưu tiên là Firebase Cloud Function proxy và secret ở server. Chế độ gọi Gemini trực tiếp chỉ là đường demo có cảnh báo trong README.

## Câu 2 — Minh chứng Git và kiến trúc file

### Lời nói khi quay GitHub

> Account GitHub của em là **Huulap04**; repository là `Huulap04/Assignment-02_Lapnh`. Em mở tab **Commits** để cho thấy tác giả commit là Huulap04 với email `lapnh.ce190492@gmail.com`, và commit `Complete` chứa các file của Assignment 02. Link repository và link video được đặt trong `SUBMISSION_LINKS.txt`.

### Lưu ý trung thực về lịch sử Git hiện tại

Repository hiện chỉ có 2 commit: `Initial commit` và `Complete` (commit `b317ea8`, tác giả Huulap04). Chưa thấy UC/issue ID và cũng chưa có dòng header tác giả đầu mỗi source file. Vì vậy:

- Không nói rằng mỗi UC có commit/issue riêng nếu không có bằng chứng.
- Khi giảng viên hỏi tiến độ, mở **Commits**, nói đúng: “Phần triển khai được gom trong commit Complete của account em.”
- Chỉ thêm issue ID hoặc tên tác giả vào file nếu thầy/cô yêu cầu rõ; không tự tạo bằng chứng lùi ngày hay sửa lịch sử Git để giả tiến độ.

### Thứ tự quay cây thư mục và ý nghĩa

| Thư mục/file | Mục đích kiến trúc |
| --- | --- |
| `src/app/_layout.js` | Root navigator, bọc toàn app bằng `CartProvider`. |
| `src/app/(tabs)/` | Bốn màn tab: Shop, Cart, Saved, Settings. |
| `src/app/product/[id].js` | Route động chi tiết theo product ID. |
| `src/app/ai-recommendation.js` | Màn lấy nhu cầu và render kết quả AI đã validate. |
| `src/components/` | UI tái sử dụng: khung màn, card sản phẩm, các trạng thái list. |
| `src/context/CartContext.js` | State/chức năng giỏ hàng dùng chung giữa các màn. |
| `src/hooks/` | Logic dùng lại: debounce và tải danh sách sản phẩm. |
| `src/services/` | Giao tiếp DummyJSON, Firebase, notification, Gemini/proxy. |
| `src/storage/` | Đọc/ghi AsyncStorage của cart và device ID. |
| `src/utils/cartSelectors.js` | Các phép tính thuần: số lượng, subtotal, format tiền. |
| `functions/index.js` | Firebase HTTPS function giữ Gemini key ở server. |
| `docs/RTM.md` | Trace requirement R01–R12 tới code và kiểm thử. |
| `docs/DESIGN_DECISIONS.md` | Lý do chọn kiến trúc/giải pháp. |
| `README.md` | Hướng dẫn chạy, config và contract AI. |
| `SUBMISSION_LINKS.txt` | Link Git đã có; dán link Drive sau khi upload video. |

## Câu 3 — Giải thích workflow và code chính

### A. Catalog, search và pagination

> Khi `CatalogScreen` render, state `search` thay đổi theo TextInput. `useDebouncedValue` trì hoãn giá trị tìm kiếm để không gọi API với mọi ký tự. Giá trị này đi vào `useProducts`; `useEffect` gọi `load({ reset: true })`. Service tạo endpoint DummyJSON với `q`, `skip` và `limit`, rồi `normalizeProduct` ép kiểu và chọn các field UI cần. Khi người dùng scroll, `onEndReached` gọi `loadMore`; các guard kiểm tra đang tải, đang refresh và đã lấy đủ `total` chưa. Request trùng bị chặn bởi `inFlight`; request cũ bị bỏ qua bằng `requestId`; merge list còn lọc theo ID để không lặp sản phẩm.

### B. Detail, cart và persistence

> Route `/product/[id]` nhận `id` qua `useLocalSearchParams`. `useEffect` gọi `getProduct(id)`, vì vậy route không hợp lệ sẽ hiển thị lỗi/not found thay vì crash. Khi bấm Add to cart, hàm `add` dispatch action `ADD` vào reducer. Nếu item đã có thì quantity tăng một, nếu chưa có thì thêm product với quantity bằng một. `CartContext` dùng `useMemo` để expose derived state `itemCount` và `subtotal`, được tính bằng selector thuần. Lần đầu provider mount, `loadCart` khôi phục JSON từ AsyncStorage và dispatch `RESTORE`; sau khi `ready=true`, effect còn lại tự `saveCart` mỗi khi items đổi. Vì vậy giỏ vẫn còn sau khi restart app.

### C. Wishlist Firebase và notification

> Khi Save to wishlist, app gọi `saveProduct`. Service lấy `deviceId` ổn định từ AsyncStorage làm user ID demo, query Firestore xem sản phẩm đó của user này đã tồn tại chưa, rồi mới `addDoc`. Nhờ vậy không tạo wishlist item trùng. Màn Saved gọi `listSavedProducts` mỗi lần tab được focus, nên sau khi save quay lại là thấy dữ liệu mới. Xoá dùng `deleteDoc` với document ID của Firestore. Chỉ khi save mới thành công, detail mới gọi `notifySavedProduct`. Notification được tách riêng: kiểm tra Expo Go, thiết bị thật, permission, tạo Android channel và chỉ schedule khi status là granted. Việc từ chối permission không chặn Firebase save.

### D. AI an toàn

> Màn AI tải tối đa 100 sản phẩm để làm catalog context. Client chỉ gửi id, title, category, price và rating, không gửi dữ liệu không cần thiết. Nếu có proxy URL, `requestRecommendations` POST tới Cloud Function; nếu không thì đường demo cần key public và có cảnh báo. Sau khi nhận response, code kiểm tra `productIds` là array, `reason` là string, rồi giao với Set ID của catalog local. Vì vậy AI không thể hiển thị sản phẩm tự bịa ra. Cloud Function tiếp tục validate input, giới hạn độ dài/số phần tử, lấy `GEMINI_API_KEY` bằng Firebase Secret Manager, gọi model và trả shape JSON bị giới hạn tối đa 3 ID.

### E. Lỗi và trải nghiệm người dùng

> Các state loading, empty, error và retry được hiển thị rõ qua `ProductListState`. Các lỗi network/Firebase/AI đều catch và đưa message ra UI/Alert, giúp app không bị crash. Cart được local-first nên vẫn dùng được dù mạng, Firebase hoặc AI đang lỗi.

## Checklist quay video

1. Hiện mặt, đọc MSSV và họ tên.
2. Quay Shop: load → search → empty state → pull refresh → pagination.
3. Quay detail: add cart → cart tăng quantity/giảm về 0 → subtotal → restart để minh chứng persistence.
4. Quay Firebase: save → Saved → remove; nếu config chưa sẵn sàng, quay lỗi có kiểm soát và nói nguyên nhân.
5. Quay Settings + notification trên Android development build/thiết bị thật; không dùng Expo Go cho phần này.
6. Quay AI: nhập một nhu cầu và nói về validation ID.
7. Quay source theo bảng kiến trúc, rồi GitHub account/repository/commit.
8. Dán link Drive vào `SUBMISSION_LINKS.txt`, bật quyền xem công khai bằng link, kiểm tra link Git + Drive.

## Câu hỏi phụ có thể gặp

**Tại sao không dùng Redux?**

> State toàn cục của bài chủ yếu là cart, số action ít. Context + reducer đủ rõ, ít boilerplate và vẫn tách action/state tốt. Nếu có nhiều domain phức tạp hơn, cache server hoặc middleware, em sẽ cân nhắc Redux Toolkit hoặc React Query.

**Tại sao không đặt Gemini key trong app?**

> Expo public env bị bundle ở client, người dùng có thể trích xuất. Vì vậy key production phải giữ trong Cloud Function/Secret Manager; client chỉ gọi URL proxy.

**Firebase user ID có phải đăng nhập không?**

> Trong assignment này em dùng device ID để tách wishlist theo thiết bị mà không triển khai authentication. Đây là giới hạn demo; production nên dùng Firebase Auth và Firestore rules theo authenticated UID.

**Vì sao dùng `FlatList`?**

> Danh sách sản phẩm dài. `FlatList` render tối ưu theo vùng nhìn thấy và cung cấp sẵn pull-to-refresh, `onEndReached`, `keyExtractor`, phù hợp mobile hơn việc map tất cả item trong ScrollView.

**Nếu AI trả ID không nằm trong catalog thì sao?**

> Client lọc ID bằng Set của catalog local. Nếu không còn ID hợp lệ, code báo lỗi an toàn và không render một sản phẩm không tồn tại.
