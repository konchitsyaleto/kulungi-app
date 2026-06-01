import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

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

const metricDescriptions = {
  crowd: {
    "여유": "사람이 적은 한가로운 라운지네요. 룽지가 커피 한 잔을 즐기며 SNS에서 아깽이 사진을 보면서 힐링하기 딱 좋은 정도예요.",
    "보통": "평소보다 조금 사람들이 많아요. 쿠와 룽지는 친해서 서로 붙어 있어도 좋지만, 유저님이 내향형 인간이라면 좀 부담스러울 수 있어요.",
    "혼잡": "평소보다 사람이 아주 많아요. 고양이 룽지는 액체라서 쿠와 지코 사이에 갇혀도 괜찮지만, 인간 유저님은 위험할 수도 있어요.",
  },
  noise: {
    "조용": "아주 조용하고 집중하기 좋은 환경이에요. 룽지는 라운지가 너무 조용한 탓에 그만 가부좌를 틀고 앉아 열반에 오르려 하고 있어요.",
    "보통": "시끄럽지는 않지만 대화가 가능한 분위기예요. 팀플 회의를 위해 사용해도 좋고, 쿠와 룽지처럼 어제 먹은 멸치볶음에 대해 얘기해도 좋아요.",
    "높음": "평소보다 시끄러워요. 여기가 라운지인지, 입실렌티 무대인지 헷갈린 룽지가 한껏 빼입고 그동안 갈고 닦은 디스코 실력을 뽐내고 있어요.",
    "시끄러움": "평소보다 시끄러워요. 여기가 라운지인지, 입실렌티 무대인지 헷갈린 룽지가 한껏 빼입고 그동안 갈고 닦은 디스코 실력을 뽐내고 있어요.",
  },
  sit: {
    "있음": "비어있는 자리가 많아요. 게으른 룽지가 와서 앉아버리기 전에 어서 가서 앉으세요!",
    "조금": "조금 기다려야 할 수도 있어요. 빈자리가 없어도 룽지가 금방 일어날 수도 있으니 잠시 기다려 보는 것도 좋아요.",
    "없음": "자리가 거의 없어요. 룽지는 낮잠을 오래 자기 때문에 일어나기를 기다리기보다는 다른 라운지로 떠나는게 나을 수 있어요.",
    "적음": "자리가 거의 없어요. 룽지는 낮잠을 오래 자기 때문에 일어나기를 기다리기보다는 다른 라운지로 떠나는게 나을 수 있어요.",
  },
  charge: {
    "넉넉": "사용하지 않는 콘센트가 많아요. 지코가 멀뚱히 서서 어제 먹은 말차 아이스크림의 맛을 떠올리고 있어요.",
    "보통": "사용되고 있는 콘센트가 많아요. 쿠는 남은 자리를 찾기 귀찮았는지 아무 말 없이 충전기 코드를 지코에게 건내고 있어요.",
    "적음": "거의 모든 콘센트가 사용 중이에요. 결국 쿠의 노트북은 지코가 어제 먹은 말차 아이스크림으로 충전되고 있어요.",
  },
};

let lounges = [
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
      { key: "sit", label: "자리 유무", value: "없음", tone: "bad", detail: "빈 좌석이 거의 없어 대기 가능성이 있어요." },
      { key: "charge", label: "콘센트", value: "보통", tone: "warn", detail: "콘센트 좌석 경쟁이 높은 시간대예요." },
    ],
    details: [
      ["좌석 형태", "1인석, 열람석"],
      ["테이블 형태", "긴 책상"],
      ["인접 시설", "복사실, 사물함"],
      ["운영 시간", "평일 09:00-23:00"],
      ["라운지 규칙", "정숙 필수, 취식 제한"],
    ],
  },
];

const purposeOptions = ["공부", "팀플", "짧은 휴식", "잠", "취식", "수다", "노트북 사용"];
const partyOptions = ["혼자", "둘이", "서너명", "다섯명 이상"];
const featureOptions = ["조용함", "대화 가능", "백색 소음", "밝음", "어두움", "1인석", "다인석", "취식 가능", "칸막이", "높은 테이블", "낮은 테이블", "딱딱한 의자", "소파", "누울 수 있는 자리", "콘센트", "프린터", "정수기", "도서반납기", "카페", "복사기", "편의점", "은행/ATM", "샤워실"];
const purposeFilterMap = {
  공부: { party: "혼자", features: ["조용함", "밝음", "1인석", "높은 테이블", "딱딱한 의자"] },
  팀플: { party: "서너명", features: ["대화 가능", "다인석"] },
  "짧은 휴식": { party: "혼자", features: ["조용함", "낮은 테이블", "소파"] },
  잠: { party: "혼자", features: ["조용함", "어두움", "누울 수 있는 자리"] },
  취식: { party: "", features: ["취식 가능"] },
  수다: { party: "둘이", features: ["대화 가능", "다인석", "소파"] },
  "노트북 사용": { party: "혼자", features: ["백색 소음", "콘센트"] },
};
const featureFieldMap = {
  "백색 소음": "white_noise",
  "밝음": "bright",
  "어두움": "dark",
  "1인석": "individual",
  "다인석": "multi",
  "취식 가능": "eat",
  "칸막이": "partition",
  "높은 테이블": "high_table",
  "낮은 테이블": "low_table",
  "딱딱한 의자": "hard_chair",
  "소파": "sofa",
  "누울 수 있는 자리": "lie",
  "콘센트": "charge",
  "프린터": "printer",
  "정수기": "water",
  "도서반납기": "book_dispenser",
  "카페": "cafe",
  "복사기": "copier",
  "편의점": "convenience",
  "은행/ATM": "bank",
  "샤워실": "shower",
};
const buildingImages = [
  { code: 10001, src: "./buildings/10001.jpg" },
  { code: 10002, src: "./buildings/10002.jpg" },
  { code: 10003, src: "./buildings/10003.jpg" },
  { code: 10004, src: "./buildings/10004.jpg" },
  { code: 10005, src: "./buildings/10005.jpg" },
  { code: 10006, src: "./buildings/10006.jpg" },
  { code: 10007, src: "./buildings/10007.jpg" },
  { code: 10008, src: "./buildings/10008.webp" },
  { code: 10009, src: "./buildings/10009.jpg" },
  { code: 10010, src: "./buildings/10010.jpeg" },
  { code: 10011, src: "./buildings/10011.png" },
  { code: 10012, src: "./buildings/10012.jpg" },
  { code: 10013, src: "./buildings/10013.jpeg" },
  { code: 10014, src: "./buildings/10014.png" },
  { code: 10015, src: "./buildings/10015.jpg" },
  { code: 10016, src: "./buildings/10016.jpg" },
  { code: 10017, src: "./buildings/10017.jpg" },
  { code: 10018, src: "./buildings/10018.jpg" },
  { code: 10019, src: "./buildings/10019.jpg" },
  { code: 10020, src: "./buildings/10020.webp" },
  { code: 10021, src: "./buildings/10021.webp" },
  { code: 10022, src: "./buildings/10022.png" },
  { code: 10023, src: "./buildings/10023.jpg" },
  { code: 10024, src: "./buildings/10024.jpg" },
  { code: 10025, src: "./buildings/10025.jpg" },
  { code: 10027, src: "./buildings/10027.jpg" },
  { code: 10028, src: "./buildings/10028.png" },
  { code: 10029, src: "./buildings/10029.jpg" },
  { code: 10030, src: "./buildings/10030.webp" },
  { code: 10031, src: "./buildings/10031.jpg" },
  { code: 10032, src: "./buildings/10032.webp" },
  { code: 10033, src: "./buildings/10033.jpg" },
  { code: 10034, src: "./buildings/10034.jpg" },
  { code: 10035, src: "./buildings/10035.jpg" },
  { code: 10036, src: "./buildings/10036.jpg" },
  { code: 10037, src: "./buildings/10037.webp" },
  { code: 10040, src: "./buildings/10040.jpg" },
  { code: 20001, src: "./buildings/20001.jpeg" },
  { code: 20002, src: "./buildings/20002.jpg" },
  { code: 20006, src: "./buildings/20006.webp" },
  { code: 20008, src: "./buildings/20008.jpeg" },
  { code: 20012, src: "./buildings/20012.jpg" },
  { code: 20015, src: "./buildings/20015.jpeg" },
  { code: 20017, src: "./buildings/20017.webp" },
  { code: 20018, src: "./buildings/20018.jpg" },
  { code: 20020, src: "./buildings/20020.webp" },
  { code: 20022, src: "./buildings/20022.jpg" },
];
const AUTH_USERS_KEY = "kulungi-users-v1";
const AUTH_SESSION_KEY = "kulungi-session-v1";
const AUTH_GUEST_KEY = "kulungi-guest-v1";
const SUPABASE_URL = "https://fdnpthvvhpfoniogmyns.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_5bVTx2uUwmkJ31x3BpY6vA_VPRgVDjA";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
const adminNicknames = ["테스트2"];
const allowedNicknames = ["비플렉스", "강소은", "다인", "주리", "테스트2"];
let collegeMajorData = [];
let seatSimulationData = null;
let staticSeatOccupancyData = null;
const blueprintCache = {};
const seatAvailabilityCache = {};
let mascotAudio = null;
let maxCrowdValue = 100;

if (window.LOUNGE_RAW_DATA?.length) lounges = buildLounges(window.LOUNGE_RAW_DATA);
const campuses = buildCampuses(lounges);
const defaultFavorites = lounges.filter((lounge) => lounge.favorite).map((lounge) => lounge.id);
const defaultPresets = [{ name: "개인 공부", purpose: ["공부"], features: ["조용함", "콘센트"], campus: "", buildings: [], departureMode: "now" }];

const state = {
  route: initialRoute(),
  selectedLoungeId: lounges[0].id,
  favoritesOnly: false,
  favorites: new Set(defaultFavorites),
  selectedPurpose: [],
  selectedParty: "",
  selectedFeatures: [],
  loungeSearch: "",
  loungeSearchDraft: "",
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
  presets: [...defaultPresets],
  modal: null,
  activeMetric: null,
  trendOpen: false,
  simulationTime: "",
  showOutlets: false,
  mascotBgmPlaying: true,
  profilePage: "",
  authError: "",
  authPasswordVisible: false,
  authDraft: {
    nickname: "",
    password: "",
  },
  currentUser: null,
  isGuest: false,
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
    role: "user",
  },
};

const app = document.querySelector("#app");
let lastRenderedRoute = "";
applyStoredSession();

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
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V22a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H2a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V2a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4H22a1.7 1.7 0 0 0-1.5 1Z"/></svg>',
  };
  return icons[name] || "";
}

function metricIcon(metric) {
  return `<img src="./_256/${metric.key}-${TONE[metric.tone]}_256.png" alt="" />`;
}

function getSelectedLounge() {
  return simulateLounge(lounges.find((lounge) => lounge.id === state.selectedLoungeId) || lounges[0]);
}

function initialRoute() {
  if (localStorage.getItem(AUTH_SESSION_KEY)) return "home";
  return "welcome";
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function applyStoredSession() {
  localStorage.removeItem(AUTH_GUEST_KEY);
  const nickname = localStorage.getItem(AUTH_SESSION_KEY);
  if (!nickname) return;
  const user = readUsers()[nickname];
  if (!user) {
    localStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }
  applyUser(user);
}

function applyUser(user) {
  state.currentUser = user.nickname;
  state.isGuest = false;
  const role = adminNicknames.includes(user.nickname) ? "admin" : user.role || "user";
  state.profile = { ...state.profile, ...user.profile, saved: false, role };
  state.favorites = new Set(user.favorites?.length ? user.favorites : defaultFavorites);
  state.presets = user.presets?.length ? user.presets : [...defaultPresets];
}

function persistCurrentUser() {
  if (!state.currentUser) return;
  const users = readUsers();
  const user = users[state.currentUser];
  if (user) {
    user.profile = { ...state.profile, saved: false };
    user.favorites = [...state.favorites];
    user.presets = state.presets;
    user.role = adminNicknames.includes(user.nickname) ? "admin" : user.role || "user";
    users[state.currentUser] = user;
    writeUsers(users);
  }
  syncSupabaseUserData().catch(() => {});
}

async function passwordHash(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function nicknameToAuthEmail(nickname) {
  const encoded = [...new TextEncoder().encode(nickname)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `u_${encoded}@kulungi.app`;
}

async function restoreSupabaseSession() {
  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;
  if (!user) return;
  await loadSupabaseUserData(user);
  localStorage.removeItem(AUTH_GUEST_KEY);
  state.route = "home";
}

async function loadSupabaseUserData(user) {
  const nickname = user.user_metadata?.nickname || state.currentUser || "쿠룽지 친구";
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const { data: favorites } = await supabase.from("favorites").select("lounge_id").eq("user_id", user.id);
  const { data: presets } = await supabase.from("presets").select("name, config").eq("user_id", user.id).order("created_at", { ascending: true });
  state.currentUser = nickname;
  state.isGuest = false;
  state.profile = {
    ...state.profile,
    name: profile?.nickname || nickname,
    college: profile?.college || state.profile.college,
    department: profile?.department || state.profile.department,
    photo: profile?.photo || "",
    role: adminNicknames.includes(nickname) ? "admin" : "user",
    saved: false,
  };
  state.favorites = new Set(favorites?.length ? favorites.map((item) => item.lounge_id) : defaultFavorites);
  state.presets = presets?.length ? presets.map((item) => ({ name: item.name, ...item.config })) : [...defaultPresets];
}

async function syncSupabaseUserData() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return;
  await supabase.from("profiles").upsert({
    id: user.id,
    nickname: state.profile.name,
    college: state.profile.college,
    department: state.profile.department,
    photo: state.profile.photo,
    updated_at: new Date().toISOString(),
  });
  await supabase.from("favorites").delete().eq("user_id", user.id);
  if (state.favorites.size) {
    await supabase.from("favorites").insert([...state.favorites].map((loungeId) => ({ user_id: user.id, lounge_id: loungeId })));
  }
  await supabase.from("presets").delete().eq("user_id", user.id);
  if (state.presets.length) {
    await supabase.from("presets").insert(state.presets.map((preset) => ({ user_id: user.id, name: preset.name, config: preset })));
  }
}

function authErrorMessage(error) {
  const message = error?.message || "";
  if (message.toLowerCase().includes("email not confirmed")) return "Supabase 이메일 확인이 켜져 있어요. Authentication 설정에서 Confirm email을 꺼주세요.";
  if (message.toLowerCase().includes("invalid login credentials")) return "닉네임이나 비밀번호가 맞지 않습니다.";
  if (message.toLowerCase().includes("user already registered")) return "이미 가입된 닉네임입니다. 로그인으로 들어와주세요.";
  if (message.toLowerCase().includes("password")) return "비밀번호는 Supabase 기준에 맞게 6자 이상으로 입력해주세요.";
  return message || "로그인 처리 중 문제가 생겼습니다.";
}

async function finishSupabaseLogin(user, nickname) {
  const localUser = readUsers()[nickname] || {
    nickname,
    role: "user",
    profile: { name: nickname, college: state.profile.college, department: state.profile.department, photo: "", saved: false, role: "user" },
    favorites: defaultFavorites,
    presets: defaultPresets,
  };
  localStorage.setItem(AUTH_SESSION_KEY, nickname);
  localStorage.removeItem(AUTH_GUEST_KEY);
  applyUser(localUser);
  await loadSupabaseUserData(user);
  await syncSupabaseUserData();
  state.route = "home";
  state.authError = "";
}

function colleges() {
  return [...new Set(collegeMajorData.map((item) => item.college).filter(Boolean))];
}

function majorsForCollege(college) {
  return collegeMajorData.filter((item) => item.college === college).map((item) => item.major).filter(Boolean);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[char]));
}

function summaryTitle() {
  if (state.loungeSearch.trim()) return `"${state.loungeSearch.trim()}" 검색 결과예요`;
  if (state.favoritesOnly) return "즐겨찾기한 라운지예요";
  if (state.selectedPurpose.length) return `${state.selectedPurpose[0]}에 알맞은 라운지예요`;
  if (state.selectedFeatures.includes("조용함")) return "조용한 시간을 보내기 좋은 라운지예요";
  return "지금 추천드리는 라운지예요";
}

function filteredLounges(includeSearch = true) {
  let result = lounges.map(simulateLounge);
  const query = state.loungeSearch.trim().toLowerCase();
  if (includeSearch && query) result = result.filter((lounge) => `${lounge.name} ${lounge.building}`.toLowerCase().includes(query));
  if (state.favoritesOnly) result = result.filter((lounge) => state.favorites.has(lounge.id));
  if (state.selectedCampus && !state.selectedBuildings.length) result = result.filter((lounge) => lounge.campus === state.selectedCampus);
  if (state.selectedBuildings.length) result = result.filter((lounge) => state.selectedBuildings.includes(lounge.building));
  result.sort(sortLounges);
  return result;
}

function sortLounges(a, b) {
  const minutes = selectedUseMinutes();
  if (state.sortMode === "crowd") return currentCrowdValue(a.crowdByTime || [], a.currentCrowd || 0, minutes) - currentCrowdValue(b.crowdByTime || [], b.currentCrowd || 0, minutes) || scoreLounge(b) - scoreLounge(a);
  if (state.sortMode === "distance") return a.distanceM - b.distanceM || scoreLounge(b) - scoreLounge(a);
  return scoreLounge(b) - scoreLounge(a);
}

function scoreLounge(lounge) {
  const minutes = selectedUseMinutes();
  const score = recommendationScoreAt(lounge, minutes);
  return score * 100;
}

function recommendationScoreAt(lounge, minutes) {
  const crowdValue = currentCrowdValue(lounge.crowdByTime || [], lounge.currentCrowd || 0, minutes);
  const congestionScore = crowdScoreFromValue(crowdValue);
  const seatScore = seatAvailabilityAt(lounge, minutes).availableSeats > 0 ? 1 : 0;
  const availability = seatScore * 0.5 + congestionScore * 0.5;
  const purposeFit = purposeFitScore(lounge);
  const distanceScore = clamp(1 - (lounge.distanceM || 0) / 1908, 0, 1);
  return clamp(availability * 0.4 + purposeFit * 0.3 + distanceScore * 0.15 + 0.15, 0, 1);
}

function purposeFitScore(lounge) {
  const filters = selectedRecommendationFilters();
  if (!filters.length) return 1;
  return clamp(filters.reduce((sum, filter) => sum + filterScore(lounge, filter), 0) / filters.length, 0, 1);
}

function selectedRecommendationFilters() {
  return [...new Set([state.selectedParty, ...state.selectedFeatures].filter(Boolean))];
}

function filterScore(lounge, filter) {
  if (filter === "조용함") return noiseLevelValue(lounge) === 1 ? 1 : 0;
  if (filter === "대화 가능") return noiseLevelValue(lounge) === 2 ? 1 : 0;
  const partyField = { "혼자": "alone", "둘이": "two", "서너명": "threefour", "다섯명 이상": "fiveormore" }[filter];
  const field = partyField || featureFieldMap[filter] || filter;
  return flagValue(lounge.raw?.[field]) ? 1 : 0;
}

function noiseLevelValue(lounge) {
  return numberValue(lounge.raw?.noise_level ?? lounge.raw?.["noise level"], 0);
}

function requiredConditionFit(lounge) {
  const required = [];
  if (state.selectedPurpose.includes("취식")) required.push(featureFlag(lounge, "취식 가능"));
  state.selectedFeatures.forEach((feature) => {
    if (featureFieldMap[feature]) required.push(featureFlag(lounge, feature));
  });
  if (state.selectedFeatures.includes("조용함")) required.push(quietness(lounge) > 0.55);
  if (state.selectedFeatures.includes("대화 가능")) required.push(moderateNoise(lounge) > 0.45);
  if (!required.length) return 1;
  return required.filter(Boolean).length / required.length;
}

function partyFitScore(lounge) {
  if (!state.selectedParty) return 0.65;
  const partyField = { "혼자": "alone", "둘이": "two", "서너명": "threefour", "다섯명 이상": "fiveormore" }[state.selectedParty];
  if (partyField && featureFlag(lounge, partyField)) return 1;
  const tableText = `${lounge.tableTypes.join(" ")} ${lounge.raw.default_type || ""}`;
  const groupSeat = /4인|6인|다인|큰|소파|계단|테이블/.test(tableText);
  if (state.selectedParty === "혼자") return /1인|개인|독립|벽면/.test(tableText) ? 1 : 0.65;
  if (state.selectedParty === "둘이") return /2인|4인|테이블|소파/.test(tableText) ? 1 : 0.55;
  if (state.selectedParty === "서너명") return groupSeat ? 1 : 0.35;
  if (state.selectedParty === "다섯명 이상") return /6인|다인|계단|큰|소파/.test(tableText) ? 1 : 0.25;
  return 0.65;
}

function selectedFeaturesFit(lounge) {
  if (!state.selectedFeatures.length) return 0.6;
  const haystack = `${lounge.tags.join(" ")} ${lounge.details.map((row) => row[1]).join(" ")}`;
  const matched = state.selectedFeatures.filter((feature) => featureFlag(lounge, feature) || haystack.includes(feature));
  return matched.length / state.selectedFeatures.length;
}

function featureFlag(lounge, feature) {
  const field = featureFieldMap[feature] || feature;
  if (feature === "조용함") return quietness(lounge) > 0.55;
  if (feature === "대화 가능") return moderateNoise(lounge) > 0.45;
  return flagValue(lounge.raw?.[field]);
}

function selectedWantsQuiet() {
  return state.selectedPurpose.some((item) => ["공부", "잠", "노트북 사용"].includes(item)) || state.selectedFeatures.includes("조용함");
}

function quietness(lounge) {
  return clamp(1 - currentNoiseValue(lounge.raw || {}, activeSimulationMinutes()) / 80, 0, 1);
}

function moderateNoise(lounge) {
  return clamp(1 - Math.abs(currentNoiseValue(lounge.raw || {}, activeSimulationMinutes()) - 55) / 40, 0, 1);
}

function brightnessPreference(lounge) {
  if (state.selectedFeatures.includes("어두움")) return clamp(1 - lounge.brightness / 100, 0, 1);
  if (state.selectedFeatures.includes("밝음")) return clamp(lounge.brightness / 100, 0, 1);
  return comfortableLighting(lounge);
}

function comfortableLighting(lounge) {
  return clamp(1 - Math.abs(lounge.brightness - 55) / 55, 0, 1);
}

function recommendationPercent(lounge) {
  return Math.round(scoreLounge(simulateLounge(lounge)));
}

function render() {
  const routeChanged = lastRenderedRoute && lastRenderedRoute !== state.route;
  if (accessBlocked()) state.route = "restricted";
  const views = {
    welcome: renderWelcome,
    guestConfirm: renderGuestConfirm,
    signup: renderSignup,
    login: renderLogin,
    restricted: renderRestricted,
    home: renderHome,
    detail: renderDetail,
    search: renderSearch,
    profile: renderProfile,
  };
  if (!views[state.route]) state.route = "home";
  app.innerHTML = `<main class="phone-shell">${renderAdminTimeBar()}${views[state.route]()}</main>${renderModal()}`;
  bindEvents();
  if (state.route === "home") updateHomeSearchResults();
  alignTimePicker();
  initSeatingPlans();
  adjustHeroTone();
  manageMascotBgm();
  if (routeChanged) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  lastRenderedRoute = state.route;
}

function accessBlocked() {
  return !["welcome", "guestConfirm", "signup", "login", "restricted"].includes(state.route) && !canAccessProject();
}

function canAccessProject() {
  return allowedNicknames.includes(state.profile.name) || allowedNicknames.includes(state.currentUser) || state.profile.role === "admin";
}

function isSimulationAdmin() {
  return state.currentUser === "테스트2" || state.profile.name === "테스트2";
}

function renderAdminTimeBar() {
  if (!isSimulationAdmin() || ["welcome", "guestConfirm", "signup", "login", "restricted"].includes(state.route)) return "";
  return `
    <div class="admin-time-bar">
      <label>
        <span>시간 설정</span>
        <select data-simulation-time>
          ${simulationTimeOptions().map((time) => `<option value="${time}" ${simulationTimeValue() === time ? "selected" : ""}>${time}</option>`).join("")}
        </select>
      </label>
    </div>
  `;
}

function renderRestricted() {
  return `
    <section class="screen auth-screen welcome-auth">
      <div class="auth-center">
        <div class="auth-logo">kulungi</div>
        <h1>발표 전까지<br />프로젝트 인원만 볼 수 있어요.</h1>
        <p class="restricted-copy">허용된 계정으로 로그인해주세요.</p>
        <div class="auth-actions">
          <button class="auth-primary" data-auth-route="login">로그인</button>
          <button class="auth-login-link" data-auth-route="signup">쿠룽지 친구 되기</button>
        </div>
      </div>
    </section>
  `;
}

function renderWelcome() {
  return `
    <section class="screen auth-screen welcome-auth">
      <div class="auth-center">
        <div class="auth-logo">kulungi</div>
        <h1>안녕하세요.<br />쿠룽지에 오신 걸 환영해요.</h1>
        <div class="auth-actions">
          <button class="auth-primary" data-auth-route="signup">쿠룽지 친구 되기</button>
          <button class="auth-login-link" data-auth-route="login">이미 쿠룽지 친구예요</button>
          <button class="auth-ghost" data-guest-start>친구는 좀 부담스러워요</button>
        </div>
      </div>
    </section>
  `;
}

function renderGuestConfirm() {
  return `
    <section class="screen auth-screen guest-confirm-screen">
      <div class="auth-center guest-confirm-card">
        <img class="guest-confirm-image" src="./_256/no_login.png" alt="" />
        <h1>쿠룽지 친구가 되지 않으면 설정을 저장할 수 없고 룽지가 울어요</h1>
        <div class="guest-confirm-actions">
          <button data-auth-route="signup">알았어요 친구 할게요</button>
          <button data-auth-route="login">사실 이미 친구예요</button>
          <button data-guest-confirm>그래도 친구는 좀 부담스러워요</button>
        </div>
      </div>
    </section>
  `;
}

function renderSignup() {
  return `
    <section class="screen auth-screen form-auth">
      <header class="plain-header">
        <button class="icon-btn" data-auth-route="welcome" aria-label="뒤로가기">${icon("back")}</button>
        <h1>쿠룽지 친구 되기</h1>
        <span></span>
      </header>
      <form class="auth-form" data-signup-form>
        <div class="auth-photo">
          ${profilePhoto("edit-avatar")}
          <button type="button" data-auth-photo>바꾸기</button>
          <input class="visually-hidden" type="file" accept="image/*" data-auth-photo-input />
        </div>
        ${authField("nickname", "닉네임")}
        ${authField("password", "비밀번호", "password")}
        ${collegeSelectField()}
        ${majorSelectField()}
        ${state.authError ? `<p class="auth-error">${escapeHtml(state.authError)}</p>` : ""}
        <button class="auth-primary" type="submit">친구 되기</button>
      </form>
    </section>
  `;
}

function renderLogin() {
  return `
    <section class="screen auth-screen form-auth">
      <header class="plain-header">
        <button class="icon-btn" data-auth-route="welcome" aria-label="뒤로가기">${icon("back")}</button>
        <h1>이미 쿠룽지 친구예요</h1>
        <span></span>
      </header>
      <form class="auth-form compact" data-login-form>
        ${authField("nickname", "닉네임")}
        ${authField("password", "비밀번호", "password")}
        ${state.authError ? `<p class="auth-error">${escapeHtml(state.authError)}</p>` : ""}
        <button class="auth-primary" type="submit">로그인</button>
      </form>
    </section>
  `;
}

function authField(name, placeholder, type = "text") {
  const isPassword = type === "password";
  const inputType = isPassword && !state.authPasswordVisible ? "password" : "text";
  return `
    <label class="auth-field">
      <input name="${name}" type="${inputType}" placeholder="${placeholder}" value="${escapeHtml(state.authDraft[name] || "")}" autocomplete="${isPassword ? "current-password" : "username"}" data-auth-draft="${name}" />
      ${isPassword ? `<button type="button" data-toggle-auth-password aria-label="비밀번호 보기">${icon("eye")}</button>` : ""}
    </label>
  `;
}

function collegeSelectField() {
  const options = colleges();
  const selected = state.profile.college || options[0] || "";
  return `
    <label class="auth-field select-field">
      <select name="college" data-auth-college>
        <option value="">대학</option>
        ${options.map((college) => `<option value="${escapeHtml(college)}" ${selected === college ? "selected" : ""}>${escapeHtml(college)}</option>`).join("")}
      </select>
    </label>
  `;
}

function majorSelectField() {
  const college = state.profile.college || colleges()[0] || "";
  const options = majorsForCollege(college);
  const selected = options.includes(state.profile.department) ? state.profile.department : options[0] || "";
  return `
    <label class="auth-field select-field">
      <select name="department">
        <option value="">학부/과/전공</option>
        ${options.map((major) => `<option value="${escapeHtml(major)}" ${selected === major ? "selected" : ""}>${escapeHtml(major)}</option>`).join("")}
      </select>
    </label>
  `;
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
  const loungesToShow = filteredLounges(false);
  return `
    <section class="screen with-tabbar">
      <header class="home-header">
        <div class="brand">kulungi</div>
        <h1 data-home-summary>${summaryTitle()}</h1>
        <div class="search-bar split-search">
          <input class="search-main lounge-search-input" data-lounge-search value="${escapeHtml(state.loungeSearchDraft || state.loungeSearch)}" placeholder="라운지 검색" aria-label="라운지 검색" />
          <button class="preset-trigger" data-route="search"><span>상세 검색</span>${icon("chevron")}</button>
        </div>
        ${renderSortControls()}
      </header>
      <div class="lounge-list" data-lounge-list>
        ${renderHomeResults(loungesToShow)}
        <div class="empty" data-search-empty hidden>조건에 맞는 라운지가 아직 없어요.</div>
      </div>
      ${renderTabbar()}
    </section>
  `;
}

function renderHomeResults(loungesToShow = filteredLounges()) {
  return loungesToShow.length ? loungesToShow.map(renderLoungeCard).join("") : `<div class="empty">조건에 맞는 라운지가 아직 없어요.</div>`;
}

function renderSortControls() {
  const options = [
    ["recommendation", "추천도순"],
    ["crowd", "혼잡도순"],
    ["distance", "거리순"],
  ];
  return `<div class="sort-controls">${options.map(([value, label]) => `
    <button class="${state.sortMode === value ? "selected" : ""}" data-sort-mode="${value}">
      <i></i><span>${label}</span>
    </button>
  `).join("")}<button class="preset-inline" data-modal="presets">프리셋</button></div>`;
}

function renderLoungeCard(lounge) {
  const isFavorite = state.favorites.has(lounge.id);
  return `
    <article class="lounge-card-wrap" data-lounge-card-name="${escapeHtml(`${lounge.name} ${lounge.building}`.toLowerCase())}">
      <div class="lounge-card" data-open-lounge="${lounge.id}" role="button" tabindex="0">
        <div class="thumb" style="background:${lounge.thumbnail}"><span>라운지 사진</span></div>
        <div class="card-info">
          <div class="card-title-row">
            <h2>${lounge.name}</h2>
            <div class="card-score">
              <button class="icon-btn favorite ${isFavorite ? "active" : ""}" data-favorite="${lounge.id}" aria-label="즐겨찾기">${icon("heart")}</button>
              <small>${recommendationPercent(lounge)}%</small>
            </div>
          </div>
          <p>${lounge.building} ${lounge.floor} · ${lounge.distance}</p>
          <strong class="status mark-${lounge.statusTone}">${statusText[lounge.status]}</strong>
          <div class="tags scroll-tags">${lounge.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        </div>
      </div>
      ${lounge.recommended ? `<button class="recommend-tail" data-open-lounge="${lounge.id}">지금 가면 앉을 수 있어요</button>` : ""}
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
        ${renderSeatMap(lounge)}
        ${renderTrend(lounge)}
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
            <p>${metricDescription(metric)}</p>
          </button>
        `;
      }).join("")}
    </section>
  `;
}

function metricDescription(metric) {
  return metricDescriptions[metric.key]?.[metric.value] || metric.detail;
}

function buildLounges(rows) {
  const built = rows.map((row, index) => {
    const infra = splitList(row.infrastructure);
    const table = splitList(row.default_table);
    const crowdByTime = buildCrowdByTime(row);
    const dayCrowd = dayKeys().map(([, label]) => ({ day: label, value: clamp(numberValue(row.default_populous, 0.5) * 100 + (index % 5) * 3, 0, 100) }));
    const currentCrowd = currentCrowdValue(crowdByTime, numberValue(row.default_populous, 0.5) * 100);
    const crowdMetric = crowdMetricFromScore(crowdScoreFromValue(currentCrowd));
    const noiseValue = currentNoiseValue(row);
    const noiseMetric = noiseMetricFromValue(noiseValue);
    const sitMetric = seatMetricFromAvailability(true, numberValue(row.usage_time, 60));
    const chargeMetric = chargeMetricFromAvailability(flagValue(row.charge), flagValue(row.charge) ? 1 : 0, 1);
    const brightness = flagValue(row.bright) ? 80 : flagValue(row.dark) ? 25 : 55;
    const chargeAvailable = flagValue(row.charge);
    const eatingAllowed = flagValue(row.eat);
    const distanceM = numberValue(row.distance, 0);
    const photo = buildingPhotoFor(row.lounge_code);
    const lounge = {
      id: `lounge-${row.lounge_code || index}`,
      code: row.lounge_code,
      campus: row.campus || "캠퍼스 미정",
      name: row.lounge_name || `${row.building || "건물"} 라운지`,
      building: row.building || "건물 미정",
      floor: row.lounge_floor || "층수 미정",
      distance: formatDistance(distanceM),
      distanceM,
      walkMinutes: arrivalMinutes(distanceM),
      favorite: false,
      recommended: crowdMetric.tone !== "bad",
      recommendation: 0,
      heroTone: "dark",
      status: crowdMetric.tone === "good" ? "calm" : crowdMetric.tone === "warn" ? "normal" : "busy",
      statusTone: crowdMetric.tone,
      tags: buildTags(row, infra, table),
      thumbnail: photo,
      image: photo,
      raw: row,
      crowdByTime,
      dayCrowd,
      brightness,
      eatingAllowed,
      chargeAvailable,
      infrastructure: infra,
      tableTypes: table,
      currentCrowd,
      recommendationByTime: buildRecommendationByTime(row, crowdByTime, distanceM),
      metrics: [
        { key: "crowd", label: "혼잡도", value: crowdMetric.value, tone: crowdMetric.tone, detail: "" },
        { key: "noise", label: "소음도", value: noiseMetric.value, tone: noiseMetric.tone, detail: "" },
        { key: "sit", label: "자리 유무", value: sitMetric.value, tone: sitMetric.tone, detail: "" },
        { key: "charge", label: "콘센트", value: chargeMetric.value, tone: chargeMetric.tone, detail: "" },
      ],
      details: buildDetails(row, infra, table, brightness),
    };
    return lounge;
  });
  maxCrowdValue = Math.max(...built.flatMap((lounge) => lounge.crowdByTime.map((item) => item.value)), 1);
  built.forEach((lounge) => {
    lounge.recommendationByTime = buildRecommendationByTime(lounge.raw, lounge.crowdByTime, lounge.distanceM);
  });
  return built;
}

function buildingPhotoFor(code) {
  const numericCode = numberValue(code, 0);
  const match = buildingImages.reduce((best, image) => {
    if (image.code > numericCode) return best;
    if (!best || image.code > best.code) return image;
    return best;
  }, null);
  return match ? `url(${match.src}) center / cover no-repeat` : "linear-gradient(135deg, #FFFFFF, #F2F4F7)";
}

function formatDistance(distanceM) {
  const distance = Math.max(0, numberValue(distanceM, 0));
  if (distance < 1000) return `${Math.round(distance / 5) * 5}m`;
  return `${(distance / 1000).toFixed(1)}km`;
}

function arrivalMinutes(distanceM) {
  return Math.ceil(Math.max(0, numberValue(distanceM, 0)) / 100 / 5) * 5;
}

function buildRecommendationByTime(row, crowdByTime, distanceM) {
  return crowdByTime.reduce((map, item) => {
    const crowdScore = crowdScoreFromValue(item.value);
    const seatScore = isOpenAt(row, item.time) && item.value / Math.max(maxCrowdValue, 1) < 0.92 ? 1 : 0;
    const availability = seatScore * 0.5 + crowdScore * 0.5;
    const distanceScore = clamp(1 - numberValue(distanceM, 0) / 1908, 0, 1);
    map[item.time] = clamp(availability * 0.4 + distanceScore * 0.15 + 0.15, 0, 1);
    return map;
  }, {});
}

function populousData() {
  return window.POPULOUS_TIME_DATA || {};
}

function populousEntries() {
  return Object.entries(populousData()).filter(([time]) => /^\d{1,2}:\d{2}$/.test(time));
}

function normalizedPopulousKey(time) {
  const minutes = timeLabelToMinutes(time);
  return `${Math.floor(minutes / 60) % 24}:${String(minutes % 60).padStart(2, "0")}`;
}

function populousValueAt(time, fallback = 0.5) {
  const data = populousData();
  const key = normalizedPopulousKey(time);
  const paddedKey = `${String(Math.floor(timeLabelToMinutes(time) / 60) % 24).padStart(2, "0")}:${String(timeLabelToMinutes(time) % 60).padStart(2, "0")}`;
  return clamp(numberValue(data[key] ?? data[paddedKey], fallback), 0, 1);
}

function defaultOpenMinutes(row) {
  return row.open ? timeLabelToMinutes(row.open) : 8 * 60 + 30;
}

function defaultCloseMinutes(row) {
  return row.close ? timeLabelToMinutes(row.close) : 22 * 60 + 30;
}

function isOpenAt(row, time) {
  const minutes = typeof time === "number" ? time : timeLabelToMinutes(time);
  return minutes >= defaultOpenMinutes(row) && minutes <= defaultCloseMinutes(row);
}

function buildCrowdByTime(row) {
  const entries = populousEntries();
  const source = entries.length ? entries : simulationTimeOptions().map((time) => [time, "0.5"]);
  return source
    .filter(([time]) => isOpenAt(row, time))
    .map(([time]) => ({ time: normalizedPopulousKey(time), value: crowdStaticValue(row, time) }));
}

function crowdStaticValue(row, time) {
  const populous = populousValueAt(time, 0.5);
  const occupiedRatio = clamp(numberValue(row.default_populous, 0.5), 0, 1);
  return clamp(occupiedRatio * (populous + 0.5) * 100, 0, 150);
}

function currentNoiseValue(row, minutes = currentClockMinutes()) {
  const populous = populousValueAt(`${Math.floor(minutes / 60) % 24}:${String(minutes % 60).padStart(2, "0")}`, 0.5);
  return numberValue(row.default_noise, 45) * (populous + 0.5);
}

function crowdScoreFromValue(value) {
  return clamp(1 - value / Math.max(maxCrowdValue, 1), 0, 1);
}

function crowdMetricFromScore(score) {
  if (score >= 0.75) return { value: "여유", tone: "good" };
  if (score <= 0.33) return { value: "혼잡", tone: "bad" };
  return { value: "보통", tone: "warn" };
}

function buildCampuses(sourceLounges) {
  return sourceLounges.reduce((acc, lounge) => {
    if (!acc[lounge.campus]) acc[lounge.campus] = [];
    if (!acc[lounge.campus].includes(lounge.building)) acc[lounge.campus].push(lounge.building);
    return acc;
  }, {});
}

function buildTags(row, infra, table) {
  const tags = [
    ...splitList(row.default_type),
    ...infra,
    ...table,
  ].filter(Boolean);
  return [...new Set(tags)];
}

function buildDetails(row, infra, table, brightness) {
  return [
    ["캠퍼스/건물", `${row.campus || "캠퍼스 미정"} · ${row.building || "건물 미정"}`],
    ["층", row.lounge_floor || "층수 미정"],
    ["라운지 형태", row.default_type || "오픈형"],
    ["좌석 및 테이블", table.length ? table.join(", ") : fallbackTable(row.default_type)],
    ["시설", infra.length ? infra.join(", ") : "시설 정보 없음"],
    ["평균 체류시간", `${numberValue(row.usage_time, 0)}분`],
    ["운영 시간", `${row.open || "08:30"}-${row.close || "22:30"} · ${openDaysText(row)}`],
  ];
}

function fallbackTable(type) {
  if ((type || "").includes("룸")) return "2인 테이블, 독립 좌석";
  if ((type || "").includes("계단")) return "계단형 좌석, 낮은 테이블";
  return "1인석, 4인 테이블";
}

function openDaysText(row) {
  const dayFields = [
    [["mon", "Mon", "mon_open"], "월"],
    [["tue", "Tue", "tue_open"], "화"],
    [["wed", "Wed", "wed_open"], "수"],
    [["thu", "Thu", "thu_open"], "목"],
    [["fri", "Fri", "fri_open"], "금"],
    [["sat", "Sat", "sat_open"], "토"],
    [["sun", "Sun", "sun_open"], "일"],
  ];
  const hasDayColumns = dayFields.some(([keys]) => keys.some((key) => Object.prototype.hasOwnProperty.call(row, key)));
  const labels = dayFields.filter(([keys]) => keys.some((key) => flagValue(row[key]) || boolValue(row[key]))).map(([, label]) => label);
  if (labels.length === 7) return "매일 운영";
  if (!labels.length) return hasDayColumns ? "운영일 미정" : "매일 운영";
  return `${labels.join(", ")} 운영`;
}

function brightnessLabel(value) {
  if (value >= 80) return "매우 밝음";
  if (value >= 60) return "밝음";
  if (value >= 40) return "보통";
  if (value >= 20) return "어두움";
  return "매우 어두움";
}

function crowdMetricFromValue(value) {
  return crowdMetricFromScore(crowdScoreFromValue(value));
}

function noiseMetricFromValue(value) {
  if (value < 45) return { value: "조용", tone: "good" };
  if (value < 65) return { value: "보통", tone: "warn" };
  return { value: "높음", tone: "bad" };
}

function seatMetricFromAvailability(hasAvailableSeat, usageTime) {
  if (hasAvailableSeat) return { value: "있음", tone: "good" };
  if (usageTime < 30) return { value: "조금", tone: "warn" };
  return { value: "없음", tone: "bad" };
}

function chargeMetricFromAvailability(chargeAvailable, availableCount, totalCount) {
  if (!chargeAvailable || totalCount <= 0 || availableCount <= 0) return { value: "적음", tone: "bad" };
  if (availableCount >= totalCount / 2) return { value: "넉넉", tone: "good" };
  return { value: "보통", tone: "warn" };
}

function currentCrowdValue(crowdByTime, fallback = 50, minutes = currentClockMinutes()) {
  if (!crowdByTime.length) return fallback;
  return crowdByTime.reduce((best, item) => {
    const itemMinutes = timeKeyToMinutes(item.time);
    return Math.abs(itemMinutes - minutes) < Math.abs(timeKeyToMinutes(best.time) - minutes) ? item : best;
  }, crowdByTime[0]).value;
}

function simulateLounge(lounge) {
  if (!lounge) return lounge;
  const activeMinutes = activeSimulationMinutes();
  const currentCrowd = currentCrowdValue(lounge.crowdByTime || [], lounge.currentCrowd || numberValue(lounge.raw?.default_populous, 0.5) * 100, activeMinutes);
  const currentCrowdNormalized = clamp(currentCrowd / Math.max(maxCrowdValue, 1), 0, 1);
  const crowdMetric = crowdMetricFromScore(crowdScoreFromValue(currentCrowd));
  const cachedSeats = seatAvailabilityFor(lounge, activeMinutes);
  const estimatedSeats = estimatedSeatAvailability(lounge, currentCrowdNormalized, activeMinutes);
  const seatAvailability = cachedSeats || estimatedSeats;
  const sitMetric = seatMetricFromAvailability(seatAvailability.availableSeats > 0, numberValue(lounge.raw?.usage_time, 60));
  const chargeMetric = chargeMetricFromAvailability(lounge.chargeAvailable, seatAvailability.availableOutlets, seatAvailability.totalOutlets);
  const noiseMetric = noiseMetricFromValue(currentNoiseValue(lounge.raw || {}, activeMinutes));
  return {
    ...lounge,
    currentCrowd,
    recommended: canSitOnArrival(lounge),
    status: currentCrowdNormalized < 0.4 ? "calm" : currentCrowdNormalized < 0.75 ? "normal" : "busy",
    statusTone: crowdMetric.tone,
    metrics: [
      { key: "crowd", label: "혼잡도", value: crowdMetric.value, tone: crowdMetric.tone, detail: "" },
      { key: "noise", label: "소음도", value: noiseMetric.value, tone: noiseMetric.tone, detail: "" },
      { key: "sit", label: "자리 유무", value: sitMetric.value, tone: sitMetric.tone, detail: "" },
      { key: "charge", label: "콘센트", value: chargeMetric.value, tone: chargeMetric.tone, detail: "" },
    ],
  };
}

function seatAvailabilityFor(lounge, minutes = selectedUseMinutes()) {
  try {
    const key = seatAvailabilityKey(lounge.code, minutes);
    return seatAvailabilityCache[key] || null;
  } catch {
    return null;
  }
}

function seatAvailabilityKey(code, minutes = selectedUseMinutes()) {
  let time;
  try {
    time = `${Math.floor(minutes / 60) % 24}:${String(minutes % 60).padStart(2, "0")}`;
  } catch {
    const currentMinutes = currentClockMinutes();
    time = `${Math.floor(currentMinutes / 60)}:${String(currentMinutes % 60).padStart(2, "0")}`;
  }
  return `${code || "unknown"}-${normalizedPopulousKey(time)}`;
}

function estimatedSeatAvailability(lounge, currentCrowdNormalized, activeMinutes) {
  if (!isOpenAt(lounge.raw || {}, activeMinutes)) {
    return { availableSeats: 0, totalSeats: 0, availableOutlets: 0, totalOutlets: lounge.chargeAvailable ? 1 : 0 };
  }
  const seatCount = currentCrowdNormalized >= 0.92 ? 0 : Math.max(1, Math.round(24 * (1 - currentCrowdNormalized)));
  const outletTotal = lounge.chargeAvailable ? 4 : 0;
  return {
    availableSeats: seatCount,
    totalSeats: 24,
    availableOutlets: outletTotal ? Math.max(0, Math.round(outletTotal * (1 - currentCrowdNormalized))) : 0,
    totalOutlets: outletTotal,
  };
}

function estimatedSeatAvailabilityByRow(row, time, crowdValue = null) {
  const minutes = typeof time === "number" ? time : timeLabelToMinutes(time);
  if (!isOpenAt(row || {}, minutes)) return { availableSeats: 0, totalSeats: 24, availableOutlets: 0, totalOutlets: flagValue(row?.charge) ? 4 : 0 };
  const timeKey = `${Math.floor(minutes / 60) % 24}:${String(minutes % 60).padStart(2, "0")}`;
  const staticSeats = staticSeatStates(row?.lounge_code, timeKey, 24);
  const totalSeats = staticSeats.length || 24;
  const occupiedSeats = staticSeats.length ? staticSeats.filter(Boolean).length : Math.round(totalSeats * clamp((crowdValue ?? 50) / Math.max(maxCrowdValue, 1), 0, 1));
  const seatCount = totalSeats - occupiedSeats;
  const normalized = clamp((crowdValue ?? crowdStaticValue(row || {}, timeKey)) / Math.max(maxCrowdValue, 1), 0, 1);
  const outletTotal = flagValue(row?.charge) ? 4 : 0;
  return {
    availableSeats: seatCount,
    totalSeats,
    availableOutlets: outletTotal ? Math.max(0, Math.round(outletTotal * (1 - normalized))) : 0,
    totalOutlets: outletTotal,
  };
}

function staticSeatStates(code, time, count) {
  const key = normalizedPopulousKey(time);
  const encoded = staticSeatOccupancyData?.lounges?.[String(code || "").trim()]?.times?.[key];
  if (!encoded) return [];
  return String(encoded).slice(0, count).split("").map((value) => value === "1");
}

function seatAvailabilityAt(lounge, minutes = selectedUseMinutes()) {
  const cached = seatAvailabilityFor(lounge, minutes);
  if (cached) return cached;
  const crowdValue = currentCrowdValue(lounge.crowdByTime || [], lounge.currentCrowd || 0, minutes);
  return estimatedSeatAvailabilityByRow(lounge.raw || {}, minutes, crowdValue);
}

function selectedUseMinutes() {
  if (state.departureMode === "soon") return (activeSimulationMinutes() + numberValue(state.departureDelay, 0)) % (24 * 60);
  if (state.departureMode === "later") {
    let hour = numberValue(state.departureHour, 12) % 12;
    if (state.departurePeriod === "오후") hour += 12;
    return hour * 60 + numberValue(state.departureMinute, 0);
  }
  return activeSimulationMinutes();
}

function arrivalTargetMinutes(lounge) {
  return (activeSimulationMinutes() + arrivalMinutes(lounge.distanceM)) % (24 * 60);
}

function canSitOnArrival(lounge) {
  return seatAvailabilityAt(lounge, arrivalTargetMinutes(lounge)).availableSeats > 0;
}

function activeSimulationMinutes() {
  try {
    return simulationMinutes();
  } catch {
    return currentClockMinutes();
  }
}

function simulationTimeOptions() {
  return Array.from({ length: 288 }, (_, index) => {
    const minutes = index * 5;
    return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  });
}

function simulationTimeValue() {
  if (state.simulationTime) return state.simulationTime;
  const minutes = Math.round(currentClockMinutes() / 5) * 5;
  return `${String(Math.floor(minutes / 60) % 24).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function currentClockMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function simulationMinutes() {
  return timeLabelToMinutes(simulationTimeValue());
}

function crowdTimeKeys() {
  return ["crowd_0830", "crowd_0930", "crowd_1030", "crowd_1130", "crowd_1230", "crowd_1330", "crowd_1430", "crowd_1530", "crowd_1630", "crowd_1730", "crowd_1830", "crowd_1930", "crowd_2030", "crowd_2130", "crowd_2230"];
}

function dayKeys() {
  return [["crowd_mon", "월"], ["crowd_tue", "화"], ["crowd_wed", "수"], ["crowd_thu", "목"], ["crowd_fri", "금"], ["crowd_sat", "토"], ["crowd_sun", "일"]];
}

function splitList(value) {
  return (value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function boolValue(value) {
  return String(value).trim().toUpperCase() === "TRUE";
}

function flagValue(value) {
  const text = String(value ?? "").trim().toUpperCase();
  return text === "1" || text === "TRUE" || text === "Y" || text === "YES";
}

function numberValue(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function renderSeatMap(lounge) {
  return `
    <section class="panel">
      <div class="seat-map-title">
        <h2>좌석도</h2>
        <label class="outlet-switch">
          <span>콘센트 보기</span>
          <input type="checkbox" data-toggle-outlets ${state.showOutlets ? "checked" : ""} />
          <i></i>
        </label>
      </div>
      <div class="seat-plan" data-seating-plan="${lounge.code}" data-crowd="${lounge.currentCrowd}" data-open-seat-plan>
        <canvas aria-label="${lounge.name} 좌석도"></canvas>
        <div class="seat-plan-loading">좌석도를 불러오는 중이에요</div>
      </div>
      <div class="legend"><span class="good"></span> 사용 가능 <span class="warn"></span> 제한 <span class="bad"></span> 사용 중</div>
      <p class="seat-plan-note">일부 의자와 테이블은 비어있더라도 사용이 제한될 수 있어요.</p>
    </section>
  `;
}

function initSeatingPlans() {
  document.querySelectorAll("[data-seating-plan]").forEach((container) => {
    const canvas = container.querySelector("canvas");
    if (!canvas || canvas.dataset.ready) return;
    canvas.dataset.ready = "true";
    renderImageSeatPlan(container, canvas).catch(() => {
      container.classList.add("failed");
      const loading = container.querySelector(".seat-plan-loading");
      if (loading) loading.textContent = "좌석도 이미지를 찾을 수 없어요";
    });
  });
}

async function renderImageSeatPlan(container, canvas) {
  const code = container.dataset.seatingPlan;
  const crowd = numberValue(container.dataset.crowd, 50);
  const lounge = getSelectedLounge();
  const fallback = seatingFallbackPrefix(lounge);
  const [outletsImage, tablesImage, chairsImage] = await Promise.all([
    loadPlanLayer(code, fallback, "E"),
    loadPlanLayer(code, fallback, "T"),
    loadPlanLayer(code, fallback, "C"),
  ]);
  const baseImage = chairsImage || tablesImage || outletsImage;
  if (!baseImage) throw new Error("no seating plan layers");
  const width = baseImage.naturalWidth || baseImage.width;
  const height = baseImage.naturalHeight || baseImage.height;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.aspectRatio = `${width} / ${height}`;
  const context = canvas.getContext("2d");
  context.scale(ratio, ratio);
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  const tables = tablesImage ? detectBoxes(tablesImage) : [];
  const chairs = chairsImage ? detectBoxes(chairsImage) : [];
  const outlets = outletsImage ? detectBoxes(outletsImage) : [];
  const simulation = deterministicSeatSimulation(code, lounge, chairs, tables, outlets, crowd);
  const chairStates = simulation.chairs;
  const tableStates = simulation.tables;
  const outletStates = simulation.outlets;
  if (tablesImage) tintLayer(context, tablesImage, tableStates, width, height, "table");
  if (chairsImage) tintLayer(context, chairsImage, chairStates, width, height, "chair");
  if (outletsImage && state.showOutlets) tintLayer(context, outletsImage, outletStates, width, height, "outlet");
  const cacheKey = seatAvailabilityKey(code, activeSimulationMinutes());
  const previousAvailability = seatAvailabilityCache[cacheKey];
  const nextAvailability = {
    availableSeats: simulation.availableSeats,
    totalSeats: simulation.totalSeats,
    availableOutlets: simulation.availableOutlets,
    totalOutlets: simulation.totalOutlets,
  };
  seatAvailabilityCache[cacheKey] = nextAvailability;
  container.classList.add("ready");
  const loading = container.querySelector(".seat-plan-loading");
  if (loading) loading.textContent = simulation.availableSeats ? `자리가 ${simulation.availableSeats}석 남았어요` : "지금은 앉을 수 있는 자리가 없어요";
  if (!container.closest(".seat-plan-modal") && state.route === "detail" && availabilityChanged(previousAvailability, nextAvailability)) {
    const lounge = getSelectedLounge();
    updateDetailSeatMetric(lounge, nextAvailability);
  }
}

function availabilityChanged(previous, next) {
  if (!previous) return true;
  return previous.availableSeats !== next.availableSeats || previous.totalSeats !== next.totalSeats || previous.availableOutlets !== next.availableOutlets || previous.totalOutlets !== next.totalOutlets;
}

function updateDetailSeatMetric(lounge, availability) {
  const metricCards = document.querySelectorAll(".metric-card");
  const sitMetricCard = [...metricCards].find((card) => card.dataset.metric === "sit");
  if (!sitMetricCard) return;
  const metric = seatMetricFromAvailability(availability.availableSeats > 0, numberValue(lounge.raw?.usage_time, 60));
  sitMetricCard.classList.remove("good", "warn", "bad");
  sitMetricCard.classList.add(metric.tone);
  const value = sitMetricCard.querySelector("strong");
  if (value) value.textContent = metric.value;
}

function deterministicSeatSimulation(code, lounge, chairs, tables, outlets, crowdFallback) {
  const timeKey = normalizedPopulousKey(simulationTimeValue());
  const staticStates = staticSeatStates(code, timeKey, chairs.length);
  const chairStates = chairs.map((chair, index) => ({
    ...chair,
    state: (staticStates[index] ?? lightweightSeatOccupied(code, index, timeKey, crowdFallback)) ? "bad" : "good",
  }));
  const chairTableIndexes = assignChairsToTables(chairStates, tables);
  const tableStates = tables.map((table) => {
    const tableIndex = tables.indexOf(table);
    const assignedChairs = chairStates.filter((_, chairIndex) => chairTableIndexes[chairIndex] === tableIndex);
    return { ...table, state: assignedChairs.some((chair) => chair.state === "bad") ? "bad" : "good" };
  });
  const restrictedChairs = chairStates.map((chair, index) => {
    if (chair.state === "bad") return chair;
    const tableIndex = chairTableIndexes[index];
    const sharedOccupiedTable = tableIndex >= 0 && tableStates[tableIndex]?.state === "bad";
    return sharedOccupiedTable ? { ...chair, state: "warn" } : chair;
  });
  const outletStates = outlets.map((outlet, index) => {
    const nearOccupiedChair = nearestBoxes(outlet, restrictedChairs, 90).some((item) => item.state === "bad");
    const nearOccupiedTable = nearestBoxes(outlet, tableStates, 120).some((item) => item.state === "bad");
    if (!nearOccupiedChair && !nearOccupiedTable) return { ...outlet, state: "good" };
    const used = stableRandom(`${code}-${timeKey}-outlet-${index}`) < 0.7;
    return { ...outlet, state: used ? "bad" : "warn" };
  });
  return {
    chairs: restrictedChairs,
    tables: tableStates,
    outlets: outletStates,
    availableSeats: restrictedChairs.filter((chair) => chair.state === "good").length,
    totalSeats: restrictedChairs.length,
    availableOutlets: outletStates.filter((outlet) => outlet.state === "good").length,
    totalOutlets: outletStates.length,
  };
}

function assignChairsToTables(chairs, tables) {
  return chairs.map((chair) => {
    if (!tables.length) return -1;
    const closest = tables.reduce((best, table, index) => {
      const distance = Math.hypot(chair.cx - table.cx, chair.cy - table.cy);
      const limit = Math.max(table.w, table.h) * 1.65 + Math.max(chair.w, chair.h) * 0.5;
      if (distance > limit) return best;
      if (!best || distance < best.distance) return { index, distance };
      return best;
    }, null);
    return closest ? closest.index : -1;
  });
}

function lightweightSeatOccupied(code, index, time, crowdFallback) {
  const p = populousValueAt(time, clamp(crowdFallback / 100, 0, 1));
  return stableRandom(`${code}-${index}-${time}-static-fallback`) < p;
}

function stableRandom(seed) {
  let hash = 2166136261;
  [...String(seed)].forEach((char) => {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  });
  return (hash >>> 0) / 4294967295;
}

function inverseNormal(p) {
  const a1 = -39.6968302866538;
  const a2 = 220.946098424521;
  const a3 = -275.928510446969;
  const a4 = 138.357751867269;
  const a5 = -30.6647980661472;
  const a6 = 2.50662827745924;
  const b1 = -54.4760987982241;
  const b2 = 161.585836858041;
  const b3 = -155.698979859887;
  const b4 = 66.8013118877197;
  const b5 = -13.2806815528857;
  const c1 = -0.00778489400243029;
  const c2 = -0.322396458041136;
  const c3 = -2.40075827716184;
  const c4 = -2.54973253934373;
  const c5 = 4.37466414146497;
  const c6 = 2.93816398269878;
  const d1 = 0.00778469570904146;
  const d2 = 0.32246712907004;
  const d3 = 2.445134137143;
  const d4 = 3.75440866190742;
  const low = 0.02425;
  const high = 1 - low;
  if (p < low) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
  if (p > high) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
  }
  const q = p - 0.5;
  const r = q * q;
  return (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
}

async function loadPlanLayer(code, fallback, type) {
  const candidates = type === "E"
    ? [`./seating-plans/${code}-${type}.png`]
    : [`./seating-plans/${code}-${type}.png`, `./seating-plans/${fallback}-${type}.png`, `./seating-plans/Default-open-${type}.png`];
  for (const src of candidates) {
    try {
      return await loadImage(src);
    } catch {
      continue;
    }
  }
  return null;
}

async function renderBlueprintSeatPlan(container, canvas, code) {
  container.querySelector(".outlet-pin-layer")?.remove();
  const blueprint = await loadBlueprint(code);
  const timeKey = currentBlueprintTimeKey(blueprint.timeKeys);
  const scaleX = 200;
  const scaleY = 150;
  const chairStatesBySeat = new Map();
  const tableHasOccupied = new Map();
  blueprint.chairs.forEach((item) => {
    const seat = String(item.seat).trim();
    const table = String(item.table).trim();
    const occupancy = blueprint.occupancyBySeat.get(seat);
    const occupied = isBlueprintOccupied(occupancy?.[timeKey]);
    chairStatesBySeat.set(seat, { occupied, table });
    if (occupied) tableHasOccupied.set(table, true);
  });
  const occupiedChairs = blueprint.chairs.filter((item) => chairStatesBySeat.get(String(item.seat).trim())?.occupied);
  const occupiedTables = blueprint.tables.filter((item) => tableHasOccupied.get(String(item.table).trim()));
  const chairs = blueprint.chairs.map((item) => {
      const seatState = chairStatesBySeat.get(String(item.seat).trim());
      const occupied = !!seatState?.occupied;
      const restricted = !occupied && !!tableHasOccupied.get(seatState?.table);
      const assetName = `${item.type}_${String(item.direction).padStart(2, "0")}`;
      return {
        kind: "chair",
        src: `${assetName}.png`,
        stateSrc: `${assetName}-${occupied ? "02" : restricted ? "01" : "00"}.png`,
        x: numberValue(item.pos_x) * scaleX,
        bottomY: numberValue(item.pos_y) * scaleY,
        sortY: numberValue(item.pos_y),
      };
    });
  const tables = blueprint.tables.map((item) => ({
      kind: "table",
      src: `${item.type}.png`,
      stateSrc: `${item.type}-${tableHasOccupied.get(String(item.table).trim()) ? "02" : "00"}.png`,
      x: numberValue(item.pos_x) * scaleX,
      bottomY: numberValue(item.pos_y) * scaleY,
      sortY: numberValue(item.pos_y),
    }));
  const outlets = blueprint.outlets.map((item) => ({
    kind: "outlet",
    src: "E1.png",
    stateSrc: `E1-${blueprintOutletState(item, occupiedChairs, occupiedTables, timeKey)}.png`,
    x: numberValue(item.pos_x) * scaleX,
    bottomY: numberValue(item.pos_y) * scaleY - 150,
    sortY: Number.POSITIVE_INFINITY,
  }));
  const availableSeats = [...chairStatesBySeat.values()].filter((item) => !item.occupied && !tableHasOccupied.get(item.table)).length;
  const canvasItems = [...chairs, ...tables];
  const all = [...canvasItems, ...outlets];
  const images = await Promise.all(all.flatMap((item) => [loadImage(`./objects/${item.stateSrc}`), loadImage(`./objects/${item.src}`)]));
  all.forEach((item, index) => {
    item.stateImage = images[index * 2];
    item.image = images[index * 2 + 1];
    item.width = Math.max(item.stateImage.width, item.image.width);
    item.height = Math.max(item.stateImage.height, item.image.height);
    item.y = item.bottomY - item.height;
  });
  const bounds = blueprintCanvasBounds(all);
  const offsetX = -bounds.minX;
  const offsetY = -bounds.minY;
  const width = Math.ceil(bounds.width);
  const height = Math.ceil(bounds.height);
  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.aspectRatio = `${width} / ${height}`;
  const context = canvas.getContext("2d");
  context.scale(ratio, ratio);
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  canvasItems
    .sort((a, b) => {
      if (a.sortY !== b.sortY) return a.sortY - b.sortY;
      if (a.kind !== b.kind) return a.kind === "chair" ? -1 : 1;
      return a.sortY - b.sortY;
    })
    .forEach((item) => {
      context.drawImage(item.stateImage, item.x + offsetX, item.y + offsetY);
      context.drawImage(item.image, item.x + offsetX, item.y + offsetY);
    });
  if (state.showOutlets) renderOutletPins(container, outlets, width, height, offsetX, offsetY);
  container.classList.add("ready");
  const loading = container.querySelector(".seat-plan-loading");
  if (loading) loading.textContent = availableSeats ? `자리가 ${availableSeats}석 남았어요` : "지금은 앉을 수 있는 자리가 없어요";
}

async function loadBlueprint(code) {
  if (blueprintCache[code]) return blueprintCache[code];
  const [chairsText, tablesText, outletsText, occupancyText] = await Promise.all([
    fetch(`./blueprint/${code}-C.csv`).then((response) => response.text()),
    fetch(`./blueprint/${code}-T.csv`).then((response) => response.text()),
    fetch(`./blueprint/${code}-E.csv`).then((response) => response.text()),
    fetch(`./blueprint/${code}-O.csv`).then((response) => response.text()),
  ]);
  const chairs = parseBlueprintCsv(chairsText);
  const tables = parseBlueprintCsv(tablesText);
  const outlets = parseBlueprintCsv(outletsText);
  const occupancy = parseBlueprintCsv(occupancyText, (row) => row.seat !== "");
  const occupancyBySeat = new Map(occupancy.map((row) => [String(row.seat).trim(), row]));
  const timeKeys = Object.keys(occupancy[0] || {}).filter((key) => /^\d{1,2}:\d{2}$/.test(key));
  blueprintCache[code] = { chairs, tables, outlets, occupancyBySeat, timeKeys };
  return blueprintCache[code];
}

function parseBlueprintCsv(text, keepRow = (row) => (row.type || row.Elec) && row.pos_x !== "" && row.pos_y !== "") {
  const lines = text.trim().split(/\r?\n/).map((line) => line.replace(/^\uFEFF/, ""));
  const headerIndex = lines.findIndex((line) => /^(seat|table|Elec),/.test(line));
  if (headerIndex < 0) return [];
  const headers = lines[headerIndex].split(",").map((item) => item.trim());
  return lines
    .slice(headerIndex + 1)
    .filter(Boolean)
    .map((line) => {
      const cells = line.split(",");
      return headers.reduce((row, header, index) => {
        row[header] = cells[index]?.trim() || "";
        return row;
      }, {});
    })
    .filter(keepRow);
}

function normalizeBlueprintOccupancy(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  const negativeMatch = text.match(/^\((.+)\)$/);
  if (negativeMatch) return `-${negativeMatch[1].trim()}`;
  return text;
}

function isBlueprintOccupied(value) {
  return normalizeBlueprintOccupancy(value) === "1";
}

function blueprintCanvasBounds(items) {
  const aspect = 4 / 3;
  let minX = Math.min(...items.map((item) => item.x), 0);
  let minY = Math.min(...items.map((item) => item.y), 0);
  let maxX = Math.max(...items.map((item) => item.x + item.width), 1);
  let maxY = Math.max(...items.map((item) => item.bottomY), 1);
  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;
  if (contentWidth / contentHeight > aspect) {
    const targetHeight = contentWidth / aspect;
    const extra = targetHeight - contentHeight;
    minY -= extra / 2;
    maxY += extra / 2;
  } else {
    const targetWidth = contentHeight * aspect;
    const extra = targetWidth - contentWidth;
    minX -= extra / 2;
    maxX += extra / 2;
  }
  return {
    minX,
    minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function blueprintOutletState(outlet, occupiedChairs, occupiedTables, timeKey) {
  const outletX = numberValue(outlet.pos_x);
  const outletY = numberValue(outlet.pos_y);
  const nearOccupiedTable = occupiedTables.some((table) => Math.abs(numberValue(table.pos_x) - outletX) <= 0.6 && Math.abs(numberValue(table.pos_y) - outletY) <= 0.6);
  const nearOccupiedChair = occupiedChairs.some((chair) => Math.abs(numberValue(chair.pos_x) - outletX) <= 1.1 && Math.abs(numberValue(chair.pos_y) - outletY) <= 1.1);
  if (!nearOccupiedTable && !nearOccupiedChair) return "00";
  return stablePercent(`${outlet.Elec || ""}-${timeKey}`) < 70 ? "02" : "01";
}

function stablePercent(seed) {
  let hash = 0;
  [...String(seed)].forEach((char) => {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  });
  return hash % 100;
}

function renderOutletPins(container, outlets, width, height, offsetX, offsetY) {
  const layer = document.createElement("div");
  layer.className = "outlet-pin-layer";
  outlets.forEach((item) => {
    const pin = document.createElement("span");
    pin.className = "outlet-pin";
    pin.style.left = `${((item.x + offsetX) / width) * 100}%`;
    pin.style.top = `${((item.y + offsetY) / height) * 100}%`;
    pin.style.width = `${(item.width / width) * 100}%`;
    pin.style.height = `${(item.height / height) * 100}%`;
    pin.innerHTML = `<img src="./objects/${item.stateSrc}" alt="" /><img src="./objects/${item.src}" alt="" />`;
    layer.appendChild(pin);
  });
  container.appendChild(layer);
}

function currentBlueprintTimeKey(timeKeys) {
  if (!timeKeys.length) return "";
  const minutes = simulationMinutes();
  const key = `${Math.floor(minutes / 60) % 24}:${String(minutes % 60).padStart(2, "0")}`;
  if (timeKeys.includes(key)) return key;
  return timeKeys.reduce((best, item) => Math.abs(timeLabelToMinutes(item) - minutes) < Math.abs(timeLabelToMinutes(best) - minutes) ? item : best, timeKeys[0]);
}

function seatingFallbackPrefix(lounge) {
  const text = `${lounge.raw?.default_type || ""} ${lounge.name || ""}`;
  return text.includes("계단") ? "Default-stairs" : "Default-open";
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.src = src;
  });
}

function detectBoxes(image) {
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const scratch = document.createElement("canvas");
  scratch.width = width;
  scratch.height = height;
  const context = scratch.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0);
  const data = context.getImageData(0, 0, width, height).data;
  const seen = new Uint8Array(width * height);
  const boxes = [];
  const active = (x, y) => {
    const offset = (y * width + x) * 4;
    const alpha = data[offset + 3];
    return alpha > 20;
  };
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const start = y * width + x;
      if (seen[start] || !active(x, y)) continue;
      const stack = [[x, y]];
      seen[start] = 1;
      let minX = x;
      let maxX = x;
      let minY = y;
      let maxY = y;
      let count = 0;
      while (stack.length) {
        const [cx, cy] = stack.pop();
        count += 1;
        minX = Math.min(minX, cx);
        maxX = Math.max(maxX, cx);
        minY = Math.min(minY, cy);
        maxY = Math.max(maxY, cy);
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
          const nx = cx + dx;
          const ny = cy + dy;
          const index = ny * width + nx;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height || seen[index] || !active(nx, ny)) return;
          seen[index] = 1;
          stack.push([nx, ny]);
        });
      }
      const w = maxX - minX + 1;
      const h = maxY - minY + 1;
      if (count > 12 && w > 3 && h > 3) boxes.push({ x: minX, y: minY, w, h, cx: minX + w / 2, cy: minY + h / 2 });
    }
  }
  return boxes.sort((a, b) => a.y - b.y || a.x - b.x);
}

function pseudoOccupancy(index, crowd) {
  const threshold = clamp(crowd / 100, 0.08, 0.92);
  const value = ((index * 37 + 23) % 100) / 100;
  if (value < threshold * 0.78) return "bad";
  if (value < threshold) return "warn";
  return "good";
}

function nearestBoxes(box, boxes, maxDistance) {
  return boxes.filter((item) => Math.hypot(item.cx - box.cx, item.cy - box.cy) <= maxDistance);
}

function aggregateState(boxes) {
  if (!boxes.length) return "good";
  if (boxes.some((box) => box.state === "bad")) return "bad";
  if (boxes.some((box) => box.state === "warn")) return "warn";
  return "good";
}

function seatSimulationFor(code, chairs, tables, outlets) {
  const lounge = seatSimulationData?.lounges?.[code];
  if (!lounge?.times) return null;
  const states = lounge.times[seatSimulationTimeKey(lounge.times)];
  if (!states) return null;
  const decoded = {
    chairs: decodeSeatSimulationStates(states.c || states.chairs),
    tables: decodeSeatSimulationStates(states.t || states.tables),
    outlets: decodeSeatSimulationStates(states.e || states.outlets),
  };
  if (decoded.chairs.length !== chairs.length || decoded.tables.length !== tables.length || decoded.outlets.length !== outlets.length) return null;
  return decoded;
}

function decodeSeatSimulationStates(value) {
  if (Array.isArray(value)) return value;
  const legend = seatSimulationData?.stateLegend || { g: "good", w: "warn", b: "bad" };
  return String(value || "").split("").map((item) => legend[item] || "good");
}

function seatSimulationTimeKey(times) {
  const now = new Date();
  const total = (Math.round((now.getHours() * 60 + now.getMinutes()) / 5) * 5) % (24 * 60);
  const key = `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  if (times[key]) return key;
  return Object.keys(times).reduce((best, item) => Math.abs(timeLabelToMinutes(item) - total) < Math.abs(timeLabelToMinutes(best) - total) ? item : best, Object.keys(times)[0]);
}

function timeLabelToMinutes(label) {
  const [hour, minute] = String(label).split(":").map(Number);
  return (Number.isFinite(hour) ? hour : 0) * 60 + (Number.isFinite(minute) ? minute : 0);
}

function tintLayer(targetContext, image, boxes, width, height, layerType) {
  const source = document.createElement("canvas");
  source.width = width;
  source.height = height;
  const sourceContext = source.getContext("2d", { willReadFrequently: true });
  sourceContext.drawImage(image, 0, 0);
  const imageData = sourceContext.getImageData(0, 0, width, height);
  const data = imageData.data;
  boxes.forEach((box) => {
    const [r, g, b] = hexToRgb(stateColor(box.state));
    for (let y = Math.max(0, box.y); y < Math.min(height, box.y + box.h); y += 1) {
      for (let x = Math.max(0, box.x); x < Math.min(width, box.x + box.w); x += 1) {
        const offset = (y * width + x) * 4;
        if (data[offset + 3] < 20) continue;
        data[offset] = r;
        data[offset + 1] = g;
        data[offset + 2] = b;
      }
    }
  });
  sourceContext.putImageData(imageData, 0, 0);
  targetContext.save();
  targetContext.shadowColor = {
    chair: "rgba(12, 12, 12, 0.18)",
    table: "rgba(12, 12, 12, 0.26)",
    outlet: "rgba(134, 38, 51, 0.34)",
  }[layerType] || "rgba(12, 12, 12, 0.22)";
  targetContext.shadowBlur = {
    chair: 4,
    table: 7,
    outlet: 9,
  }[layerType] || 6;
  targetContext.shadowOffsetY = {
    chair: 1,
    table: 2,
    outlet: 2,
  }[layerType] || 2;
  targetContext.drawImage(source, 0, 0);
  targetContext.restore();
}

function stateColor(state) {
  if (state === "bad") return "#ffb3ba";
  if (state === "warn") return "#ffffba";
  return "#baffc9";
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return [0, 2, 4].map((start) => parseInt(clean.slice(start, start + 2), 16));
}

function roundRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function renderTrend(lounge) {
  const crowdByTime = lounge.crowdByTime || [];
  const linePath = trendPath(crowdByTime);
  const current = currentTrendPoint(crowdByTime);
  const quietTime = quietestTime(lounge.crowdByTime || []);
  const quietDay = quietestDay(lounge.dayCrowd || []);
  const today = todayDayLabel();
  const relaxedDay = quietDay;
  return `
    <section class="panel trend-panel" data-toggle-trend>
      <div class="panel-title">
        <h2>시간대별 혼잡도</h2>
        <span>${state.trendOpen ? "접기" : "더보기"}</span>
      </div>
      <div class="line-chart">
        <div class="line-chart-plot">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="${linePath}" />
          </svg>
          <span class="current-trend-dot ${current.state}" style="left:${current.x}%; top:${current.y}%"></span>
        </div>
        <div class="line-chart-labels" style="--time-label-count:${timeLabelCount(crowdByTime)}">
          ${timeChartLabels(crowdByTime)}
        </div>
      </div>
      ${state.trendOpen ? `
        <div class="week-chart">
          ${weekChartItems(lounge.dayCrowd || [], today, relaxedDay)}
        </div>
        <p class="insight">이 라운지는 ${quietTime}에 비교적 여유롭고, ${quietDay}요일에 가장 여유로워요.</p>
      ` : ""}
    </section>
  `;
}

function trendPoints(crowdByTime) {
  const values = crowdByTime.length ? crowdByTime : [{ value: 50 }, { value: 50 }];
  const smoothedValues = smoothTrendValues(values.map((item) => item.value));
  const maxValue = Math.max(...smoothedValues, 100);
  return smoothedValues.map((value, index) => {
    const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100;
    const y = 100 - clamp((value / maxValue) * 100, 0, 100);
    return { x, y };
  });
}

function smoothTrendValues(values) {
  if (values.length < 5) return values;
  return values.map((_, index) => {
    const weighted = [
      [index - 2, 1],
      [index - 1, 2],
      [index, 3],
      [index + 1, 2],
      [index + 2, 1],
    ].reduce((acc, [sourceIndex, weight]) => {
      const safeIndex = clamp(sourceIndex, 0, values.length - 1);
      acc.sum += values[safeIndex] * weight;
      acc.weight += weight;
      return acc;
    }, { sum: 0, weight: 0 });
    return weighted.sum / weighted.weight;
  });
}

function trendPath(crowdByTime) {
  const points = trendPoints(crowdByTime);
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  const commands = [`M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`];
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] || points[index];
    const current = points[index];
    const next = points[index + 1];
    const afterNext = points[index + 2] || next;
    const cp1x = current.x + (next.x - previous.x) / 6;
    const cp1y = current.y + (next.y - previous.y) / 6;
    const cp2x = next.x - (afterNext.x - current.x) / 6;
    const cp2y = next.y - (afterNext.y - current.y) / 6;
    commands.push(`C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${next.x.toFixed(2)} ${next.y.toFixed(2)}`);
  }
  return commands.join(" ");
}

function timeChartLabels(crowdByTime) {
  return timeChartLabelItems(crowdByTime).map((item) => `<small>${formatHourNumber(item.time)}</small>`).join("");
}

function timeLabelCount(crowdByTime) {
  return timeChartLabelItems(crowdByTime).length || 2;
}

function timeChartLabelItems(crowdByTime) {
  const values = crowdByTime.length ? crowdByTime : [{ time: "8:30" }, { time: "22:30" }];
  return values.filter((item, index) => {
    const minutes = timeKeyToMinutes(item.time);
    return index === 0 || index === values.length - 1 || minutes % 60 === 0;
  });
}

function formatHourNumber(time) {
  const hour = Math.floor(timeKeyToMinutes(time) / 60);
  if (!Number.isFinite(hour)) return "";
  return String(hour % 12 || 12);
}

function currentTrendPoint(crowdByTime) {
  if (!crowdByTime.length) return { x: 50, y: 50 };
  const minutes = simulationMinutes();
  let nearestIndex = 0;
  crowdByTime.forEach((item, index) => {
    if (Math.abs(timeKeyToMinutes(item.time) - minutes) < Math.abs(timeKeyToMinutes(crowdByTime[nearestIndex].time) - minutes)) nearestIndex = index;
  });
  const smoothedValues = smoothTrendValues(crowdByTime.map((item) => item.value));
  const maxValue = Math.max(...smoothedValues, 100);
  return {
    x: crowdByTime.length === 1 ? 0 : (nearestIndex / (crowdByTime.length - 1)) * 100,
    y: 100 - clamp((smoothedValues[nearestIndex] / maxValue) * 100, 0, 100),
    state: crowdMetricFromScore(crowdScoreFromValue(crowdByTime[nearestIndex].value)).tone,
  };
}

function quietestTime(crowdByTime) {
  if (!crowdByTime.length) return "오전";
  const candidates = crowdByTime.filter((item) => {
    const minutes = timeKeyToMinutes(item.time);
    return minutes >= 10 * 60 + 30 && minutes <= 18 * 60 + 30;
  });
  const source = candidates.length ? candidates : crowdByTime;
  const item = source.reduce((best, current) => current.value < best.value ? current : best, source[0]);
  return formatTimeLabel(item.time);
}

function quietestDay(dayCrowd) {
  const weekdayCrowd = dayCrowd.filter((item) => ["월", "화", "수", "목"].includes(item.day));
  const source = weekdayCrowd.length ? weekdayCrowd : dayCrowd;
  if (!source.length) return "월";
  return source.reduce((best, current) => current.value < best.value ? current : best, source[0]).day;
}

function weekChartItems(dayCrowd, today, relaxedDay) {
  if (!dayCrowd.length) return "";
  const max = Math.max(...dayCrowd.map((item) => item.value), 1);
  const min = Math.min(...dayCrowd.map((item) => item.value));
  return dayCrowd.map((item) => {
    const normalized = max === min ? 0.65 : (item.value - min) / (max - min);
    const height = 22 + normalized * 78;
    const classes = [item.day === today ? "today" : "", item.day === relaxedDay ? "relaxed" : ""].filter(Boolean).join(" ");
    return `<div class="${classes}"><span style="height:${height}%"></span><small>${item.day}</small></div>`;
  }).join("");
}

function todayDayLabel() {
  return ["일", "월", "화", "수", "목", "금", "토"][new Date().getDay()];
}

function formatTimeLabel(time) {
  const minutes = timeKeyToMinutes(time);
  const hour = Math.floor(minutes / 60);
  const minute = String(minutes % 60).padStart(2, "0");
  const period = hour < 12 ? "오전" : "오후";
  const displayHour = hour % 12 || 12;
  return `${period} ${displayHour}:${minute}`;
}

function timeKeyToMinutes(time) {
  if (String(time).includes(":")) return timeLabelToMinutes(time);
  return Number(time.slice(0, 2)) * 60 + Number(time.slice(2));
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
          <h2>몇 명이 사용하나요?</h2>
          <div class="chip-grid">${partyOptions.map((item) => `<button class="chip ${state.selectedParty === item ? "selected" : ""}" data-party="${item}">${item}</button>`).join("")}</div>
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
  if (!state.currentUser) return renderGuestProfile();
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
        <p>${escapeHtml(state.profile.college)} ${escapeHtml(state.profile.department)}</p>
        ${state.profile.role === "admin" ? `<strong class="admin-badge">관리자</strong>` : ""}
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
      <button class="logout-text" data-logout>로그아웃</button>
      ${renderTabbar()}
    </section>
  `;
}

function renderGuestProfile() {
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
        <h1>아직 쿠룽지 친구가 아니에요</h1>
        <p>친구가 되면 프로필, 즐겨찾기, 프리셋을 저장할 수 있어요.</p>
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
  if (!state.currentUser && state.profilePage === "profile") return renderAuthRequiredProfile();
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

function renderAuthRequiredProfile() {
  return `
    <section class="screen profile-subscreen">
      <header class="plain-header">
        <button class="icon-btn" data-profile-back aria-label="뒤로가기">${icon("back")}</button>
        <h1>프로필 관리</h1>
        <span></span>
      </header>
      <div class="auth-required-card">
        <h2>쿠룽지 친구가 되어야 해요</h2>
        <p>프로필 정보와 저장한 설정은 친구 계정에 보관됩니다.</p>
        <button class="auth-primary" data-auth-route="signup">쿠룽지 친구 되기</button>
      </div>
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
  const collegeOptions = colleges();
  const college = state.profile.college || collegeOptions[0] || "";
  const majorOptions = majorsForCollege(college);
  const department = majorOptions.includes(state.profile.department) ? state.profile.department : majorOptions[0] || state.profile.department;
  return `
    <section class="subpage-stack">
      <div class="profile-edit-card">
        ${profilePhoto("edit-avatar")}
        <button class="profile-photo-button" data-profile-photo>프로필 변경</button>
        <input class="visually-hidden" type="file" accept="image/*" data-profile-photo-input />
        <label>사용자 이름<input data-profile-field="name" value="${escapeHtml(state.profile.name)}" /></label>
        <label>소속대학<select data-profile-field="college">${collegeOptions.map((item) => `<option ${college === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select></label>
        <label>학과<select data-profile-field="department">${majorOptions.map((item) => `<option ${department === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select></label>
        <p class="account-note">즐겨찾기와 프리셋은 이 계정에 자동 저장됩니다.</p>
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
      <div class="bgm-row">
        <span>BGM: 장예림 - 가마솥에 누룽지 (Prod. 박상문)</span>
        <button data-toggle-mascot-bgm>${state.mascotBgmPlaying ? "일시정지" : "재생"}</button>
      </div>
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

function manageMascotBgm() {
  const active = state.route === "profile" && state.profilePage === "about";
  if (!mascotAudio) {
    mascotAudio = new Audio("./gamasot_nurungji.mp3");
    mascotAudio.loop = true;
  }
  if (active && state.mascotBgmPlaying) {
    mascotAudio.play().catch(() => {});
    return;
  }
  mascotAudio.pause();
  if (!active) mascotAudio.currentTime = 0;
}

function renderModal() {
  if (!state.modal) return "";
  if (state.modal === "seatPlan") {
    const lounge = getSelectedLounge();
    return `
      <div class="modal-backdrop">
        <div class="modal-card seat-plan-modal">
          <div class="modal-title-row">
            <h2>${lounge.name} 좌석도</h2>
            <button class="icon-btn" data-close-modal aria-label="닫기">${icon("plus")}</button>
          </div>
          <div class="seat-plan enlarged" data-seating-plan="${lounge.code}" data-crowd="${lounge.currentCrowd}">
            <canvas aria-label="${lounge.name} 확대 좌석도"></canvas>
            <div class="seat-plan-loading">좌석도를 불러오는 중이에요</div>
          </div>
          <div class="legend"><span class="good"></span> 사용 가능 <span class="warn"></span> 제한 <span class="bad"></span> 사용 중</div>
          <p class="seat-plan-note">일부 의자와 테이블은 비어있더라도 사용이 제한될 수 있어요.</p>
        </div>
      </div>
    `;
  }
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

function updateHomeSearchResults() {
  const title = document.querySelector("[data-home-summary]");
  const list = document.querySelector("[data-lounge-list]");
  if (!title || !list) return;
  const query = state.loungeSearch.trim().toLowerCase();
  let visibleCount = 0;
  title.textContent = summaryTitle();
  list.querySelectorAll("[data-lounge-card-name]").forEach((card) => {
    const visible = !query || card.dataset.loungeCardName.includes(query);
    card.hidden = !visible;
    card.style.display = visible ? "" : "none";
    if (visible) visibleCount += 1;
  });
  const empty = list.querySelector("[data-search-empty]");
  if (empty) empty.hidden = visibleCount > 0;
}

function bindLoungeListEvents(root = document) {
  root.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      state.route = button.dataset.route;
      state.activeMetric = null;
      render();
    });
  });
  root.querySelectorAll("[data-open-lounge]").forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedLoungeId = card.dataset.openLounge;
      state.route = "detail";
      render();
    });
  });
  root.querySelectorAll("[data-favorite]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = button.dataset.favorite;
      state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
      persistCurrentUser();
      render();
    });
  });
}

function bindEvents() {
  document.querySelector("[data-simulation-time]")?.addEventListener("change", (event) => {
    state.simulationTime = event.currentTarget.value;
    render();
  });
  document.querySelector("[data-toggle-outlets]")?.addEventListener("change", (event) => {
    state.showOutlets = event.currentTarget.checked;
    render();
  });
  document.querySelector("[data-lounge-search]")?.addEventListener("input", (event) => {
    state.loungeSearchDraft = event.currentTarget.value;
  });
  document.querySelector("[data-lounge-search]")?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.isComposing) return;
    event.preventDefault();
    state.loungeSearch = event.currentTarget.value.trim();
    state.loungeSearchDraft = event.currentTarget.value;
    updateHomeSearchResults();
    event.currentTarget.blur();
  });
  document.querySelectorAll("[data-auth-route]").forEach((button) => {
    button.addEventListener("click", () => {
      state.route = button.dataset.authRoute;
      state.authError = "";
      state.authDraft = { nickname: "", password: "" };
      render();
    });
  });
  document.querySelector("[data-guest-start]")?.addEventListener("click", () => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_GUEST_KEY);
    state.isGuest = true;
    state.currentUser = null;
    state.route = "guestConfirm";
    render();
  });
  document.querySelector("[data-guest-confirm]")?.addEventListener("click", () => {
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_GUEST_KEY);
    state.isGuest = true;
    state.currentUser = null;
    state.route = "restricted";
    render();
  });
  document.querySelector("[data-logout]")?.addEventListener("click", async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(AUTH_GUEST_KEY);
    state.currentUser = null;
    state.isGuest = false;
    state.profilePage = "";
    state.profile = {
      name: "",
      college: colleges()[0] || "",
      department: majorsForCollege(colleges()[0] || "")[0] || "",
      saved: false,
      photo: "",
      role: "user",
    };
    state.favorites = new Set(defaultFavorites);
    state.presets = [...defaultPresets];
    state.route = "welcome";
    render();
  });
  document.querySelector("[data-toggle-auth-password]")?.addEventListener("click", () => {
    state.authPasswordVisible = !state.authPasswordVisible;
    render();
  });
  document.querySelectorAll("[data-auth-draft]").forEach((field) => {
    field.addEventListener("input", () => {
      state.authDraft[field.dataset.authDraft] = field.value;
    });
  });
  document.querySelector("[data-auth-college]")?.addEventListener("change", (event) => {
    state.profile.college = event.currentTarget.value;
    state.profile.department = majorsForCollege(state.profile.college)[0] || "";
    render();
  });
  document.querySelector("[data-auth-photo]")?.addEventListener("click", () => {
    document.querySelector("[data-auth-photo-input]")?.click();
  });
  document.querySelector("[data-auth-photo-input]")?.addEventListener("change", (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      state.profile.photo = reader.result;
      render();
    });
    reader.readAsDataURL(file);
  });
  document.querySelector("[data-signup-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nickname = form.get("nickname")?.toString().trim();
    const password = form.get("password")?.toString();
    const college = form.get("college")?.toString();
    const department = form.get("department")?.toString();
    if (!nickname || !password || !college || !department) {
      state.authError = "모든 항목을 입력해주세요.";
      render();
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: nicknameToAuthEmail(nickname),
      password,
      options: {
        data: { nickname },
      },
    });
    if (error) {
      state.authError = authErrorMessage(error);
      render();
      return;
    }
    if (!data.session) {
      state.authError = "Supabase에서 로그인 세션을 만들지 못했습니다. 새로고침 후 로그인으로 다시 들어와주세요.";
      render();
      return;
    }
    state.authDraft = { nickname: "", password: "" };
    const user = {
      nickname,
      passwordHash: await passwordHash(password),
      role: adminNicknames.includes(nickname) ? "admin" : "user",
      profile: { name: nickname, college, department, photo: state.profile.photo, saved: false, role: adminNicknames.includes(nickname) ? "admin" : "user" },
      favorites: [...state.favorites],
      presets: state.presets,
    };
    const users = readUsers();
    users[nickname] = user;
    writeUsers(users);
    localStorage.setItem(AUTH_SESSION_KEY, nickname);
    localStorage.removeItem(AUTH_GUEST_KEY);
    applyUser(user);
    await syncSupabaseUserData();
    state.route = "home";
    state.authError = "";
    render();
  });
  document.querySelector("[data-login-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nickname = form.get("nickname")?.toString().trim();
    const password = form.get("password")?.toString();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: nicknameToAuthEmail(nickname || ""),
      password: password || "",
    });
    if (error || !data.user) {
      const localUser = readUsers()[nickname];
      const localPasswordOk = localUser?.passwordHash === await passwordHash(password || "");
      if (localPasswordOk) {
        const recovered = await supabase.auth.signUp({
          email: nicknameToAuthEmail(nickname),
          password,
          options: { data: { nickname } },
        });
        if (recovered.error || !recovered.data.session) {
          state.authError = authErrorMessage(recovered.error) || "기존 기기 계정을 Supabase에 연결하지 못했습니다.";
          render();
          return;
        }
        applyUser(localUser);
        await syncSupabaseUserData();
        await finishSupabaseLogin(recovered.data.user, nickname);
        state.authDraft = { nickname: "", password: "" };
        render();
        return;
      }
      state.authError = authErrorMessage(error);
      render();
      return;
    }
    state.authDraft = { nickname: "", password: "" };
    await finishSupabaseLogin(data.user, nickname);
    render();
  });
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
      persistCurrentUser();
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
  document.querySelector("[data-toggle-mascot-bgm]")?.addEventListener("click", () => {
    state.mascotBgmPlaying = !state.mascotBgmPlaying;
    render();
  });
  document.querySelectorAll("[data-party]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedParty = state.selectedParty === button.dataset.party ? "" : button.dataset.party;
      render();
    });
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
      if (field.dataset.profileField === "college") {
        const majors = majorsForCollege(state.profile.college);
        if (!majors.includes(state.profile.department)) state.profile.department = majors[0] || "";
      }
      state.profile.saved = true;
      persistCurrentUser();
      render();
    };
    field.addEventListener("input", () => {
      state.profile[field.dataset.profileField] = field.value;
      state.profile.saved = true;
      persistCurrentUser();
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
      persistCurrentUser();
      render();
    });
    reader.readAsDataURL(file);
  });
  document.querySelector("[data-reset-filters]")?.addEventListener("click", () => {
    state.selectedPurpose = [];
    state.selectedParty = "";
    state.selectedFeatures = [];
    state.loungeSearch = "";
    state.loungeSearchDraft = "";
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
  document.querySelectorAll("[data-open-seat-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      state.modal = "seatPlan";
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
      state.presets.push({ name, purpose: [...state.selectedPurpose], party: state.selectedParty, features: [...state.selectedFeatures], campus: state.selectedCampus, buildings: [...state.selectedBuildings], departureMode: state.departureMode });
      persistCurrentUser();
    }
    state.modal = null;
    render();
  });
  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = state.presets[Number(button.dataset.preset)];
      Object.assign(state, {
        selectedPurpose: [...preset.purpose],
        selectedParty: preset.party || "",
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
  if (type === "purpose") {
    if (state.selectedPurpose.includes(value)) {
      state.selectedPurpose = [];
    } else {
      state.selectedPurpose = [value];
      applyPurposeFilters(value);
    }
    render();
    return;
  }
  const listMap = {
    feature: "selectedFeatures",
    building: "selectedBuildings",
  };
  const key = listMap[type];
  if (!key) return;
  state[key] = state[key].includes(value) ? state[key].filter((item) => item !== value) : [...state[key], value];
  render();
}

function applyPurposeFilters(purpose) {
  const filters = purposeFilterMap[purpose];
  if (!filters) return;
  state.selectedParty = filters.party || "";
  state.selectedFeatures = [...new Set(filters.features)];
}

async function loadCollegeMajorData() {
  try {
    const response = await fetch("./college-major.csv");
    const text = await response.text();
    collegeMajorData = parseCollegeMajorCsv(text);
    if (!state.profile.college && colleges()[0]) state.profile.college = colleges()[0];
    if (!state.profile.department && majorsForCollege(state.profile.college)[0]) state.profile.department = majorsForCollege(state.profile.college)[0];
    render();
  } catch {
    collegeMajorData = [
      { college: "문과대학", major: "국어국문학과" },
      { college: "경영대학", major: "경영학과" },
      { college: "공과대학", major: "컴퓨터학과" },
    ];
  }
}

function parseCollegeMajorCsv(text) {
  return text.trim().split(/\r?\n/).slice(1).map((line) => {
    const [college, major] = line.replace(/^\uFEFF/, "").split(",");
    return { college: college?.trim(), major: major?.trim() };
  }).filter((item) => item.college && item.major);
}

async function loadSeatSimulationData() {
  try {
    const response = await fetch("./seat-simulation.json");
    seatSimulationData = await response.json();
  } catch {
    seatSimulationData = null;
  }
}

async function loadStaticSeatOccupancyData() {
  try {
    const response = await fetch("./seat-occupancy-static.json");
    staticSeatOccupancyData = await response.json();
  } catch {
    staticSeatOccupancyData = null;
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js?v=74").catch(() => {}));
}

async function boot() {
  await Promise.all([loadCollegeMajorData(), loadSeatSimulationData(), loadStaticSeatOccupancyData()]);
  await restoreSupabaseSession();
  render();
}

boot();
