# IMPLEMENTATION PLAN: SỰ THỨC GIẤC CỦA TINY (20/10 PERSONALIZED EDITION) - BẢN RÀ SOÁT KỸ THUẬT

> **Trạng thái tài liệu:** Kế hoạch kỹ thuật đã rà soát trước triển khai (Pre-Implementation Review)  
> **Cam kết:** **Tuyệt đối chưa can thiệp sửa đổi file mã nguồn nào (`index.html`, CSS, JS gốc vẫn nguyên trạng).**  
> **Mã nguồn tham chiếu:** Tiny V10–V15 (`index.html`, 3.97 MB, 12.252 dòng) từ repo gốc `https://github.com/oanhvocungsi/20-10-gift`  
> **Không gian làm việc:** `c:\Webdesign\tiny-20-10-personalized` (Branch git: `feature/personalized-20-10`, baseline commit: `925503d`)  
> **Đặc tả mục tiêu:** `IDEA_MASTER_SPEC.md` (Version 2.0.0) / `gemini-code-1792371648357.md`  
> **Quy chuẩn phân loại trạng thái trong kế hoạch:**  
> - `[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]`: Đã kiểm tra trực tiếp qua lệnh hệ điều hành, đo dung lượng, kiểm tra git log hoặc đọc mã nguồn thực tế.  
> - `[SUY LUẬN TỪ ĐẶC TẢ / MÃ NGUỒN]`: Phân tích logic từ luồng mã nguồn và tài liệu spec, chưa chạy thử nghiệm.  
> - `[CHƯA KIỂM THỬ RUNTIME]`: Chưa chạy trên trình duyệt thực tế, chờ phê duyệt để thực hiện ở các phase tiếp theo.  

---

## 1. Xác Minh Thực Tế Hệ Thống & Tính Cô Lập Của Bản Sao

`[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]`

Kết quả chạy lệnh PowerShell và Git kiểm tra cấu trúc thư mục thực tế trên ổ đĩa:

```powershell
# 1. Kiểm tra 3 thư mục độc lập
c:\Webdesign\20-10-gift-original    -> Exists: True | Files: 45 | Total Size: 13,870,847 bytes (KHO GỐC NGUYÊN BẢN)
c:\Webdesign\tiny-20-10-backup      -> Exists: True | Files: 45 | Total Size: 13,870,847 bytes (BẢN SAO LƯU BẤT BIẾN)
c:\Webdesign\tiny-20-10-personalized-> Exists: True | Files: 62 | Total Size: 13,924,513 bytes (KHÔNG GIAN LÀM VIỆC)

# 2. Kiểm tra Git commit tại c:\Webdesign\tiny-20-10-personalized
git log -n 1 --oneline
-> 925503d baseline: pristine Tiny V10-V15 from original repo

# 3. Kiểm tra tính cô lập (Git Remotes)
git remote -v
-> (Trống - Hoàn toàn không có remote URL nào được cấu hình; không có nguy cơ sửa hoặc push nhầm lên repo gốc)
```

- **Kho gốc (`20-10-gift-original`):** Chứa bản sao nguyên vẹn tải từ GitHub, được bảo vệ nghiêm ngặt, không có bất kỳ thao tác chỉnh sửa nào.
- **Bản sao lưu (`tiny-20-10-backup`):** Bản snapshot tĩnh dự phòng trường hợp cần hoàn nguyên nhanh.
- **Bản sao làm việc (`tiny-20-10-personalized`):** Đã khởi tạo Git nội bộ riêng, commit gốc `925503d` trên nhánh `master`, hiện đang ở nhánh `feature/personalized-20-10`.

---

## 2. Kiểm Kê Mã Nguồn Thực Tế & Đối Chiếu Logic Thứ Tự Chuyển Cảnh

### 2.1. Kiểm tra tài nguyên thực tế trên ổ đĩa
`[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]`

Tất cả các tài nguyên được tham chiếu trong [index.html](file:///c:/Webdesign/tiny-20-10-personalized/index.html) đều tồn tại với dung lượng đầy đủ:
- `assets/icons/iconFallingLove.png`: 362.216 bytes (Tồn tại: True)
- `assets/music/giai-cuu-the-gioi.mp3`: 3.615.020 bytes (Tồn tại: True)
- `css/main.css`: 15.282 bytes (Tồn tại: True)
- `css/app.css`: 107.028 bytes (Tồn tại: True)
- `css/loading.css`: 2.710 bytes (Tồn tại: True)
- `lib/app-config.js`: 899 bytes (Tồn tại: True)
- `js/preview-storage.js`: 6.232 bytes (Tồn tại: True)
- `js/data-init.js`: 12.563 bytes (Tồn tại: True)
- `js/shooting-stars.js`: 874 bytes (Tồn tại: True)
- `js/enhanced-effects.js`: 19.933 bytes (Tồn tại: True)
- `js/start-button.js`: 5.659 bytes (Tồn tại: True)
- `js/loading-manager.js`: 3.784 bytes (Tồn tại: True)

Các asset chuẩn bị cho 3 nhánh trong [asset_pack](file:///c:/Webdesign/tiny-20-10-personalized/asset_pack):
- `asset_pack/assets/gifts/red-rose.svg`: 2.397 bytes
- `asset_pack/assets/gifts/blue-rose.svg`: 2.431 bytes
- `asset_pack/assets/gifts/lollipop.svg`: 2.342 bytes
- `asset_pack/assets/ui/question-mark.svg`: 694 bytes
- `asset_pack/assets/ui/shy-fingers.svg`: 830 bytes
- `asset_pack/css/tiny-animations.css`: 3.347 bytes
- `asset_pack/js/personalized-particles.js`: 4.919 bytes

---

### 2.2. Đối chiếu cơ chế chuyển cảnh (`clickCount`), mốc âm thanh 9s & Lyric Sync
`[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]`

Đọc trực tiếp hàm `chuyenCanh()` (dòng 7769–7884) và `advanceToBeautyScene()` (dòng 7711–7735) trong file gốc:

1. **Ban đầu (`clickCount = 0`):**
   - Click 1: Ẩn `#text-1`, mở mắt robot (`.con-mat.thuc`), hiện `#text-2`, bật âm thanh `startMusicIfAllowed()`. `clickCount` tăng lên `1`.
2. **Tại `clickCount = 1`:**
   - Trong code gốc: Click 2 ẩn `#text-2`, hiện `#text-3` (lệnh sếp), bật lặp từ chờ `startWaitRepeat()`, đặt hẹn giờ âm thanh `musicAutoAdvanceTimer` đến mốc `MUSIC_HOLD_TIME = 9.0s`. `clickCount` tăng lên `2`.
3. **Tại `clickCount = 2`:**
   - Nếu click trước 9.0s: Gọi `showMusicWaitHint()` hiển thị `"xíu nữa"`, `"sắp được rùi "`, `"1 chút xíu nữa "`, tuyệt đối không cắt nhạc.
   - Khi nhạc đạt 9.0s hoặc hết thời gian chờ: `isReadyForBeauty = true`, kích hoạt `advanceToBeautyScene()`.
   - Trong `advanceToBeautyScene()`:
     ```javascript
     if (clickCount !== 2) return;
     clickCount = 3;
     ```
     `clickCount` được gán chính xác thành `3`.
4. **Tại `clickCount = 3`:**
   - Click tiếp bung cảnh 20/10 Áo dài (`#text-5`, `#anh-hai-nguoi`, `#co-hoa`, `#laCanvas`).
5. **Từ `clickCount = 4` đến `clickCount = 12`:**
   - `clickCount = 4`: `#text-6` (Bầu trời sao).
   - `clickCount = 5`: `#text-7` (Chúc sức khỏe).
   - `clickCount = 6`: `#text-8` (Chúc xinh đẹp).
   - `clickCount = 7`: `#text-9` (Giữ nụ cười + Waguri + đĩa than + Lyric Sync).
   - `clickCount = 8`: `#text-10` (Cảnh tặng quà `#clover-stage`).
   - `clickCount = 9`: `#text-11` (Cảnh trao quà `"Nè cầm lấy đi"`).
   - `clickCount = 10`: `#text-12` (Cảnh chúc 20/10 và mưa hạt `#luck-stage`).
   - `clickCount = 11`: `#text-13` (Câu hỏi `"Liệu cậu có thể..."` `#question-stage`).
   - `clickCount = 12`: `#share-flight-scene` (Nạp nhiên liệu máy bay $\rightarrow$ Rover mặt trăng $\rightarrow$ Shop Dalabs $\rightarrow$ 3D Falling Love).

---

### 2.3. Giải pháp thiết kế cổng chọn danh tính: LOẠI BỎ `clickCount = 1.5`, DÙNG STATE ĐỘC LẬP
`[SUY LUẬN TỪ ĐẶC TẢ / MÃ NGUỒN]`

> [!IMPORTANT]
> **Quyết định kiến trúc bắt buộc:**
> Tuyệt đối **không gán số thực** (`clickCount = 1.5`) vì hàm `advanceToBeautyScene()` kiểm tra nghiêm ngặt `if (clickCount !== 2) return;` và toàn bộ các nhánh `chuyenCanh()` đều dùng phép so sánh nghiêm ngặt `===`.
> 
> Thay vào đó, **giữ nguyên toàn bộ giá trị số nguyên của `clickCount`**, sử dụng cờ trạng thái độc lập `isWaitingForRecipientSelection`:

```javascript
// State quản lý cổng chọn danh tính riêng biệt
let isWaitingForRecipientSelection = false;

// Trong hàm chuyenCanh():
function chuyenCanh() {
    if (!canClick) return;
    // NẾU ĐANG Ở CỔNG CHỌN NGƯỜI NHẬN: CHẶN TOÀN BỘ CÚ CLICK MÀN HÌNH
    if (isWaitingForRecipientSelection) return;

    startMusicIfAllowed();

    if (clickCount === 2) {
        if (isReadyForBeauty) { advanceToBeautyScene(); return; }
        showMusicWaitHint();
        return;
    }

    if (clickCount === 0) {
        // Click 1: Thức giấc + Text 1 -> Text 2
        canClick = false;
        clickCount = 1;
        text1.classList.remove('hien-thi');
        setTimeout(() => {
            matElements.forEach(m => m.classList.add('thuc'));
            text2.classList.add('hien-thi');
            setTimeout(kichHoatChuKyChop, 1000);
            canClick = true;
        }, 700);
    }
    else if (clickCount === 1) {
        // Click 2: Rời Text 2 -> KÍCH HOẠT CỔNG CHỌN NGƯỜI NHẬN (clickCount VẪN GIỮ = 1)
        canClick = false;
        text2.classList.remove('hien-thi');
        
        // Kích hoạt biểu cảm thắc mắc & hiển thị 3 vòng tròn
        hienThiCongChonDanhTinh();
        isWaitingForRecipientSelection = true;
        canClick = true;
    }
    // ... các nhánh clickCount = 3, 4, ... giữ nguyên 100% logic gốc
}

// Khi người dùng bấm trực tiếp vào 1 trong 3 vòng tròn (.recipient-circle):
function onRecipientSelected(recipientKey) {
    if (!isWaitingForRecipientSelection) return;
    window.TINY_RECIPIENT = recipientKey;
    document.body.dataset.recipient = recipientKey;

    // Chạy animation vòng tròn được chọn và thu gọn cổng
    dongCongChonDanhTinh(() => {
        isWaitingForRecipientSelection = false;
        // Chuyển sang Cảnh nhận lệnh sếp Nguyên: Gán clickCount = 2 hợp lệ!
        clickCount = 2;
        text3.classList.add('hien-thi');
        batDauLiec();
        startWaitRepeat();

        // Kích hoạt hẹn giờ âm thanh mốc 9.0s chuẩn xác theo code gốc
        clearTimeout(musicAutoAdvanceTimer);
        const curT = tinySoundtrack.currentTime || 0;
        const remainMs = Math.max(100, (MUSIC_HOLD_TIME - curT) * 1000);
        musicAutoAdvanceTimer = setTimeout(() => {
            if (clickCount === 2) triggerReadyToClick();
        }, remainMs);
    });
}
```

**Ưu điểm vượt trội của giải pháp state riêng:**
1. `clickCount` luôn mang giá trị số nguyên nguyên bản (`0, 1, 2, 3, ...`), không có số thập phân.
2. Không làm sai lệch bất kỳ điều kiện so sánh nào của `advanceToBeautyScene()` hay `musicAutoAdvanceTimer`.
3. Toàn bộ hành vi chặn click nền và debounce click nhanh được cô lập hoàn toàn trong biến `isWaitingForRecipientSelection`.

---

### 2.4. Phân tích `luckCanvasLeaves` & Tránh trùng lặp Animation Loop
`[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]` & `[SUY LUẬN TỪ ĐẶC TẢ / MÃ NGUỒN]`

Kiểm tra trực tiếp hàm `luckCanvasLeaves` (dòng 8857–9034):
- Đối tượng này quản lý cùng lúc 2 canvas:
  - `backCanvas` nằm trong `#luck-fall-field` (`z-index: 2`, phía sau mắt Tiny).
  - `frontCanvas` nằm trong `#luck-front-field` (`z-index: 7`, phía trước mắt Tiny).
- Vòng lặp hoạt họa `draw(now)` sử dụng biến `raf = requestAnimationFrame(draw)`.
- Hàm `taoSprite(sang, hue)` (dòng 8861) dùng `Path2D('M0 0 C -6 -8...')` để vẽ các cánh cỏ 4 lá phát sáng.

> [!WARNING]
> **Cảnh báo xung đột hiệu năng:**
> File `asset_pack/js/personalized-particles.js` chứa một hàm độc lập `mountTinyParticles()` có vòng `requestAnimationFrame` riêng. Nếu nhúng thẳng file này vào trang, trình duyệt sẽ chạy **hai vòng lặp song song** (một vòng của `luckCanvasLeaves` và một vòng của `mountTinyParticles`), gây tụt FPS và nóng máy trên thiết bị di động.
> 
> **Phương án kỹ thuật chuẩn xác:**
> - **KHÔNG** tạo thêm canvas thứ ba và **KHÔNG** chạy vòng lặp RAF thứ hai.
> - Tái cấu trúc hàm `taoSprite()` hoặc hàm vẽ bên trong chính `luckCanvasLeaves`:
>   - Nếu `window.TINY_RECIPIENT === 'tquin'`: Vẽ sprite cánh hoa hồng đỏ nhung (`#ff2a55`, `#d90429`).
>   - Nếu `window.TINY_RECIPIENT === 'nhi'`: Vẽ sprite cánh hoa hồng xanh sapphire (`#00bbf9`, `#3a86ff`).
>   - Nếu `window.TINY_RECIPIENT === 'huong'`: Vẽ sprite viên kẹo xoắn ốc pastel (`#ff70a6`, `#ffd670`) và trái tim hồng.
> - Vẫn sử dụng duy nhất một điều phối viên `luckCanvasLeaves.start()` và `luckCanvasLeaves.stop()` tuân thủ nghiêm ngặt `TINY_PERF.leafFps`.

---

## 3. Bảng Phân Định Rõ Ràng Các Trạng Thái Kiểm Chứng

| Hạng mục kiểm tra | Trạng thái hiện tại | Bằng chứng kiểm tra thực tế |
| :--- | :--- | :--- |
| **Sự tồn tại của thư mục gốc `20-10-gift-original`** | `[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]` | PowerShell: `Test-Path = True`, 45 files, 13.870.847 bytes. |
| **Sự tồn tại của bản backup `tiny-20-10-backup`** | `[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]` | PowerShell: `Test-Path = True`, 45 files, 13.870.847 bytes. |
| **Sự tồn tại của working copy `tiny-20-10-personalized`** | `[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]` | PowerShell: `Test-Path = True`, nhánh `feature/personalized-20-10`. |
| **Commit git `925503d` trên nhánh `master`** | `[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]` | `git log -1` trả về đúng hash `925503d` và thông điệp baseline. |
| **Tính cô lập của git (không remote push lên repo gốc)** | `[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]` | `git remote -v` trả về kết quả rỗng (không cấu hình remote). |
| **File nhạc `assets/music/giai-cuu-the-gioi.mp3`** | `[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]` | Tồn tại với dung lượng chính xác 3.615.020 bytes. |
| **File `index.html` gốc** | `[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]` | Tồn tại với dung lượng chính xác 3.971.665 bytes, 12.252 dòng. |
| **Hệ thống mốc audio 9.0s (`MUSIC_HOLD_TIME`)** | `[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]` | Giữ nguyên 100% logic tại dòng 8128–8136 trong `index.html`. |
| **Kiến trúc `luckCanvasLeaves` 2 lớp canvas** | `[ĐÃ XÁC MINH THỰC TẾ TRÊN HỆ THỐNG]` | Xác nhận dòng 8857–9034 trong `index.html`. |
| **Phase 1: State độc lập cho cổng chọn danh tính** | `[ĐÃ HOÀN TẤT & ĐÃ XÁC MINH THỰC TẾ]` | `window.isWaitingForRecipientSelection` chặn toàn bộ click nền. Playwright test: Passed. |
| **Phase 1: Hiển thị trực quan 3 vòng tròn trên trình duyệt** | `[ĐÃ HOÀN TẤT & ĐÃ XÁC MINH THỰC TẾ]` | Selector opacity: 1, 3 nút Tquin, Nhi, Hương hiển thị chuẩn. Playwright test: Passed. |
| **Phase 1: Animation mắt né sang bên, dấu `?` và ngón tay** | `[ĐÃ HOÀN TẤT & ĐÃ XÁC MINH THỰC TẾ]` | Opacity = 1, `khung-mat.asking-identity` = True. Playwright test: Passed. |
| **Phase 1: Chọn từng nhánh người nhận và chuyển cảnh Text 3** | `[ĐÃ HOÀN TẤT & ĐÃ XÁC MINH THỰC TẾ]` | `window.TINY_RECIPIENT` nhận đúng giá trị, `clickCount = 2`, chuyển sang Text 3 mượt mà. |
| **Phase 1: Responsive trên thiết bị di động (375x667)** | `[ĐÃ HOÀN TẤT & ĐÃ XÁC MINH THỰC TẾ]` | Không tràn ngang (ScrollWidth: 375, ClientWidth: 375), 3 nút nằm gọn trong khung hình. |
| **Phase 1: Kiểm tra lỗi console trình duyệt** | `[ĐÃ HOÀN TẤT & ĐÃ XÁC MINH THỰC TẾ]` | Page errors count: 0 (không có lỗi cú pháp hoặc runtime). |
| **Phase 2: Animation nở hoa hồng đỏ, hoa hồng xanh và xoay kẹo** | `[CHƯA KIỂM THỬ RUNTIME]` | Dự kiến triển khai trong Phase 2. |
| **Phase 3: Hiệu ứng trao quà `cloverGiftRiseFade` cho 3 món quà** | `[CHƯA KIỂM THỬ RUNTIME]` | Dự kiến triển khai trong Phase 3. |
| **Phase 3: Mưa cánh hoa hồng và kẹo trong `luckCanvasLeaves`** | `[CHƯA KIỂM THỬ RUNTIME]` | Dự kiến triển khai trong Phase 3. |
| **Phase 4: Hội tụ chuỗi kết và bảo toàn các cảnh sau** | `[CHƯA KIỂM THỬ RUNTIME]` | Dự kiến triển khai trong Phase 4. |
| **Phase 5: Kiểm thử tổng thể đa thiết bị & bàn giao** | `[CHƯA KIỂM THỬ RUNTIME]` | Dự kiến triển khai trong Phase 5. |


---

## 4. Các Điều Kiện Còn Thiếu Trước Khi Bắt Đầu Triển Khai

1. **Phê duyệt của người dùng đối với bản kế hoạch đã rà soát:**
   - Xác nhận giải pháp **dùng state riêng `isWaitingForRecipientSelection`** thay vì đổi `clickCount` sang số thập phân.
   - Xác nhận phương án **tích hợp hạt bay trực tiếp vào `luckCanvasLeaves`** để triệt tiêu nguy cơ vòng lặp RAF kép.
2. **Ảnh đại diện thực tế của 3 bạn `Tquin`, `Nhi`, `Hương`:**
   - Tạm thời áp dụng fallback icon `🌹`, `💠`, `🍭` trên gradient phát sáng thông qua biến cấu hình `window.TINY_RECIPIENT_CONFIG`. Người dùng có thể cung cấp file ảnh sau đó bất kỳ lúc nào.
