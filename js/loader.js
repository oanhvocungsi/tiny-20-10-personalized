/**
 * loader.js
 * Khởi động LoveRain app sau khi intro animation kết thúc.
 * Đọc dữ liệu sản phẩm từ Promise global (data-init.js đã fetch)
 * rồi ghi vào data-page của #app trước khi inject js/app.js.
 *
 * Pattern: data-init.js fetch 1 lần → window._fallingLoveReady (Promise)
 *          loader.js await Promise → applyConfig → startApp
 */
(function () {
  function getRecipientPhotos() {
    var key = window.TINY_RECIPIENT || 'tquin';
    if (window.TINY_RECIPIENT_CONFIG && window.TINY_RECIPIENT_CONFIG[key] && window.TINY_RECIPIENT_CONFIG[key].images) {
      return window.TINY_RECIPIENT_CONFIG[key].images;
    }
    if (key === 'tquin') {
      return [
        "assets/image/personalized/tquin-photo-1.png",
        "assets/image/personalized/tquin-photo-2.png",
        "assets/image/personalized/tquin-photo-3.jpg",
        "assets/image/personalized/tquin-photo-4.png",
        "assets/image/personalized/tquin-photo-5.png"
      ];
    }
    if (key === 'huong') {
      return [
        "assets/image/personalized/huong-photo-1.png",
        "assets/image/personalized/huong-photo-2.jpg",
        "assets/image/personalized/huong-photo-3.png",
        "assets/image/personalized/huong-photo-4.png"
      ];
    }
    if (key === 'nhi') {
      return [
        "assets/image/personalized/nhi-photo-1.png",
        "assets/image/personalized/nhi-photo-2.png",
        "assets/image/personalized/nhi-photo-3.png",
        "assets/image/personalized/nhi-photo-4.png"
      ];
    }
    return [
      "assets/image/personalized/" + key + ".png",
      "assets/image/personalized/" + key + "-avatar.png"
    ];
  }

  var defaultPhotos = getRecipientPhotos();

  if (!window.LOVEGIFT_IMAGES || window.LOVEGIFT_IMAGES.length === 0) {
    window.LOVEGIFT_IMAGES = (window.Heartlove && window.Heartlove.data && window.Heartlove.data.images && window.Heartlove.data.images.length > 0)
      ? window.Heartlove.data.images
      : getRecipientPhotos();
  }

  /**
   * Ghi đè cấu hình vào data-page + global objects.
   */
  function applyConfig(cfg) {
    var app = document.getElementById("app");
    var pageData;
    try {
      pageData = JSON.parse(app.dataset.page);
    } catch (e) {
      console.error("Parse data-page failed:", e);
      return;
    }

    if (!pageData) pageData = {};
    if (!pageData.props) pageData.props = {};
    if (!pageData.props.client) pageData.props.client = {};

    pageData.url = window.location.pathname + window.location.search;

    // Wishes từ API / recipient config → ghi vào client.messages (Love Rain đọc từ đây)
    if (cfg.wishes && cfg.wishes.length > 0) {
      pageData.props.client.messages = cfg.wishes;
      window.__lovegiftWishes = cfg.wishes;
    } else if (cfg.messages && cfg.messages.length > 0) {
      pageData.props.client.messages = cfg.messages;
      window.__lovegiftWishes = cfg.messages;
    }

    // Images → ghi vào cả LOVEGIFT_IMAGES và client.images
    if (cfg.images !== undefined) {
      if (Array.isArray(cfg.images) && cfg.images.length > 0) {
        window.LOVEGIFT_IMAGES = cfg.images;
        window.LOVEGIFT_NO_IMAGES = false;
        pageData.props.client.images = cfg.images;
        console.log('🖼️ [Loader] Set LOVEGIFT_IMAGES:', cfg.images.length, 'ảnh', cfg.images);
      } else {
        window.LOVEGIFT_IMAGES = [];
        window.LOVEGIFT_NO_IMAGES = true;
        pageData.props.client.images = [];
        console.warn('🖼️ [Loader] Set LOVEGIFT_NO_IMAGES = true (images rỗng)');
      }
    }
    if (cfg.music) {
      pageData.props.client.music = cfg.music;
    }
    if (cfg.color) {
      pageData.props.client.color = cfg.color;
    }
    if (cfg.fontName) {
      pageData.props.client.fontName = cfg.fontName;
    }

    app.dataset.page = JSON.stringify(pageData);
  }

  function startApp() {
    window.__lovegiftConfigReady = true;
    window.dispatchEvent(new Event("lovegift-ready"));
    var s1 = document.createElement("script");
    s1.type = "module";
    s1.src = "js/app.js";
    s1.onerror = function () {
      console.error("Không tải được js/app.js");
    };
    document.body.appendChild(s1);
  }

  function autoStart() {
    if (window.__loveRainStarted) return;
    window.__loveRainStarted = true;

    // Intercept history.pushState/replaceState TRƯỚC khi Inertia chạy
    // Khi Inertia cố đổi URL sang "/" (từ data-page), ta giữ nguyên URL gốc
    // → không làm 404 các assets trên GitHub Pages
    var _origPush = history.pushState.bind(history);
    var _origReplace = history.replaceState.bind(history);

    history.pushState = function (state, title, url) {
      if (url && _savedUrl) {
        var newPath = (typeof url === 'string') ? url : url.toString();
        if (newPath === '/' || newPath === '') {
          return _origReplace.call(history, state, title, _savedUrl);
        }
      }
      return _origPush.call(history, state, title, url);
    };

    history.replaceState = function (state, title, url) {
      if (url && _savedUrl) {
        var newPath = (typeof url === 'string') ? url : url.toString();
        if (newPath === '/' || newPath === '') {
          return _origReplace.call(history, state, title, _savedUrl);
        }
      }
      return _origReplace.call(history, state, title, url);
    };

    startApp();
  }

  // Lưu URL gốc trước khi Inertia thay đổi
  var _savedUrl = window.location.pathname + window.location.search + window.location.hash;
  var params = new URLSearchParams(window.location.search);
  var cfgId = params.get("id");
  var isSample = params.has("sample");

  if (cfgId && !isSample) {
    // ★ Await Promise từ data-init.js — KHÔNG fetch lại API
    // data-init.js đã fetch và lưu vào window.FallingLoveData
    var ready = window._fallingLoveReady || Promise.resolve(null);
    ready.then(function () {
      var apiData = window.FallingLoveData;
      if (apiData) {
        // Dùng hàm mapping chung từ data-init.js
        var mapFn = window.mapFallingLoveResponse || function () { return {}; };
        var cfg = mapFn(apiData);
        console.log('📥 [Loader] Config from DataInit:', cfg);
        applyConfig(cfg);
      } else {
        console.warn('[Loader] Không có dữ liệu từ API — dùng personalized default');
        window.LOVEGIFT_IMAGES = (window.LOVEGIFT_IMAGES && window.LOVEGIFT_IMAGES.length > 0)
          ? window.LOVEGIFT_IMAGES
          : ((window.Heartlove && window.Heartlove.data && window.Heartlove.data.images && window.Heartlove.data.images.length > 0)
            ? window.Heartlove.data.images
            : getRecipientPhotos());
      }
    }).catch(function (err) {
      console.error('[Loader] Lỗi await config:', err);
    }).finally(autoStart);

  } else if (isSample) {
    // ★ Chế độ Xem mẫu đầy đủ — Đảm bảo 100% dữ liệu mặc định chuẩn
    window.LOVEGIFT_IMAGES = defaultPhotos;
    window.LOVEGIFT_NO_IMAGES = false;
    var sampleApp = document.getElementById("app");
    if (sampleApp) {
      try {
        var pageData = JSON.parse(sampleApp.dataset.page);
        pageData.props.client.messages = [
          "Chúc bạn một đời an yên, bốn mùa đều có niềm vui và hạnh phúc 🌸",
          "Hãy luôn tự tin, tự yêu và tự tỏa sáng theo cách riêng của bạn nhé ✨",
          "Nụ cười của bạn là điều đẹp đẽ nhất, hãy giữ nó mãi trên môi nhé ☀️",
          "20/10 ngập tràn niềm vui, mong mọi điều ước của bạn đều thành hiện thực 💖"
        ];
        pageData.props.client.images = defaultPhotos;
        pageData.props.client.music = "assets/music/loveMusic/Hngle - Tìm em ft (mp3cut.net).mp3";
        pageData.props.client.fontName = "Mali";
        pageData.props.client.color = "#ff6b9d";
        sampleApp.dataset.page = JSON.stringify(pageData);
      } catch (e) {
        console.warn("[Loader] Lỗi reset data-page cho sample:", e);
      }
    }
    autoStart();

  } else {
    // Chế độ Xem trước (Preview) — chỉ đọc PreviewStorage khi thực sự có ?preview
    var _isPreviewMode = params.has('preview');
    if (_isPreviewMode && window.__previewConfig) {
      applyConfig(window.__previewConfig);
    } else if (_isPreviewMode && typeof PreviewStorage !== 'undefined') {
      var prev = PreviewStorage.getSync();
      if (prev) {
        var pCfg = {};
        if (prev.wishes && prev.wishes.length > 0) pCfg.messages = prev.wishes;
        pCfg.images = (prev.imageUrls && prev.imageUrls.length > 0) ? prev.imageUrls : [];
        if (prev.musicSrc) pCfg.music = prev.musicSrc;
        applyConfig(pCfg);
        if (!prev.imageUrls || prev.imageUrls.length === 0) {
          window.LOVEGIFT_NO_IMAGES = true;
          window.LOVEGIFT_IMAGES = [];
        }
      } else {
        window.LOVEGIFT_IMAGES = (window.LOVEGIFT_IMAGES && window.LOVEGIFT_IMAGES.length > 0)
          ? window.LOVEGIFT_IMAGES
          : ((window.Heartlove && window.Heartlove.data && window.Heartlove.data.images && window.Heartlove.data.images.length > 0)
            ? window.Heartlove.data.images
            : getRecipientPhotos());
      }
    } else {
      var recKey = window.TINY_RECIPIENT || 'tquin';
      var recConf = (window.TINY_RECIPIENT_CONFIG && window.TINY_RECIPIENT_CONFIG[recKey]) || {};
      var photos = (window.LOVEGIFT_IMAGES && window.LOVEGIFT_IMAGES.length > 0)
        ? window.LOVEGIFT_IMAGES
        : getRecipientPhotos();
      var wishes = (recConf.wishes && recConf.wishes.length > 0)
        ? recConf.wishes
        : (window.__lovegiftWishes || [
            "Chúc bạn 20/10 thật xinh, thật vui và luôn có thật nhiều điều đáng yêu xuất hiện mỗi ngày.",
            "Mong tuổi trẻ của bạn luôn rực rỡ như màu hồng, đầy những bất ngờ dễ thương và những kỷ niệm khó quên.",
            "Chúc bạn luôn tự tin tỏa sáng theo cách riêng, vui vẻ hết mình và gặp thật nhiều người tốt trên hành trình của mình.",
            "Mong mỗi ngày của bạn đều có một chút ngọt ngào, một chút may mắn và thật nhiều lý do để mỉm cười."
          ]);
      window.LOVEGIFT_IMAGES = photos;
      window.LOVEGIFT_NO_IMAGES = false;
      applyConfig({
        wishes: wishes,
        images: photos,
        music: recConf.musicSrc,
        fontName: "Mali",
        color: "#ff6b9d"
      });
    }
    autoStart();
  }
})();
