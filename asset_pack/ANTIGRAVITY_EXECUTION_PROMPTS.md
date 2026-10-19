# ANTIGRAVITY_EXECUTION_PROMPTS.md
# Sự thức giấc của Tiny — staged implementation plan

## Mục tiêu bắt buộc

Triển khai đúng `IDEA_MASTER_SPEC.md` trên mã nguồn Tiny V10–V15 hiện có. Đây là **một website với ba nhánh cá nhân hóa** (`tquin`, `nhi`, `huong`), không phải ba website riêng.

Trước khi bắt đầu, hãy xác nhận rằng cả `IDEA_MASTER_SPEC.md` và mã nguồn HTML gốc thực sự có trong workspace. Nếu thiếu một trong hai, dừng các thao tác có nguy cơ phá hỏng dự án và báo rõ file nào đang thiếu.

---

## STEP 0 — Source audit, backup, and plan

### Slash workflows
- `/resume-session` only if resuming an existing saved Antigravity session.
- `/plan`
- `/plan-prd` if the implementation plan needs a formal product requirements document.

### Skills to use, if installed
- `context-budget` to preserve critical requirements across long work.
- `strategic-compact` if the session becomes long; do not compact away non-negotiable constraints.

### Prompt to paste

> Đọc toàn bộ `IDEA_MASTER_SPEC.md` trước khi sửa code. Sau đó kiểm tra toàn bộ workspace và xác định file HTML chính của Tiny V10–V15, các CSS/JS/asset liên quan, Git status, cách chạy hiện tại và cách deploy hiện tại.
>
> Chưa viết code ở bước này.
>
> Hãy lập bảng:
> 1. Các file đang tồn tại và vai trò.
> 2. Những scene, selector, animation, audio, lyric timestamps, mobile branch và `window.TINY_PERF` đang có.
> 3. Các điểm sẽ phải thêm/sửa theo từng requirement ID trong spec.
> 4. Rủi ro có thể làm hỏng trải nghiệm gốc.
> 5. Kế hoạch rollback/backup.
>
> Tạo một checkpoint Git hoặc bản sao an toàn trước khi chỉnh sửa. Không reset, xóa, ghi đè hoặc tái cấu trúc toàn bộ project. Nếu không có source HTML gốc, hãy dừng và yêu cầu tôi cung cấp source; không tự dựng một trang mới giả làm bản nâng cấp.
>
> Đầu ra: `IMPLEMENTATION_PLAN.md` với checklist liên kết đến `FEAT-01`–`FEAT-09` và `AC-01`–`AC-09`.

---

## STEP 1 — Implement the identity question and recipient selector

### Skills to use, if installed
- `ui-ux-pro-max`
- `anti-ui-slop`
- `design-taste-frontend`
- `design-spells`

### Prompt to paste

> Thực hiện Phase 1 theo `IDEA_MASTER_SPEC.md` và `IMPLEMENTATION_PLAN.md`.
>
> Bảo toàn kiến trúc HTML/CSS/JS thuần hiện tại. Thêm scene hỏi danh tính ngay sau lời thoại `Tớ là đệ guộc sếp Nguyên Vũ` với câu chính xác:
>
> `Cậu có thể cho tôi biết cậu là ai không ạ ?`
>
> Phải có đủ:
> - Mắt Tiny né nhẹ sang một bên.
> - Dấu `?` phát sáng, nảy nhẹ cạnh mắt.
> - Hai ngón tay chạm nhau ở dưới mắt.
> - Ba vòng tròn tương tác ở trung tâm: `Tquin`, `Nhi`, `Hương`.
> - Avatar là placeholder có fallback đẹp khi chưa có ảnh.
>
> Khi scene chọn người nhận đang mở, click nền không được chuyển scene. Chỉ click một vòng tròn mới lưu `window.TINY_RECIPIENT` (`tquin`, `nhi`, `huong`) và cho phép tiếp tục. Chặn double-click/rapid click.
>
> Dùng asset `assets/ui/question-mark.svg`, `assets/ui/shy-fingers.svg` và `css/tiny-animations.css` nếu phù hợp. Điều chỉnh đường dẫn asset theo cấu trúc thực tế.
>
> Không thay đổi các câu thoại đã chốt. Không thay đổi scene khác ngoài phần cần thiết để chèn cổng chọn người nhận.
>
> Sau khi làm xong, tự đối chiếu `FEAT-01`–`FEAT-04`, `AC-01`–`AC-04`; báo rõ mục nào đã chạy thử và mục nào chưa.

---

## STEP 2 — Implement personalized gifts

### Skills to use, if installed
- `ui-ux-pro-max`
- `anti-ui-slop`
- `design-taste-frontend`
- `animejs-animation`
- `design-spells`

### Prompt to paste

> Thực hiện Phase 2 theo spec. Nâng cấp phần quà tại `#clover-stage` nhưng không phá cấu trúc điều khiển scene gốc.
>
> Quy tắc nhánh:
> - `tquin`: hoa hồng đỏ nhiều lớp cánh, nở theo thứ tự, gradient đỏ nhung, viền sáng và glow.
> - `nhi`: hoa hồng xanh sapphire/cyan, cấu trúc animation tương đương nhưng palette riêng.
> - `huong`: kẹo mút xoắn ốc pastel có hiệu ứng bóng kính; phần họa tiết xoắn ốc quay liên tục, que kẹo và nơ không được quay lệch ngoài ý muốn.
>
> Dùng `assets/gifts/red-rose.svg`, `assets/gifts/blue-rose.svg`, `assets/gifts/lollipop.svg` nếu chúng phù hợp; có thể tinh chỉnh SVG để đạt chất lượng tốt hơn. Không thay chúng bằng emoji hoặc một hình hoa đơn giản.
>
> Tạo hoặc cập nhật `applyRecipientTheme(recipientKey)` để:
> 1. Kiểm tra recipient hợp lệ.
> 2. Cập nhật câu chữ chính xác.
> 3. Chỉ hiển thị đúng món quà được chọn.
> 4. Đổi glow/ambient color theo nhánh.
> 5. Kích hoạt animation khi scene bắt đầu và dọn trạng thái khi rời scene.
>
> Giữ nguyên các câu:
> - Tquin/Nhi: `Tớ tặng cậu đóa hoa hồng này`
> - Hương: `Tớ tặng cậu cây kẹo ngọt ngào này`
>
> Kiểm thử lần lượt cả ba nhánh; không chỉ kiểm thử một nhánh rồi suy ra hai nhánh còn lại đều đúng.

---

## STEP 3 — Gift delivery and personalized particle rain

### Skills to use, if installed
- `canvas-design`
- `animejs-animation`
- `fixing-motion-performance`
- `design-spells`

### Prompt to paste

> Thực hiện Phase 3 theo spec cho cảnh `Nè cầm lấy đi` và cảnh chúc 20/10.
>
> Ở cảnh trao quà, vật phẩm đúng nhánh phải bay tiến về phía người xem trong khoảng thời gian mục tiêu xấp xỉ `2.45s`, có easing mượt và không làm mất trạng thái scene.
>
> Ở cảnh lời chúc, hiển thị chính xác:
>
> `Chúc cậu có một ngày 20/10 thật tuyệt vời và vui vẻ`
>
> Particle theo nhánh:
> - `tquin`: cánh hoa hồng đỏ.
> - `nhi`: cánh hoa hồng xanh.
> - `huong`: kẹo pastel và trái tim.
>
> Nếu sử dụng `js/personalized-particles.js`, hãy tích hợp với scheduler hiện có. `window.TINY_PERF` là nguồn điều phối hiệu năng cần được bảo toàn; không tạo một vòng `requestAnimationFrame` thứ hai chạy song song nếu code gốc đã có scheduler.
>
> Giữ cấu trúc chiều sâu hiện tại nếu có: lớp particle phía sau Tiny và lớp phía trước Tiny. Không che chữ hoặc đôi mắt.
>
> Tôn trọng `window.TINY_PERF.leafFps`, `window.TINY_PERF.canvasDpr`, chế độ mobile/lite và `prefers-reduced-motion`. Pause hiệu ứng khi scene ẩn; cleanup listener, observer và RAF khi không còn sử dụng.
>
> Không thay nhạc, nguồn audio, lyric timestamps hoặc cảnh Waguri.

---

## STEP 4 — Preserve the original experience and integrate the ending

### Prompt to paste

> Rà soát toàn bộ luồng sau khi thêm ba nhánh. Mục tiêu là bổ sung cá nhân hóa, không viết lại trải nghiệm Tiny.
>
> Bắt buộc giữ nguyên:
> - Các cảnh áo dài, cỏ hoa, bầu trời sao, sức khỏe, xinh đẹp và nụ cười.
> - Waguri, đĩa than, lyric synchronization, audio source và timestamps.
> - `window.TINY_PERF`, `#tiny-mobile-branch`, `.tiny-mobile`, `.tiny-lite`.
> - Câu `Liệu cậu có thể...` và toàn bộ các scene cuối: đồng ý/nạp nhiên liệu máy bay, robot trên mặt trăng và shop.
>
> Sau cảnh mưa vật phẩm, cả ba nhánh phải hội tụ về cùng một luồng kết thúc.
>
> So sánh code trước/sau và liệt kê chính xác các khu vực bị thay đổi. Nếu phát hiện bất kỳ logic gốc nào bị vô tình thay đổi, khôi phục hoặc sửa trước khi tiếp tục.

---

## STEP 5 — QA, code review, performance, and deployment

### Slash workflows
- `/code-review`
- `/build-fix` only if the project has a failing build or test.
- `/refactor-clean` only if needed and without broad rewrites.
- `/security-scan`
- `/update-docs`

### Skills to use, if installed
- `fixing-motion-performance`
- `anti-ui-slop`
- `design-taste-frontend`

### Prompt to paste

> Chạy QA theo `IDEA_MASTER_SPEC.md`. Không chỉ đọc code; hãy chạy website và kiểm tra hành vi thực tế.
>
> Kiểm thử tối thiểu:
> 1. Màn hình đầu → lời thoại 1 → lời thoại 2 → cổng chọn người nhận.
> 2. Click nền tại cổng chọn không làm nhảy scene.
> 3. Chọn từng nhánh `tquin`, `nhi`, `huong` trong các phiên chạy độc lập.
> 4. Quà, lời thoại, hiệu ứng trao quà và particle đều đúng nhánh.
> 5. Cả ba nhánh đều đi đến `Liệu cậu có thể...` và kết thúc gốc.
> 6. Test viewport `375×812`, `812×375`, desktop.
> 7. Test audio, lyric timing, Replay/reload nếu dự án có.
> 8. Test `prefers-reduced-motion`, lỗi tải avatar và rapid clicks.
> 9. Kiểm tra console, memory/resource cleanup, build và asset paths.
>
> Chạy `/code-review` và `/security-scan`. Chỉ chạy `/build-fix` nếu build thực sự lỗi. Không dùng `/refactor-clean` để viết lại toàn bộ file.
>
> Không được đánh dấu requirement là PASS nếu chưa kiểm tra. Cập nhật `IMPLEMENTATION_PLAN.md` với PASS/FAIL/NOT TESTED và bằng chứng cụ thể.
>
> Chỉ deploy theo repository/workflow đã tồn tại hoặc đã được tôi xác nhận. Không tự tạo repo mới hoặc tự đoán URL. Sau deploy, mở URL thực tế và kiểm tra lại. Báo chính xác điều gì đã hoàn thành và điều gì còn bị chặn.

---

## Global constraints — paste into every phase if context is lost

- `IDEA_MASTER_SPEC.md` is the source of truth for confirmed product requirements.
- Never replace the original Tiny project with a new mockup.
- Never delete original audio, lyric timing, final scenes, or performance controls.
- Never invent missing avatars or personal memories; use placeholders and fallback artwork.
- Keep all three recipient branches in one experience and one source of truth.
- If a conflict is found between the spec and the existing source, stop and report it before destructive changes.
- Mark recommendations separately from confirmed requirements.
- Do not claim “100% complete” without verifying every acceptance criterion.
