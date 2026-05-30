const TONE = {
  good: 1,
  warn: 2,
  bad: 3,
};

const statusText = {
  calm: "여유롭고 조용해요",
  normal: "보통이에요",
  busy: "혼잡해요",
  seats: "앉을 자리 있어요",
};

const expandedMetricText = {
  crowd: ["여유로워요", "보통이에요", "혼잡해요"],
  noise: ["조용해요", "보통이에요", "시끄러워요"],
  sit: ["바로 앉을 수 있어요", "조금 기다려야 해요", "오래 기다려야 해요"],
  charge: ["넉넉해요", "경쟁있어요", "조금 기다려야 해요"],
};

const lounges = [
  {
    id: "library-garden",
    name: "중앙도서관 라운지",
    building: "중앙도서관",
    floor: "1층",
    distance: "180m",
    walkMinutes: 3,
    favorite: true,
    recommended: true,
    recommendation: 94,
    heroTone: "dark",
    status: "calm",
    statusTone: "good",
    tags: ["개인 공부", "콘센트", "조용함", "정수기", "밝음", "높은 테이블"],
    thumbnail: "linear-gradient(135deg, #FFFFFF, #F2F4F7)",
    image: "linear-gradient(135deg, #FFFFFF, #EEF0F3)",
    metrics: [
      { key: "crowd", label: "혼잡도", value: "여유", tone: "good", detail: "현재 이용자가 적어 좌석 선택 폭이 넓어요. 개인 공부나 조용한 작업에 알맞아요." },
      { key: "noise", label: "소음도", value: "조용", tone: "good", detail: "대화 소리가 낮고 주변 이동도 적은 편이에요." },
      { key: "sit", label: "자리 유무", value: "있음", tone: "good", detail: "창가 좌석과 2인 테이블 위주로 빈자리가 남아 있어요." },
      { key: "charge", label: "콘센트", value: "넉넉", tone: "good", detail: "벽면 좌석과 일부 중앙 테이블에서 콘센트를 사용할 수 있어요." },
    ],
    details: [
      ["좌석 형태", "1인석, 2인석, 창가 좌석"],
      ["테이블 형태", "높은 책상, 낮은 원형 테이블"],
      ["인접 시설", "정수기, 복사실, 도서 대출대"],
      ["운영 시간", "평일 09:00-22:00"],
      ["라운지 규칙", "큰 통화와 음식 섭취는 제한"],
      ["밝기", "자연광이 들어오는 밝은 공간"],
    ],
  },
  {
    id: "sk-future",
    name: "SK미래관 커먼즈",
    building: "SK미래관",
    floor: "2층",
    distance: "320m",
    walkMinutes: 5,
    favorite: false,
    recommended: true,
    recommendation: 88,
    heroTone: "dark",
    status: "seats",
    statusTone: "good",
    tags: ["팀플", "화이트보드", "다인석", "노트북", "콘센트", "합석 가능"],
    thumbnail: "linear-gradient(135deg, #FFFFFF, #F2F4F7)",
    image: "linear-gradient(135deg, #FFFFFF, #EEF0F3)",
    metrics: [
      { key: "crowd", label: "혼잡도", value: "보통", tone: "warn", detail: "팀플 이용자가 조금 있지만 큰 테이블은 아직 선택 가능해요." },
      { key: "noise", label: "소음도", value: "보통", tone: "warn", detail: "대화가 가능한 분위기라 조용한 공부보다는 팀플에 좋아요." },
      { key: "sit", label: "자리 유무", value: "있음", tone: "good", detail: "4인 테이블 한두 곳과 소파석이 비어 있어요." },
      { key: "charge", label: "콘센트", value: "보통", tone: "warn", detail: "콘센트 좌석은 일부만 남아 있어요." },
    ],
    details: [
      ["좌석 형태", "4인석, 6인석, 소파"],
      ["테이블 형태", "큰 직사각 테이블"],
      ["인접 시설", "카페, 프린터, 팀플룸"],
      ["운영 시간", "평일 08:30-21:30"],
      ["라운지 규칙", "팀 활동 가능, 장시간 자리 맡기 제한"],
      ["밝기", "중간 밝기, 저녁에는 조명이 따뜻함"],
    ],
  },
  {
    id: "business-lobby",
    name: "현대자동차 경영관 로비",
    building: "현대자동차 경영관",
    floor: "B1층",
    distance: "410m",
    walkMinutes: 7,
    favorite: true,
    recommended: false,
    recommendation: 72,
    heroTone: "dark",
    status: "normal",
    statusTone: "warn",
    tags: ["짧은 휴식", "카페 인접", "수다", "낮은 테이블", "취식 가능", "소파"],
    thumbnail: "linear-gradient(135deg, #FFFFFF, #F2F4F7)",
    image: "linear-gradient(135deg, #FFFFFF, #EEF0F3)",
    metrics: [
      { key: "crowd", label: "혼잡도", value: "보통", tone: "warn", detail: "점심 이후 이동 인원이 많아지는 시간대예요." },
      { key: "noise", label: "소음도", value: "보통", tone: "warn", detail: "카페와 로비 이용객 때문에 대화 소리가 들려요." },
      { key: "sit", label: "자리 유무", value: "조금", tone: "warn", detail: "짧게 앉을 수 있는 소파석 위주로 남아 있어요." },
      { key: "charge", label: "콘센트", value: "적음", tone: "bad", detail: "노트북 충전이 필요하면 다른 라운지가 더 좋아요." },
    ],
    details: [
      ["좌석 형태", "소파, 낮은 의자"],
      ["테이블 형태", "낮은 테이블"],
      ["인접 시설", "카페, 편의점"],
      ["운영 시간", "건물 개방 시간 내 이용"],
      ["라운지 규칙", "취식 가능, 장시간 학습은 비추천"],
      ["밝기", "간접 조명 중심의 편안한 밝기"],
    ],
  },
  {
    id: "science-library",
    name: "과학도서관 라운지",
    building: "과학도서관",
    floor: "3층",
    distance: "760m",
    walkMinutes: 11,
    favorite: false,
    recommended: false,
    recommendation: 46,
    heroTone: "dark",
    status: "busy",
    statusTone: "bad",
    tags: ["개인 공부", "조용함", "딱딱한 좌석", "콘센트", "높은 테이블"],
    thumbnail: "linear-gradient(135deg, #FFFFFF, #F2F4F7)",
    image: "linear-gradient(135deg, #FFFFFF, #EEF0F3)",
    metrics: [
      { key: "crowd", label: "혼잡도", value: "혼잡", tone: "bad", detail: "현재 시험 기간 이용자가 많아 빈자리를 찾기 어려워요." },
      { key: "noise", label: "소음도", value: "조용", tone: "good", detail: "전체적으로 조용하지만 이동 인원은 많은 편이에요." },
      { key: "sit", label: "자리 유무", value: "적음", tone: "bad", detail: "빈 좌석이 거의 없어 대기 가능성이 있어요." },
      { key: "charge", label: "콘센트", value: "보통", tone: "warn", detail: "콘센트 좌석 경쟁이 높은 시간대예요." },
    ],
    details: [
      ["좌석 형태", "1인석, 열람석"],
      ["테이블 형태", "긴 책상"],
      ["인접 시설", "복사실, 사물함"],
      ["운영 시간", "평일 09:00-23:00"],
      ["라운지 규칙", "정숙 필수, 취식 제한"],
      ["밝기", "밝은 백색 조명"],
    ],
  },
];

const purposeOptions = ["공부", "팀플", "짧은 휴식", "잠", "식사", "수다", "노트북 사용"];
const featureOptions = ["밝음", "어두움", "조용함", "딱딱한 좌석", "소파", "낮은 테이블", "높은 테이블", "다인석", "콘센트", "프린터", "정수기", "합석 가능", "취식 가능"];
const campuses = {
  "인문계 캠퍼스": ["중앙도서관", "LG-POSCO관", "현대자동차 경영관", "백주년기념관", "SK미래관", "우당교양관", "학생회관", "미디어관"],
  "자연계 캠퍼스": ["공학관", "신공학관", "과학도서관", "애기능생활관"],
};

const state = {
  route: "home",
  selectedLoungeId: lounges[0].id,
  favoritesOnly: false,
  favorites: new Set(lounges.filter((lounge) => lounge.favorite).map((lounge) => lounge.id)),
  selectedPurpose: [],
  selectedFeatures: [],
  selectedCampus: "",
  selectedBuildings: [],
  departureMode: "now",
  departureDelay: "15",
  departurePeriod: "오후",
  departureHour: "2",
  departureMinute: "30",
  departureDate: "오늘",
  showDatePicker: false,
  sortMode: "recommendation",
  presets: [{ name: "개인 공부", purpose: ["공부"], features: ["조용함", "콘센트"], campus: "", buildings: [], departureMode: "now" }],
  modal: null,
  activeMetric: null,
  trendOpen: false,
  profilePage: "",
  notifications: {
    favorite: true,
    near: true,
    marketing: false,
  },
  profile: {
    name: "윤서",
    college: "문과대학",
    department: "국어국문학과",
    saved: false,
    photo: "",
  },
};

const app = document.querySelector("#app");
let lastRenderedRoute = "";

function icon(name) {
  const icons = {
    heart: '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l8.8 8.7 8.8-8.7a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/></svg>',
    user: '<svg viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>',
    chevron: '<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
    nav: '<svg viewBox="0 0 24 24"><path d="m12 2 7 20-7-4-7 4Z"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V22a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H2a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V2a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4H22a1.7 1.7 0 0 0-1.5 1Z"/></svg>',
  };
  return icons[name] || "";
}

function metricIcon(metric) {
  return `<img src="./_256/${metric.key}-${TONE[metric.tone]}_256.png" alt="" />`;
}

function getSelectedLounge() {
  return lounges.find((lounge) => lounge.id === state.selectedLoungeId) || lounges[0];
}

function summaryTitle() {
  if (state.favoritesOnly) return "즐겨찾기한 라운지예요";
  if (state.selectedPurpose.length) return `${state.selectedPurpose[0]}에 알맞은 라운지예요`;
  if (state.selectedFeatures.includes("조용함")) return "조용한 시간을 보내기 좋은 라운지예요";
  return "지금 추천드리는 라운지예요";
}

function filteredLounges() {
  let result = [...lounges];
  if (state.favoritesOnly) result = result.filter((lounge) => state.favorites.has(lounge.id));
  if (state.selectedBuildings.length) result = result.filter((lounge) => state.selectedBuildings.includes(lounge.building));
  result.sort(sortLounges);
  return result;
}

function sortLounges(a, b) {
  if (state.sortMode === "crowd") return TONE[a.statusTone] - TONE[b.statusTone] || scoreLounge(b) - scoreLounge(a);
  if (state.sortMode === "distance") return Number(a.distance.replace(/\D/g, "")) - Number(b.distance.replace(/\D/g, ""));
  return b.recommendation - a.recommendation || scoreLounge(b) - scoreLounge(a);
}

function scoreLounge(lounge) {
  const haystack = lounge.tags.join(" ") + " " + lounge.details.map((row) => row[1]).join(" ");
  const purposeScore = state.selectedPurpose.reduce((score, item) => score + (haystack.includes(item.replace(" 사용", "")) ? 3 : 0), 0);
  const featureScore = state.selectedFeatures.reduce((score, item) => score + (haystack.includes(item) ? 2 : 0), 0);
  return purposeScore + featureScore + (lounge.recommended ? 1 : 0);
}

function render() {
  const routeChanged = lastRenderedRoute && lastRenderedRoute !== state.route;
  const views = {
    home: renderHome,
    detail: renderDetail,
    search: renderSearch,
    profile: renderProfile,
    map: renderMap,
  };
  app.innerHTML = `<main class="phone-shell">${views[state.route]()}</main>${renderModal()}`;
  bindEvents();
  alignTimePicker();
  adjustHeroTone();
  if (routeChanged) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  lastRenderedRoute = state.route;
}

function alignTimePicker() {
  requestAnimationFrame(() => {
    document.querySelectorAll(".wheel-options").forEach((column) => column.querySelector(".selected")?.scrollIntoView({ block: "center" }));
  });
}

function adjustHeroTone() {
  const hero = document.querySelector(".detail-hero");
  if (!hero) return;
  const lounge = getSelectedLounge();
  const urlMatch = lounge.image.match(/url\((['"]?)(.*?)\1\)/);
  if (!urlMatch) return;
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.addEventListener("load", () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = 24;
    canvas.height = 24;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let luminance = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      luminance += pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114;
    }
    const average = luminance / (pixels.length / 4);
    hero.classList.toggle("hero-tone-light", average < 132);
    hero.classList.toggle("hero-tone-dark", average >= 132);
  });
  image.addEventListener("error", () => {});
  image.src = urlMatch[2];
}

function renderHome() {
  const loungesToShow = filteredLounges();
  return `
    <section class="screen with-tabbar">
      <header class="home-header">
        <div class="brand">kulungi</div>
        <h1>${summaryTitle()}</h1>
        <div class="search-bar split-search">
          <button class="search-main" data-route="search">상세 검색</button>
          <button class="preset-trigger" data-modal="presets"><span>프리셋</span>${icon("chevron")}</button>
        </div>
        ${renderSortControls()}
      </header>
      <div class="lounge-list">
        ${loungesToShow.length ? loungesToShow.map(renderLoungeCard).join("") : `<div class="empty">조건에 맞는 라운지가 아직 없어요.</div>`}
      </div>
      ${renderTabbar()}
    </section>
  `;
}

function renderSortControls() {
  const options = [
    ["recommendation", "추천도순"],
    ["crowd", "혼잡도순"],
    ["distance", "거리순"],
  ];
  return `<div class="sort-controls">${options.map(([value, label]) => `
    <button class="${state.sortMode === value ? "selected" : ""}" data-sort-mode="${value}">
      <i>${state.sortMode === value ? "✓" : ""}</i><span>${label}</span>
    </button>
  `).join("")}</div>`;
}

function renderLoungeCard(lounge) {
  const isFavorite = state.favorites.has(lounge.id);
  return `
    <article class="lounge-card-wrap">
      <div class="lounge-card" data-open-lounge="${lounge.id}" role="button" tabindex="0">
        <div class="thumb" style="background:${lounge.thumbnail}"><span>라운지 사진</span></div>
        <div class="card-info">
          <div class="card-title-row">
            <h2>${lounge.name}</h2>
            <div class="card-score">
              <button class="icon-btn favorite ${isFavorite ? "active" : ""}" data-favorite="${lounge.id}" aria-label="즐겨찾기">${icon("heart")}</button>
              <small>${lounge.recommendation}%</small>
            </div>
          </div>
          <p>${lounge.building} ${lounge.floor} · ${lounge.distance}</p>
          <strong class="status mark-${lounge.statusTone}">${statusText[lounge.status]}</strong>
          <div class="tags scroll-tags">${lounge.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        </div>
      </div>
      ${lounge.recommended ? `<button class="recommend-tail" data-route="map">지금 출발하면 앉을 수 있어요</button>` : ""}
    </article>
  `;
}

function renderTabbar() {
  return `
    <nav class="tabbar">
      <button class="favorite-tab ${state.favoritesOnly ? "active" : ""}" data-toggle-favorites aria-label="즐겨찾기만 보기">${icon("heart")}</button>
      <button class="${state.route === "home" ? "active" : ""}" data-home aria-label="홈">${icon("home")}</button>
      <button class="${state.route === "profile" ? "active" : ""}" data-route="profile" aria-label="마이 페이지">${icon("user")}</button>
    </nav>
  `;
}

function renderDetail() {
  const lounge = getSelectedLounge();
  return `
    <section class="screen detail-screen">
      <header class="detail-hero hero-tone-${lounge.heroTone || "dark"}">
        <div class="hero-bg" style="background:${lounge.image}"></div>
        <div class="top-actions">
          <button class="icon-btn glass" data-home aria-label="뒤로가기">${icon("back")}</button>
          <div class="labeled-actions">
            <button class="action-label" data-route="map" aria-label="길찾기"><span class="icon-btn glass nav-tilt">${icon("nav")}</span><small>길찾기</small></button>
            <button class="action-label" data-favorite="${lounge.id}" aria-label="즐겨찾기"><span class="icon-btn glass favorite ${state.favorites.has(lounge.id) ? "active" : ""}">${icon("heart")}</span><small>즐겨찾기</small></button>
          </div>
        </div>
        <div class="hero-copy">
          <h1>${lounge.name}</h1>
          <p>${lounge.building} ${lounge.floor} · ${lounge.distance}</p>
        </div>
      </header>
      <div class="detail-content">
        ${renderMetrics(lounge)}
        ${lounge.recommended ? `<button class="route-callout" data-route="map"><span>지금 출발하면 앉을 수 있어요</span><strong>${icon("clock")} ${lounge.walkMinutes}분</strong></button>` : ""}
        ${renderSeatMap()}
        ${renderTrend()}
        ${renderInfoTable(lounge)}
      </div>
    </section>
  `;
}

function renderMetrics(lounge) {
  return `
    <section class="metric-section ${state.activeMetric ? "expanded" : ""}">
      ${lounge.metrics.map((metric) => {
        const active = state.activeMetric === metric.key;
        const expandedText = expandedMetricText[metric.key][TONE[metric.tone] - 1];
        return `
          <button class="metric-card ${metric.tone} ${active ? "active" : ""}" data-metric="${metric.key}">
            <span class="metric-icon">${metricIcon(metric)}</span>
            <strong>${active ? expandedText : metric.value}</strong>
            <small>${metric.label}</small>
            <p>${metric.detail}</p>
          </button>
        `;
      }).join("")}
    </section>
  `;
}

function renderSeatMap() {
  const seats = ["good", "good", "good", "warn", "bad", "good", "good", "bad", "good", "warn", "good", "good", "bad", "good", "good", "warn"];
  return `
    <section class="panel">
      <h2>좌석도</h2>
      <div class="seat-map">
        <div class="table table-a"></div>
        <div class="table table-b"></div>
        <div class="sofa"></div>
        ${seats.map((tone, index) => `<span class="seat ${tone}" style="--x:${(index % 8) + 1}; --y:${Math.floor(index / 8) + 1}"></span>`).join("")}
        <span class="plug-dot p1"></span>
        <span class="plug-dot p2"></span>
        <span class="water-dot"></span>
      </div>
      <div class="legend"><span class="good"></span> 사용 가능 <span class="warn"></span> 제한 <span class="bad"></span> 사용 중</div>
    </section>
  `;
}

function renderTrend() {
  const bars = [34, 52, 43, 28, 62, 76, 58, 41, 33, 49, 66, 81];
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  return `
    <section class="panel trend-panel" data-toggle-trend>
      <div class="panel-title">
        <h2>시간대별 혼잡도</h2>
        <span>${state.trendOpen ? "접기" : "더보기"}</span>
      </div>
      <div class="line-chart">
        ${bars.map((bar, index) => `<i style="height:${bar}%; left:${index * 8.3}%"></i>`).join("")}
        <b style="left:58%"></b>
      </div>
      ${state.trendOpen ? `
        <div class="week-chart">
          ${days.map((day, index) => `<div><span style="height:${[45, 38, 56, 42, 72, 30, 24][index]}%"></span><small>${day}</small></div>`).join("")}
        </div>
        <p class="insight">이 라운지는 목요일 오전과 주말 오후에 비교적 여유로워요.</p>
      ` : ""}
    </section>
  `;
}

function renderInfoTable(lounge) {
  return `
    <section class="panel info-panel">
      <h2>정보</h2>
      <dl>
        ${lounge.details.map(([key, value]) => `<div><dt>${key}</dt><dd>${value}</dd></div>`).join("")}
      </dl>
    </section>
  `;
}

function renderSearch() {
  return `
    <section class="screen search-screen">
      <header class="plain-header">
        <button class="icon-btn" data-home aria-label="뒤로가기">${icon("back")}</button>
        <div class="labeled-actions">
          <button class="action-label" data-modal="presets" aria-label="프리셋 보기"><span class="icon-btn">${icon("star")}</span><small>프리셋</small></button>
          <button class="action-label" data-modal="save" aria-label="프리셋 저장"><span class="icon-btn">${icon("plus")}</span><small>저장</small></button>
        </div>
      </header>
      <div class="filter-stack">
        <section class="filter-panel">
          <h1>어떤 목적으로<br />라운지를 찾고 계신가요?</h1>
          <div class="chip-grid">${purposeOptions.map((item) => chip(item, "purpose")).join("")}</div>
        </section>
        <section class="filter-panel">
          <h2>어떤 요소가 필요하신가요?</h2>
          <div class="chip-grid dense">${featureOptions.map((item) => chip(item, "feature")).join("")}</div>
        </section>
        <section class="filter-panel">
          <h2>어느 위치를 선호하시나요?</h2>
          <div class="chip-grid campus">${Object.keys(campuses).map((campus) => `<button class="chip ${state.selectedCampus === campus ? "selected" : ""}" data-campus="${campus}">${campus}</button>`).join("")}</div>
          ${state.selectedCampus ? `<div class="chip-grid dense buildings">${campuses[state.selectedCampus].map((building) => chip(building, "building")).join("")}</div>` : ""}
        </section>
        <section class="filter-panel">
          <h2>언제 사용하시나요?</h2>
          <div class="departure-tabs">
            ${[
              ["now", "지금 출발"],
              ["soon", "조금 있다가"],
              ["later", "나중에"],
            ].map(([value, label]) => `<button class="${state.departureMode === value ? "selected" : ""}" data-departure-mode="${value}">${label}</button>`).join("")}
          </div>
          ${state.departureMode === "later" ? `<button class="date-toggle" data-toggle-date-picker>다른 날짜에 사용해요</button>` : ""}
          ${state.departureMode === "later" && state.showDatePicker ? renderDatePicker() : ""}
          ${state.departureMode !== "now" ? renderTimePicker() : ""}
        </section>
      </div>
      <div class="sticky-actions">
        <button class="secondary" data-reset-filters>초기화</button>
        <button class="primary" data-home>결과 보기</button>
      </div>
    </section>
  `;
}

function renderDatePicker() {
  const dateOptions = buildDateOptions();
  const selectedDate = dateOptions.some((option) => option.value === state.departureDate) ? state.departureDate : dateOptions[0].value;
  return `
    <label class="date-picker">
      <span>사용 날짜</span>
      <select data-date-select>
        ${dateOptions.map(({ value, label }) => `<option value="${value}" ${selectedDate === value ? "selected" : ""}>${label}</option>`).join("")}
      </select>
    </label>
  `;
}

function buildDateOptions() {
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  return Array.from({ length: 15 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const prefix = index === 0 ? "오늘" : index === 1 ? "내일" : `${dayNames[date.getDay()]}요일`;
    const formatted = `${date.getMonth() + 1}월 ${date.getDate()}일`;
    return { value: formatDateValue(date), label: `${prefix} (${formatted})` };
  });
}

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderTimePicker() {
  if (state.departureMode === "soon") {
    const delays = ["5", "10", "15", "20", "30", "45", "60", "90", "120"];
    return `
      <div class="time-picker delay-picker">
        ${renderWheel("delay", delays, state.departureDelay, (delay) => `${delay}분 후`)}
      </div>
    `;
  }
  const periods = ["오전", "오후"];
  const hours = Array.from({ length: 12 }, (_, index) => String(index + 1));
  const minutes = Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, "0"));
  return `
    <div class="time-picker later-picker">
      ${renderWheel("period", periods, state.departurePeriod)}
      ${renderWheel("hour", hours, state.departureHour)}
      <span>:</span>
      ${renderWheel("minute", minutes, state.departureMinute)}
    </div>
  `;
}

function renderWheel(part, values, selected, format = (value) => value) {
  return `
    <div class="wheel-column" data-wheel="${part}">
      <button class="wheel-step" data-wheel-step="${part}" data-wheel-dir="-1" aria-label="이전">⌃</button>
      <div class="wheel-options" aria-label="${part}">
        ${values.map((value) => `<button class="${selected === value ? "selected" : ""}" data-time-part="${part}" data-time-value="${value}">${format(value)}</button>`).join("")}
      </div>
      <button class="wheel-step" data-wheel-step="${part}" data-wheel-dir="1" aria-label="다음">⌄</button>
    </div>
  `;
}

function chip(item, type) {
  const selectedMap = {
    purpose: state.selectedPurpose,
    feature: state.selectedFeatures,
    building: state.selectedBuildings,
  };
  return `<button class="chip ${selectedMap[type].includes(item) ? "selected" : ""}" data-chip-type="${type}" data-chip="${item}">${item}</button>`;
}

function renderProfile() {
  if (state.profilePage) return renderProfileSubpage();
  const items = [
    ["profile", "프로필 관리"],
    ["notifications", "알림 설정"],
    ["everytime", "에브리타임 연동", "beta"],
    ["about", "쿠룽지코 소개"],
    ["privacy", "개인정보 보호 및 설정"],
  ];
  return `
    <section class="screen with-tabbar profile-screen">
      <header class="profile-header">
        ${profilePhoto("avatar-img")}
        <h1>${state.profile.name}님</h1>
        <p>오늘도 딱 맞는 라운지를 찾아볼게요.</p>
      </header>
      <div class="settings-list">
        ${items.map(([id, title, beta]) => `
          <button data-profile-page="${id}">
            ${icon("settings")}
            <span><strong>${title}${beta ? `<sup>${beta}</sup>` : ""}</strong></span>
            ${icon("chevron")}
          </button>
        `).join("")}
      </div>
      ${renderTabbar()}
    </section>
  `;
}

function renderProfileSubpage() {
  const pages = {
    profile: renderProfileEdit,
    notifications: renderNotificationSettings,
    everytime: renderEverytime,
    about: renderMascots,
    privacy: renderPrivacy,
  };
  return `
    <section class="screen profile-subscreen">
      <header class="plain-header">
        <button class="icon-btn" data-profile-back aria-label="뒤로가기">${icon("back")}</button>
        <h1>${profileTitle()}</h1>
        <span></span>
      </header>
      ${pages[state.profilePage]()}
    </section>
  `;
}

function profileTitle() {
  return {
    profile: "프로필 관리",
    notifications: "알림 설정",
    everytime: "에브리타임 연동",
    about: "쿠룽지코 소개",
    privacy: "개인정보 보호 및 설정",
  }[state.profilePage];
}

function renderProfileEdit() {
  return `
    <section class="subpage-stack">
      <div class="profile-edit-card">
        ${profilePhoto("edit-avatar")}
        <button class="profile-photo-button" data-profile-photo>프로필 변경</button>
        <input class="visually-hidden" type="file" accept="image/*" data-profile-photo-input />
        <label>사용자 이름<input data-profile-field="name" value="${state.profile.name}" /></label>
        <label>소속대학<select data-profile-field="college">${["문과대학", "경영대학", "공과대학"].map((college) => `<option ${state.profile.college === college ? "selected" : ""}>${college}</option>`).join("")}</select></label>
        <label>학과<select data-profile-field="department">${["국어국문학과", "경영학과", "컴퓨터학과"].map((department) => `<option ${state.profile.department === department ? "selected" : ""}>${department}</option>`).join("")}</select></label>
        <p class="autosave-note">${state.profile.saved ? "변경사항이 자동 저장되었어요" : "변경하면 자동으로 저장돼요"}</p>
      </div>
    </section>
  `;
}

function profilePhoto(className) {
  if (state.profile.photo) return `<img class="${className}" src="${state.profile.photo}" alt="" />`;
  return `<div class="${className} profile-placeholder" aria-label="기본 프로필">${icon("user")}</div>`;
}

function renderNotificationSettings() {
  return `
    <section class="subpage-stack">
      ${[
        ["favorite", "즐겨찾기 라운지 빈자리 알림"],
        ["near", "가까운 라운지 추천 알림"],
        ["marketing", "이벤트 및 마케팅 알림"],
      ].map(([key, label]) => `
        <button class="toggle-row" data-toggle-notification="${key}">
          <span>${label}</span>
          <i class="${state.notifications[key] ? "on" : ""}"></i>
        </button>
      `).join("")}
    </section>
  `;
}

function renderEverytime() {
  return `
    <section class="subpage-stack">
      <div class="text-card">
        <p>에브리타임에 연동하면 사용자님의 시간표를 참고해 최적의 라운지를 알맞은 타이밍에 추천드려요</p>
        <button class="primary">연동하기</button>
      </div>
    </section>
  `;
}

function renderMascots() {
  const characters = [
    ["ku_256.png", "쿠", "북한산에서 태어난 무시무시한 호랑이의 후손이에요. 고려대학교의 마스코트가 호랑이라는 말을 듣고 하산해 지금은 시크한 츤데레 큰 고양이가 되었어요."],
    ["lungi_256.png", "룽지", "룽지는 이 앱의 팀원 응원 및 정서 안정 총괄을 맡고 있는 고양이에요. 영역 동물인 고양이답지 않게 넓은 공간과 라운지를 좋아해요."],
    ["zico_256.png", "지코", "지코는 원래 평범한 아기 돼지였어요. 하지만 아무거나 주워먹다가 그만 고려대학교 실험실에 있던 초전도체를 먹고 전기 충전 돼지가 되어버렸어요."],
  ];
  return `
    <section class="subpage-stack">
      <div class="text-card">
        <p>쿠룽지코는 여러분의 쾌적한 라운지 사용을 위해 발벗고 뛰어다니는 친구들이에요.</p>
      </div>
      ${characters.map(([image, name, desc]) => `
        <article class="mascot-card">
          <img src="./_256/${image}" alt="" />
          <div><h2>${name}</h2><p>${desc}</p></div>
        </article>
      `).join("")}
    </section>
  `;
}

function renderPrivacy() {
  return `
    <section class="subpage-stack">
      <div class="text-card">
        <p>위치 정보, 즐겨찾기, 프리셋 저장 방식을 확인하고 관리할 수 있는 화면입니다.</p>
        <button class="secondary">위치 정보 설정</button>
        <button class="secondary">저장 데이터 관리</button>
      </div>
    </section>
  `;
}

function renderMap() {
  const lounge = getSelectedLounge();
  return `
    <section class="screen map-screen">
      <header class="plain-header">
        <button class="icon-btn" data-route="detail" aria-label="뒤로가기">${icon("back")}</button>
        <h1>길찾기</h1>
        <span></span>
      </header>
      <div class="mock-map">
        <div class="route-line"></div>
        <span class="pin start">현재 위치</span>
        <span class="pin end">${lounge.name}</span>
      </div>
      <section class="route-summary">
        <h2>${lounge.name}</h2>
        <p>${lounge.building} ${lounge.floor}까지 도보 ${lounge.walkMinutes}분</p>
        <button class="primary" data-route="detail">라운지 정보 보기</button>
      </section>
    </section>
  `;
}

function renderModal() {
  if (!state.modal) return "";
  if (state.modal === "save") {
    return `
      <div class="modal-backdrop">
        <form class="modal-card" data-save-preset>
          <h2>새로운 프리셋</h2>
          <input name="presetName" placeholder="프리셋 이름" autofocus />
          <div>
            <button type="button" class="secondary" data-close-modal>취소</button>
            <button class="primary">저장</button>
          </div>
        </form>
      </div>
    `;
  }
  return `
    <div class="modal-backdrop">
      <div class="modal-card">
        <h2>저장된 프리셋</h2>
        <div class="preset-list">
          ${state.presets.map((preset, index) => `<button data-preset="${index}">${preset.name}<small>${preset.purpose.concat(preset.features).join(" · ") || "기본 조건"}</small></button>`).join("")}
        </div>
        <button class="secondary" data-close-modal>닫기</button>
      </div>
    </div>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      state.route = button.dataset.route;
      state.activeMetric = null;
      render();
    });
  });
  document.querySelectorAll("[data-home]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      state.route = "home";
      state.favoritesOnly = false;
      state.profilePage = "";
      state.activeMetric = null;
      render();
    });
  });
  document.querySelectorAll("[data-open-lounge]").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedLoungeId = card.dataset.openLounge;
      state.route = "detail";
      render();
    });
  });
  document.querySelectorAll("[data-favorite]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = button.dataset.favorite;
      state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
      render();
    });
  });
  document.querySelector("[data-toggle-favorites]")?.addEventListener("click", () => {
    state.favoritesOnly = !state.favoritesOnly;
    state.route = "home";
    render();
  });
  document.querySelectorAll("[data-sort-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.sortMode = button.dataset.sortMode;
      render();
    });
  });
  document.querySelectorAll("[data-metric]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeMetric = state.activeMetric === button.dataset.metric ? null : button.dataset.metric;
      render();
    });
  });
  document.querySelector("[data-toggle-trend]")?.addEventListener("click", () => {
    state.trendOpen = !state.trendOpen;
    render();
  });
  document.querySelectorAll("[data-chip]").forEach((button) => {
    button.addEventListener("click", () => toggleChip(button.dataset.chipType, button.dataset.chip));
  });
  document.querySelectorAll("[data-campus]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCampus = state.selectedCampus === button.dataset.campus ? "" : button.dataset.campus;
      state.selectedBuildings = [];
      render();
    });
  });
  document.querySelectorAll("[data-departure-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.departureMode = button.dataset.departureMode;
      if (state.departureMode !== "later") state.showDatePicker = false;
      render();
    });
  });
  document.querySelector("[data-toggle-date-picker]")?.addEventListener("click", () => {
    state.showDatePicker = !state.showDatePicker;
    render();
  });
  document.querySelector("[data-date-select]")?.addEventListener("change", (event) => {
    state.departureDate = event.currentTarget.value;
    render();
  });
  document.querySelectorAll("[data-time-value]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.timePart === "delay") state.departureDelay = button.dataset.timeValue;
      if (button.dataset.timePart === "period") state.departurePeriod = button.dataset.timeValue;
      if (button.dataset.timePart === "hour") state.departureHour = button.dataset.timeValue;
      if (button.dataset.timePart === "minute") state.departureMinute = button.dataset.timeValue;
      render();
    });
  });
  document.querySelectorAll("[data-wheel-step]").forEach((button) => {
    button.addEventListener("click", () => {
      stepWheel(button.dataset.wheelStep, Number(button.dataset.wheelDir));
      render();
    });
  });
  document.querySelectorAll("[data-profile-field]").forEach((field) => {
    const updateProfile = () => {
      state.profile[field.dataset.profileField] = field.value;
      state.profile.saved = true;
      render();
    };
    field.addEventListener("input", () => {
      state.profile[field.dataset.profileField] = field.value;
      state.profile.saved = true;
    });
    field.addEventListener("change", updateProfile);
    field.addEventListener("blur", updateProfile);
  });
  document.querySelector("[data-profile-photo]")?.addEventListener("click", () => {
    document.querySelector("[data-profile-photo-input]")?.click();
  });
  document.querySelector("[data-profile-photo-input]")?.addEventListener("change", (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      state.profile.photo = reader.result;
      state.profile.saved = true;
      render();
    });
    reader.readAsDataURL(file);
  });
  document.querySelector("[data-reset-filters]")?.addEventListener("click", () => {
    state.selectedPurpose = [];
    state.selectedFeatures = [];
    state.selectedCampus = "";
    state.selectedBuildings = [];
    state.departureMode = "now";
    state.showDatePicker = false;
    render();
  });
  document.querySelectorAll("[data-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      state.modal = button.dataset.modal;
      render();
    });
  });
  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", () => {
      state.modal = null;
      render();
    });
  });
  document.querySelector("[data-save-preset]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = new FormData(event.currentTarget).get("presetName")?.toString().trim();
    if (name) {
      state.presets.push({ name, purpose: [...state.selectedPurpose], features: [...state.selectedFeatures], campus: state.selectedCampus, buildings: [...state.selectedBuildings], departureMode: state.departureMode });
    }
    state.modal = null;
    render();
  });
  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = state.presets[Number(button.dataset.preset)];
      Object.assign(state, {
        selectedPurpose: [...preset.purpose],
        selectedFeatures: [...preset.features],
        selectedCampus: preset.campus,
        selectedBuildings: [...preset.buildings],
        departureMode: preset.departureMode,
        modal: null,
      });
      render();
    });
  });
  document.querySelectorAll("[data-profile-page]").forEach((button) => {
    button.addEventListener("click", () => {
      state.profilePage = button.dataset.profilePage;
      render();
    });
  });
  document.querySelector("[data-profile-back]")?.addEventListener("click", () => {
    state.profilePage = "";
    render();
  });
  document.querySelectorAll("[data-toggle-notification]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.toggleNotification;
      state.notifications[key] = !state.notifications[key];
      render();
    });
  });
}

function stepWheel(part, direction) {
  const valuesByPart = {
    delay: ["5", "10", "15", "20", "30", "45", "60", "90", "120"],
    period: ["오전", "오후"],
    hour: Array.from({ length: 12 }, (_, index) => String(index + 1)),
    minute: Array.from({ length: 12 }, (_, index) => String(index * 5).padStart(2, "0")),
  };
  const stateKeyByPart = {
    delay: "departureDelay",
    period: "departurePeriod",
    hour: "departureHour",
    minute: "departureMinute",
  };
  const values = valuesByPart[part];
  const stateKey = stateKeyByPart[part];
  if (!values || !stateKey) return;
  const currentIndex = Math.max(0, values.indexOf(state[stateKey]));
  const nextIndex = (currentIndex + direction + values.length) % values.length;
  state[stateKey] = values[nextIndex];
}

function toggleChip(type, value) {
  const listMap = {
    purpose: "selectedPurpose",
    feature: "selectedFeatures",
    building: "selectedBuildings",
  };
  const key = listMap[type];
  if (!key) return;
  state[key] = state[key].includes(value) ? state[key].filter((item) => item !== value) : [...state[key], value];
  render();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js?v=15").catch(() => {}));
}

render();
