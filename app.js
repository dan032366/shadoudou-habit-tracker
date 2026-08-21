'use strict';

/* ============ 数据存储 ============ */
const STORAGE_KEY = 'habit-tracker.v1';

/* ============ 古风图标 ============ */
const GU_FENG_ICONS = {
  tea: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h11v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9z"/><path d="M15 10h1.6a1.6 1.6 0 0 1 0 3.2H15"/><path d="M6.5 6.5V5M9.5 6.5V5"/></svg>',
  scroll: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5.5C6 4.5 8.5 4.5 10.5 5.5v13C8.5 17.5 6 17.5 4 18.5v-13z"/><path d="M19.5 5.5C17.5 4.5 15 4.5 13 5.5v13c2-1 4.5-1 6.5 0v-13z"/></svg>',
  brush: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 4l2 2-8.5 8.5L9 13l1-2L18 4z"/><path d="M6 17.5C7 16.5 8 16 9 16c0 1-.5 2-1.5 3"/></svg>',
  run: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.2" r="1.8"/><path d="M11 6.5L9 11.5l3 1.5-1.5 6"/><path d="M11.5 7l3.5 1.5-1 3.5"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13.5A8 8 0 1 1 10.5 4 6.5 6.5 0 0 0 20 13.5z"/></svg>',
  lotus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20c-3.5-1.5-6-5-6.5-9.5 4.5-.5 6.5 4 6.5 9.5z"/><path d="M12 20c3.5-1.5 6-5 6.5-9.5C14 10 12 14.5 12 20z"/><path d="M12 20c0-5-2-8.5-6-10.5"/><path d="M12 20c0-5 2-8.5 6-10.5"/></svg>',
  bamboo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18"/><path d="M12 7c2.5-.5 4.5-2 5-4-2.5.5-4.5 2-5 4z"/><path d="M12 14c-2.5.5-4.5 2-5 4 2.5-.5 4.5-2 5-4z"/></svg>',
  mountain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 18L10 7.5l4.5 6 2-3L20.5 18h-17z"/><path d="M10 18l2.5-3.5"/></svg>',
  lantern: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 4h7l-.8 2.5h-5.4L8.5 4z"/><path d="M8 6.5h8l-.8 10H8.8L8 6.5z"/><path d="M9.2 16.5h5.6"/><path d="M10.5 16.5V19M13.5 16.5V19"/></svg>',
  boat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14h16c.8 0 1.2 1 .6 1.6L19 17H5l-1.6-1.4C2.8 15 3.2 14 4 14z"/><path d="M12 8v6"/><path d="M12 8l4.5 3H12z"/><path d="M6 20c4 1 8 1 12 0"/></svg>',
  bow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4.5c-1.8 4.8-1.8 10.2 0 15"/><path d="M7 12h10.5"/><path d="M17.5 12l-3-3M17.5 12l-3 3"/></svg>',
  chess: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="9" r="2.2"/><circle cx="15" cy="15" r="2.2"/><path d="M5.5 12h13M12 5.5v13"/></svg>',
  sunrise: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17.5h18"/><path d="M12 5.5v2"/><path d="M7 12.5a5 5 0 0 1 10 0"/><path d="M4.5 11l1.3 1.3M19.5 11l-1.3 1.3"/></svg>',
  incense: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v10"/><path d="M8 18h8"/><path d="M10.5 3.5c-1.5 0-1.5 2-3 2M13.5 3.5c1.5 0 1.5 2 3 2"/></svg>',
  qin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h16l-1.5 8h-13L4 8z"/><path d="M6.5 8v8M12 8v8M17.5 8v8"/><path d="M5.5 12h13"/></svg>',
  taiji: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17 4.25 4.25 0 0 0 0-8.5 4.25 4.25 0 0 1 0-8.5z"/><circle cx="12" cy="7.75" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="16.25" r="1.3" fill="currentColor" stroke="none"/></svg>',
  flower: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="5.5" r="2.5"/><path d="M12 8v7"/><path d="M12 10.5c-2.5 0-3.5 1.5-4 3"/><path d="M12 10.5c2.5 0 3.5 1.5 4 3"/><path d="M8.5 15h7l-.8 3h-5.4l-.8-3z"/></svg>',
  broom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18.5 3.5L11 11"/><path d="M6.5 17c1.5-2 3-2.5 4.5-2.5"/><path d="M7.5 18.5c1.2-1.8 2.8-2.4 4-2.5"/><path d="M8.8 19.8c1-1.6 2.2-2.2 3.2-2.4"/></svg>',
  abacus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="1"/><path d="M8 7v10M12 7v10M16 7v10"/><circle cx="10" cy="9.5" r="1.2"/><circle cx="14" cy="9.5" r="1.2"/><circle cx="12" cy="14.5" r="1.2"/></svg>',
  well: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10l-1 3H8L7 4z"/><path d="M8 7v12M16 7v12"/><path d="M12 7v6"/><path d="M10 13h4l-.8 4h-2.4L10 13z"/><path d="M7 19h10"/></svg>',
  cuju: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="6.5"/><path d="M12 5.5v13M5.5 12h13"/><circle cx="12" cy="12" r="1.2"/></svg>',
  gourd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 6.5h5"/><circle cx="12" cy="5" r="2.2"/><path d="M9.8 7.2c-.2 2.8-3.3 3.8-3.3 7a5.5 5.5 0 0 0 11 0c0-3.2-3.1-4.2-3.3-7"/></svg>',
  mirror: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="7.5" r="4.8"/><path d="M10.2 11.8L9 19.5h6l-1.2-7.7"/><path d="M10.6 15.5h2.8"/></svg>',
  ding: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16l-1.8 10.5H5.8L4 9z"/><path d="M12 4v5"/><path d="M9 4h6"/><path d="M5.5 12h13"/></svg>'
};

const ICON_PRESETS = [
  ['tea', '品茶'], ['scroll', '书卷'], ['brush', '笔墨'], ['run', '行武'],
  ['moon', '安眠'], ['lotus', '清荷'], ['bamboo', '修竹'], ['mountain', '登山'],
  ['lantern', '灯笼'], ['boat', '行舟'], ['bow', '弓射'], ['chess', '对弈'],
  ['sunrise', '晨光'], ['incense', '焚香'], ['qin', '抚琴'], ['taiji', '太极'],
  ['flower', '莳花'], ['broom', '扫洒'], ['abacus', '记账'], ['well', '汲水'],
  ['cuju', '蹴鞠'], ['gourd', '葫芦'], ['mirror', '梳妆'], ['ding', '烹食']
];

const EMOJI_TO_SVG = {
  '💧': 'tea', '🏃': 'run', '📖': 'scroll', '💪': 'run',
  '😴': 'moon', '🧘': 'lotus', '🥗': 'bamboo', '✍️': 'brush',
  '🌅': 'sunrise', '🕯️': 'incense', '🎵': 'qin', '⚽': 'cuju',
  '🧮': 'abacus', '🪞': 'mirror', '🍲': 'ding', '💊': 'gourd'
};

let pendingIcon = { type: 'svg', value: 'tea' };

function defaultData() {
  return { habits: [], records: {} };
}

function loadLocalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.habits) ||
        !parsed.records || typeof parsed.records !== 'object') {
      throw new Error('bad data shape');
    }
    return migrateData(parsed);
  } catch (err) {
    console.warn('本地数据损坏，已重置', err);
    localStorage.removeItem(STORAGE_KEY);
    return defaultData();
  }
}

function migrateData(parsed) {
  parsed.habits.forEach(h => {
    if (!h.icon) {
      const key = EMOJI_TO_SVG[h.emoji];
      h.icon = key ? { type: 'svg', value: key } : { type: 'emoji', value: h.emoji || '✅' };
    }
  });
  return parsed;
}

let data = loadLocalData();
const IS_EXE = !!document.querySelector('meta[name="shadoudou-exe"]');
let selectedDateKey = todayKey();
let viewYear = new Date().getFullYear();
let viewMonth = new Date().getMonth(); // 0-11
let editingId = null;
let draggedId = null;

function saveData() {
  const json = JSON.stringify(data);
  let localOk = false;
  try {
    localStorage.setItem(STORAGE_KEY, json);
    localOk = true;
  } catch (err) {
    console.error('本地保存失败', err);
  }
  if (IS_EXE) {
    try {
      fetch('/api/storage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: json
      })
        .then(r => saveStatus(r.ok ? 'saved' : 'error'))
        .catch(() => saveStatus('error'));
    } catch (err) {
      saveStatus('error');
    }
    return;
  }
  if (localOk) {
    saveStatus('saved');
  } else {
    saveStatus('error');
  }
}

const SAVE_HEART_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20c-5.2-3.1-8-6.3-8-10a4.5 4.5 0 0 1 8-3 4.5 4.5 0 0 1 8 3c0 3.7-2.8 6.9-8 10z"/></svg>';

function saveStatus(state) {
  const el = document.getElementById('save-status');
  if (!el) return;
  if (state === 'error') {
    el.textContent = '保存失败';
  } else if (state === 'saved') {
    el.innerHTML = '保存成功，爱你呦<span class="save-heart">' + SAVE_HEART_SVG + '</span>'
      + '<span class="save-time">' + nowText() + '</span>';
  } else {
    el.innerHTML = '爱你呦<span class="save-heart">' + SAVE_HEART_SVG + '</span>';
  }
  el.classList.toggle('save-error', state === 'error');
}

function nowText() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
}

async function syncFromExeStorage() {
  try {
    const resp = await fetch('/api/storage', { cache: 'no-store' });
    if (!resp.ok) return;
    const parsed = await resp.json();
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.habits) ||
        !parsed.records || typeof parsed.records !== 'object') {
      return;
    }
    const next = migrateData(parsed);
    if (JSON.stringify(next) !== JSON.stringify(data)) {
      data = next;
      renderAll();
    }
  } catch (err) {
    // 非 exe 环境（浏览器直接打开）没有该接口，忽略
  }
}

window.addEventListener('pagehide', () => {
  if (!data || !IS_EXE) return;
  try {
    navigator.sendBeacon('/api/storage', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  } catch (err) { }
});

/* ============ 日期工具 ============ */
function pad2(n) { return String(n).padStart(2, '0'); }

function toKey(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function fromKey(key) {
  const [y, m, dd] = key.split('-').map(Number);
  return new Date(y, m - 1, dd);
}

function todayKey() { return toKey(new Date()); }

function weekdayCn(key) {
  return '星期' + '日一二三四五六'[fromKey(key).getDay()];
}

function fmt(n) {
  if (n == null || !Number.isFinite(n)) return '0';
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}

/* ============ 项目管理 ============ */
function newId() {
  if (window.crypto && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function activeHabits() {
  return data.habits.filter(h => !h.deletedAt);
}

function requiredHabitsForDay(key) {
  return data.habits.filter(h => {
    if (h.createdAt > key) return false;
    if (h.deletedAt != null && h.deletedAt <= key) return false;
    if (h.totalDays) {
      const end = habitActiveThrough(h);
      if (key > end) return false;
    }
    return true;
  });
}

function habitActiveThrough(h) {
  if (!h.totalDays) return null;
  const d = fromKey(h.createdAt);
  d.setDate(d.getDate() + h.totalDays - 1);
  return toKey(d);
}

function addHabit({ name, unit, target, icon, totalDays }) {
  data.habits.push({
    id: newId(),
    name,
    unit,
    target: Number(target),
    icon: icon || { type: 'svg', value: 'tea' },
    totalDays: totalDays || null,
    createdAt: selectedDateKey,
    deletedAt: null
  });
  saveData();
}

function habitDoneDays(h, asOfKey) {
  let count = 0;
  const today = todayKey();
  const cap = asOfKey && asOfKey < today ? asOfKey : today;
  for (const key in data.records) {
    if (key < h.createdAt || key > cap) continue;
    const rec = data.records[key][h.id];
    if (rec && rec.done) count++;
  }
  return count;
}

function iconOf(h) {
  return h.icon || { type: 'emoji', value: h.emoji || '✅' };
}

function iconContent(icon) {
  if (icon && icon.type === 'svg') {
    return { html: true, text: GU_FENG_ICONS[icon.value] || GU_FENG_ICONS.scroll };
  }
  if (icon && icon.type === 'image') {
    return { html: true, text: '<img class="habit-icon-img" src="' + icon.value + '" alt="">' };
  }
  return { html: false, text: (icon && icon.value) || '✅' };
}

function updateHabit(id, patch) {
  const h = data.habits.find(x => x.id === id);
  if (h) Object.assign(h, patch);
  saveData();
}

function deleteHabit(id) {
  const h = data.habits.find(x => x.id === id);
  if (h) {
    h.deletedAt = todayKey();
    saveData();
  }
}

function reorderHabits(orderedIds) {
  const active = data.habits.filter(h => !h.deletedAt);
  const deleted = data.habits.filter(h => h.deletedAt);
  const byId = new Map(active.map(h => [h.id, h]));
  data.habits = orderedIds.map(id => byId.get(id)).filter(Boolean).concat(deleted);
  saveData();
}

/* ============ 记录与统计 ============ */
function dayRecord(key) {
  if (!data.records[key]) data.records[key] = {};
  return data.records[key];
}

function setActual(key, habitId, actual) {
  const rec = dayRecord(key);
  if (!rec[habitId]) rec[habitId] = { actual: null, done: false };
  rec[habitId].actual = actual;
  const h = data.habits.find(x => x.id === habitId);
  if (h) rec[habitId].done = actual != null && actual >= h.target;
  saveData();
}

function toggleDone(key, habitId) {
  const rec = dayRecord(key);
  if (!rec[habitId]) rec[habitId] = { actual: null, done: false };
  rec[habitId].done = !rec[habitId].done;
  const h = data.habits.find(x => x.id === habitId);
  if (rec[habitId].done) {
    if (h && (rec[habitId].actual == null || rec[habitId].actual < h.target)) {
      rec[habitId].actual = h.target;
    }
  } else {
    rec[habitId].actual = null;
  }
  saveData();
}

function dayStats(key) {
  const req = requiredHabitsForDay(key);
  const recs = data.records[key] || {};
  const done = req.filter(h => recs[h.id] && recs[h.id].done).length;
  return { total: req.length, done, rate: req.length ? done / req.length : 0 };
}

/* ============ 评价 ============ */
const DAILY_EVAL = {
  full: [
    '全勤达成，太棒了 (´▽｀)',
    '全部完成，简直完美 (◕‿◕)',
    '满分收工，元气满满 (๑˃ᴗ˂)ﻭ'
  ],
  near: [
    '差一点就全勤，明天继续 (´ω｀)',
    '完成度很高，坚持就是满分 (◠‿◠)',
    '离全勤只差一步，真棒 (￣︶￣)'
  ],
  half: [
    '完成过半，势头很好 (๑˃ᴗ˂)',
    '过半啦，继续保持 (´▽｀)',
    '今天不错，再接再厉 (◕‿◕)'
  ],
  low: [
    '起步慢没关系，完成一点算一点 (´-ω-`)',
    '万事开头难，迈出第一步就是胜利 (￣︶￣)',
    '完成不多，但每份坚持都算数 (´ω｀)'
  ],
  zero: [
    '万事开头难，先定个小目标 (◠‿◠)',
    '还没开始？随时可以出发 (´▽｀)',
    '休息一下，明天重新出发 (˘ω˘)'
  ]
};

const MONTH_EVAL = {
  great: [
    '本月表现太出色了 (´▽｀)',
    '坚持得真好，打卡达人 (◕‿◕)'
  ],
  good: [
    '本月完成度不错，继续保持 (￣︶￣)',
    '稳扎稳打，做得真棒 (๑˃ᴗ˂)'
  ],
  ok: [
    '还有提升空间，坚持就是胜利 (◠‿◠)',
    '虽有起伏，但每一步都算数 (´ω｀)'
  ],
  low: [
    '本月不容易，下个月重新出发 (´-ω-`)',
    '完成不多没关系，慢慢来 (˘ω˘)'
  ]
};

function hashKey(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pickStable(arr, key) {
  return arr[hashKey(key) % arr.length];
}

function dailyEval(key) {
  const s = dayStats(key);
  if (s.total === 0) return null;
  if (s.rate === 1) return pickStable(DAILY_EVAL.full, key);
  if (s.rate >= 0.8) return pickStable(DAILY_EVAL.near, key);
  if (s.rate >= 0.5) return pickStable(DAILY_EVAL.half, key);
  if (s.rate > 0) return pickStable(DAILY_EVAL.low, key);
  return pickStable(DAILY_EVAL.zero, key);
}

function monthStats(year, month0) {
  const daysInMonth = new Date(year, month0 + 1, 0).getDate();
  const today = todayKey();
  let planDays = 0;
  let fullDays = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${pad2(month0 + 1)}-${pad2(d)}`;
    if (key > today) continue;
    const s = dayStats(key);
    if (s.total > 0) {
      planDays += 1;
      if (s.done === s.total) fullDays += 1;
    }
  }
  if (planDays === 0) return null;
  let best = 0;
  let cur = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${pad2(month0 + 1)}-${pad2(d)}`;
    if (key > today) continue;
    const s = dayStats(key);
    if (s.total > 0) {
      cur = s.done === s.total ? cur + 1 : 0;
      if (cur > best) best = cur;
    }
  }
  return { rate: planDays > 0 ? fullDays / planDays : 0, fullDays, bestStreak: best };
}

function monthEvalText(stats, year, month0) {
  const key = `${year}-${month0 + 1}`;
  const pct = Math.round(stats.rate * 100);
  let bucket = 'low';
  if (pct >= 90) bucket = 'great';
  else if (pct >= 60) bucket = 'good';
  else if (pct >= 30) bucket = 'ok';
  return { pct, text: pickStable(MONTH_EVAL[bucket], key) };
}

/* ============ DOM 工具 ============ */
function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

function iconBtn(label, title, extraCls, onClick) {
  const b = el('button', 'icon-btn' + (extraCls ? ' ' + extraCls : ''), label);
  b.type = 'button';
  b.title = title;
  b.setAttribute('aria-label', title);
  b.addEventListener('click', onClick);
  return b;
}

function evalClass(pct) {
  return pct === 100 ? ' praise' : (pct >= 60 ? ' good' : '');
}

/* ============ 渲染：今日摘要 ============ */
function renderToday() {
  const s = dayStats(todayKey());
  const countEl = document.getElementById('today-count');
  const barEl = document.getElementById('today-bar');
  const rateEl = document.getElementById('today-rate');
  const evalEl = document.getElementById('today-eval');
  if (s.total === 0) {
    countEl.textContent = '—';
    barEl.style.width = '0%';
    rateEl.textContent = activeHabits().length === 0 ? '新增项目后开始打卡吧' : '今天还没有需要打卡的项目';
    evalEl.textContent = '';
    evalEl.className = 'eval-text';
    return;
  }
  const pct = Math.round((s.done / s.total) * 100);
  countEl.textContent = `${s.done} / ${s.total}`;
  barEl.style.width = `${pct}%`;
  rateEl.textContent = `今日完成率 ${pct}%`;
  const ev = dailyEval(todayKey());
  evalEl.textContent = ev || '';
  evalEl.className = 'eval-text' + evalClass(pct);
}

/* ============ 渲染：每日打卡 ============ */
function renderDay() {
  const key = selectedDateKey;
  const isToday = key === todayKey();
  const isFuture = key > todayKey();
  const titleEl = document.getElementById('day-title');
  const subEl = document.getElementById('day-subtitle');
  const listEl = document.getElementById('habit-list');
  const emptyEl = document.getElementById('empty-habits');

  const d = fromKey(key);
  const isPast = key < todayKey();
  titleEl.textContent = isToday ? '今天' : `${d.getMonth() + 1}月${d.getDate()}日`;
  subEl.textContent = weekdayCn(key) +
    (isFuture ? ' · 未来日期（可删除预添加的项目）' : (isPast ? ' · 过去日期（可补记，不可新增项目）' : ''));
  document.getElementById('go-today-btn').classList.toggle('hidden', isToday);
  const addBtn = document.getElementById('add-habit-btn');
  const emptyAddBtn = document.getElementById('empty-add-btn');
  addBtn.disabled = isPast;
  emptyAddBtn.disabled = isPast;
  addBtn.title = isPast ? '不能在过去的日期新增项目' : '';
  emptyAddBtn.title = isPast ? '不能在过去的日期新增项目' : '';

  const s = dayStats(key);
  if (s.total === 0) {
    renderDaySummary();
    listEl.innerHTML = '';
    emptyEl.classList.toggle('hidden', activeHabits().length > 0);
    return;
  }

  emptyEl.classList.add('hidden');
  renderDaySummary();

  const habits = requiredHabitsForDay(key);
  const frag = document.createDocumentFragment();
  for (const h of habits) frag.appendChild(habitRow(h, key, isFuture));
  listEl.innerHTML = '';
  listEl.appendChild(frag);
}

function renderDaySummary() {
  const key = selectedDateKey;
  const evalEl = document.getElementById('day-eval');
  const lineEl = document.getElementById('day-progress-line');
  const s = dayStats(key);
  if (s.total === 0) {
    evalEl.textContent = '';
    evalEl.className = 'eval-text';
    lineEl.textContent = activeHabits().length === 0 ? '' : '这一天还没有需要打卡的项目';
    return;
  }
  const pct = Math.round((s.done / s.total) * 100);
  lineEl.textContent = `已完成 ${s.done} / ${s.total} 项 · ${pct}%`;
  const ev = dailyEval(key);
  evalEl.textContent = ev || '';
  evalEl.className = 'eval-text' + evalClass(pct);
}

function habitRow(h, key, readOnly) {
  const rec = (data.records[key] || {})[h.id] || { actual: null, done: false };
  const actual = rec.actual;
  const done = !!rec.done;
  const shown = actual == null ? 0 : actual;
  const pct = Math.min(100, Math.round((shown / h.target) * 100));
  const daysDone = h.totalDays ? habitDoneDays(h, key) : 0;
  const finished = !!h.totalDays && daysDone >= h.totalDays;

  const row = el('div', 'habit-row' + (done ? ' done' : '') + (finished ? ' finished' : ''));
  row.dataset.id = h.id;
  row.draggable = !readOnly && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const top = el('div', 'habit-top');
  const iconBox = el('span', 'habit-emoji');
  const ic = iconContent(iconOf(h));
  if (ic.html) iconBox.innerHTML = ic.text;
  else iconBox.textContent = ic.text;
  top.appendChild(iconBox);
  const nameWrap = el('div', 'habit-name-wrap');
  const nameLine = el('div', 'habit-name-line');
  nameLine.appendChild(el('div', 'habit-name', h.name));
  if (finished) nameLine.appendChild(el('span', 'badge', '已完成'));
  nameWrap.appendChild(nameLine);
  let metaText = `目标 ${fmt(h.target)} ${h.unit}`;
  if (h.totalDays) metaText += ` · 已维持 ${Math.min(daysDone, h.totalDays)}/${h.totalDays} 天`;
  nameWrap.appendChild(el('div', 'habit-meta', metaText));
  top.appendChild(nameWrap);

  const actions = el('div', 'habit-actions');
  if (!readOnly) {
    actions.appendChild(iconBtn('↑', '上移', 'coarse-only', () => moveHabit(h.id, -1)));
    actions.appendChild(iconBtn('↓', '下移', 'coarse-only', () => moveHabit(h.id, 1)));
    actions.appendChild(iconBtn('⋮⋮', '拖拽排序', 'fine-only drag-handle', () => {}));
    actions.appendChild(iconBtn('✎', '编辑', '', () => openModal(h.id)));
    actions.appendChild(iconBtn('🗑', '删除', '', () => confirmDelete(h)));
  } else if (h.createdAt > todayKey()) {
    actions.appendChild(iconBtn('🗑', '删除', '', () => confirmDelete(h)));
  }
  top.appendChild(actions);

  const barRow = el('div', 'progress-row');
  const track = el('div', 'progress');
  const bar = el('div', 'bar' + (pct >= 100 ? ' full' : ''));
  bar.style.width = pct + '%';
  track.appendChild(bar);
  barRow.appendChild(track);
  barRow.appendChild(el('span', 'progress-text', `${fmt(shown)} / ${fmt(h.target)}`));

  const inputRow = el('div', 'habit-input-row');
  if (readOnly) {
    inputRow.appendChild(el('span', 'muted', done ? '✓ 已完成' : '未完成'));
  } else {
    const wrap = el('label', 'value-input');
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.step = 'any';
    input.inputMode = 'decimal';
    input.placeholder = '实际值';
    input.value = actual == null ? '' : String(actual);
    input.setAttribute('aria-label', `${h.name} 实际值`);
    input.addEventListener('input', () => {
      const raw = input.value.trim();
      const v = raw === '' ? null : Number(raw);
      setActual(key, h.id, v != null && Number.isFinite(v) ? v : null);
      updateRowAfterChange(row, h, key);
    });
    wrap.appendChild(input);
    wrap.appendChild(el('span', 'value-unit', h.unit));
    const check = el('button', 'check-btn' + (done ? ' done' : ''), done ? '✓ 已完成' : '完成');
    check.type = 'button';
    check.addEventListener('click', () => {
      toggleDone(key, h.id);
      renderDay();
      renderToday();
      renderCalendar();
      renderMonthEval();
    });
    inputRow.appendChild(wrap);
    inputRow.appendChild(check);
  }

  row.appendChild(top);
  row.appendChild(barRow);
  row.appendChild(inputRow);
  return row;
}

function updateRowAfterChange(row, h, key) {
  const rec = (data.records[key] || {})[h.id] || {};
  const actual = rec.actual;
  const done = !!rec.done;
  const shown = actual == null ? 0 : actual;
  const pct = Math.min(100, Math.round((shown / h.target) * 100));
  if (h.totalDays) {
    const daysDone = habitDoneDays(h, key);
    const finished = daysDone >= h.totalDays;
    row.classList.toggle('finished', finished);
    row.querySelector('.habit-meta').textContent =
      `目标 ${fmt(h.target)} ${h.unit} · 已维持 ${Math.min(daysDone, h.totalDays)}/${h.totalDays} 天`;
    const badge = row.querySelector('.badge');
    if (finished && !badge) {
      row.querySelector('.habit-name-line').appendChild(el('span', 'badge', '已完成'));
    } else if (!finished && badge) {
      badge.remove();
    }
  }
  row.classList.toggle('done', done);
  const bar = row.querySelector('.bar');
  bar.style.width = pct + '%';
  bar.classList.toggle('full', pct >= 100);
  row.querySelector('.progress-text').textContent = `${fmt(shown)} / ${fmt(h.target)}`;
  const check = row.querySelector('.check-btn');
  if (check) {
    check.textContent = done ? '✓ 已完成' : '完成';
    check.classList.toggle('done', done);
  }
  renderToday();
  renderDaySummary();
  renderCalendar();
  renderMonthEval();
}

function moveHabit(id, dir) {
  const ids = activeHabits().map(h => h.id);
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  reorderHabits(ids);
  renderDay();
}

/* ============ 渲染：月历 ============ */
function renderCalendar() {
  document.getElementById('month-title').textContent = `${viewYear}年${viewMonth + 1}月`;
  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';
  const first = new Date(viewYear, viewMonth, 1);
  const offset = (first.getDay() + 6) % 7; // 周一开头
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const today = todayKey();

  for (let i = 0; i < offset; i++) grid.appendChild(el('div', 'cal-blank'));

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${viewYear}-${pad2(viewMonth + 1)}-${pad2(d)}`;
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cal-day';
    cell.dataset.key = key;

    const s = dayStats(key);
    const isToday = key === today;
    const isFuture = key > today;
    if (isToday) cell.classList.add('today');
    if (isFuture) cell.classList.add('future');
    if (s.total === 0) cell.classList.add('empty');
    else if (s.done === s.total) cell.classList.add('full');
    else if (s.done > 0) cell.classList.add('partial');
    else cell.classList.add('none');
    if (key === selectedDateKey) cell.classList.add('selected');

    cell.appendChild(el('span', 'cal-date', String(d)));
    cell.appendChild(el('span', 'cal-count', s.total === 0 ? '—' : (s.done === s.total ? '✓ ' : '') + `${s.done}/${s.total}`));
    cell.addEventListener('click', () => selectDate(key));
    grid.appendChild(cell);
  }
}

function selectDate(key) {
  selectedDateKey = key;
  renderDay();
  renderCalendar();
  if (window.innerWidth < 768) {
    document.getElementById('day-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ============ 渲染：月度评价 ============ */
function statItem(label, value) {
  const div = el('div', 'stat', label + ' ');
  div.appendChild(el('b', '', value));
  return div;
}

function renderMonthEval() {
  const box = document.getElementById('month-eval');
  const stats = monthStats(viewYear, viewMonth);
  box.innerHTML = '';
  if (!stats) {
    box.appendChild(el('p', 'muted', activeHabits().length === 0 ? '还没有项目，先新增一个项目开始打卡吧' : '本月没有需要打卡的日期'));
    return;
  }
  const { pct, text } = monthEvalText(stats, viewYear, viewMonth);
  const inner = el('div', 'month-eval-inner');
  const row = el('div', 'month-stats');
  row.appendChild(statItem('月度完成率', pct + '%'));
  row.appendChild(statItem('全勤天数', stats.fullDays + ' 天'));
  row.appendChild(statItem('最长连续完成', stats.bestStreak + ' 天'));
  inner.appendChild(row);
  inner.appendChild(el('p', 'month-comment', text));
  box.appendChild(inner);
}

/* ============ 图标选择与上传 ============ */
function renderIconPresets() {
  const box = document.getElementById('icon-presets');
  box.innerHTML = '';
  ICON_PRESETS.forEach(([key, label]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'icon-option';
    b.dataset.key = key;
    b.title = label;
    b.setAttribute('aria-label', label);
    b.innerHTML = GU_FENG_ICONS[key];
    b.addEventListener('click', () => selectIcon({ type: 'svg', value: key }));
    box.appendChild(b);
  });
}

function selectIcon(icon) {
  pendingIcon = icon;
  updateIconPickerUI();
}

function updateIconPickerUI() {
  document.querySelectorAll('#icon-presets .icon-option').forEach(b => {
    b.classList.toggle('selected', pendingIcon.type === 'svg' && b.dataset.key === pendingIcon.value);
  });
  const preview = document.getElementById('icon-preview');
  if (pendingIcon.type === 'image') {
    preview.innerHTML = '<img src="' + pendingIcon.value + '" alt="">';
    preview.classList.remove('hidden');
  } else {
    preview.innerHTML = '';
    preview.classList.add('hidden');
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 128;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject(new Error('图片无法解析'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

async function handleIconUpload() {
  const file = document.getElementById('icon-file').files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    alert('请选择图片文件');
    document.getElementById('icon-file').value = '';
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    alert('图片不能超过 2MB');
    document.getElementById('icon-file').value = '';
    return;
  }
  try {
    const dataUrl = await fileToDataUrl(file);
    pendingIcon = { type: 'image', value: dataUrl };
    document.getElementById('icon-upload-name').textContent = file.name;
    updateIconPickerUI();
  } catch (err) {
    alert('图片读取失败：' + err.message);
    document.getElementById('icon-file').value = '';
  }
}

/* ============ 弹窗 ============ */
const modalEl = document.getElementById('modal-backdrop');
const formEl = document.getElementById('habit-form');
const modalTitle = document.getElementById('modal-title');
const fName = document.getElementById('f-name');
const fTarget = document.getElementById('f-target');
const fUnit = document.getElementById('f-unit');
const fTotalDays = document.getElementById('f-total-days');

function openModal(id) {
  editingId = id || null;
  const h = id ? data.habits.find(x => x.id === id) : null;
  modalTitle.textContent = h ? '编辑项目' : '新增项目';
  const startHint = document.getElementById('start-hint');
  if (!h && selectedDateKey > todayKey()) {
    const d = fromKey(selectedDateKey);
    startHint.textContent = `该项目将从 ${d.getMonth() + 1}月${d.getDate()}日 开始`;
    startHint.classList.remove('hidden');
  } else {
    startHint.textContent = '';
    startHint.classList.add('hidden');
  }
  pendingIcon = h ? iconOf(h) : { type: 'svg', value: 'tea' };
  document.getElementById('icon-file').value = '';
  document.getElementById('icon-upload-name').textContent = '';
  updateIconPickerUI();
  fName.value = h ? h.name : '';
  fTarget.value = h ? String(h.target) : '';
  fUnit.value = h ? h.unit : '';
  fTotalDays.value = h && h.totalDays ? String(h.totalDays) : '';
  modalEl.classList.remove('hidden');
  fName.focus();
  fName.select();
}

function closeModal() {
  modalEl.classList.add('hidden');
  editingId = null;
}

function confirmDelete(h) {
  const ok = window.confirm(`确定删除项目「${h.name}」吗？\n历史打卡记录会保留，但该项目将不再出现在打卡列表中。`);
  if (!ok) return;
  deleteHabit(h.id);
  renderAll();
}

/* ============ 事件绑定 ============ */
document.getElementById('add-habit-btn').addEventListener('click', () => openModal(null));
document.getElementById('empty-add-btn').addEventListener('click', () => openModal(null));
document.getElementById('go-today-btn').addEventListener('click', () => selectDate(todayKey()));

document.getElementById('prev-month').addEventListener('click', () => {
  viewMonth -= 1;
  if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
  renderCalendar();
  renderMonthEval();
});

document.getElementById('next-month').addEventListener('click', () => {
  viewMonth += 1;
  if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
  renderCalendar();
  renderMonthEval();
});

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('f-cancel').addEventListener('click', closeModal);
modalEl.addEventListener('click', (e) => {
  if (e.target === modalEl) closeModal();
});

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = fName.value.trim();
  const target = Number(fTarget.value);
  const unit = fUnit.value.trim() || '次';
  const rawDays = fTotalDays.value.trim();
  const totalDays = rawDays === '' ? null : Number(rawDays);
  const icon = pendingIcon && pendingIcon.value ? pendingIcon : { type: 'svg', value: 'tea' };
  if (!name) { fName.focus(); return; }
  if (!Number.isFinite(target) || target <= 0) { fTarget.focus(); return; }
  if (totalDays !== null && (!Number.isInteger(totalDays) || totalDays <= 0)) { fTotalDays.focus(); return; }
  if (editingId) {
    updateHabit(editingId, { name, unit, target, icon, totalDays });
  } else {
    addHabit({ name, unit, target, icon, totalDays });
  }
  closeModal();
  renderAll();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalEl.classList.contains('hidden')) closeModal();
});

document.getElementById('icon-upload-btn').addEventListener('click', () => {
  document.getElementById('icon-file').click();
});
document.getElementById('icon-file').addEventListener('change', handleIconUpload);

renderIconPresets();

/* 拖拽排序（桌面） */
const habitListEl = document.getElementById('habit-list');
habitListEl.addEventListener('dragstart', (e) => {
  const row = e.target.closest('.habit-row');
  if (!row) return;
  draggedId = row.dataset.id;
  row.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  try { e.dataTransfer.setData('text/plain', draggedId); } catch (err) { /* 忽略 */ }
});
habitListEl.addEventListener('dragover', (e) => {
  if (!draggedId) return;
  const row = e.target.closest('.habit-row');
  if (!row || row.dataset.id === draggedId) return;
  e.preventDefault();
  const dragging = habitListEl.querySelector('.dragging');
  if (!dragging) return;
  const rect = row.getBoundingClientRect();
  const after = e.clientY > rect.top + rect.height / 2;
  habitListEl.insertBefore(dragging, after ? row.nextSibling : row);
});
habitListEl.addEventListener('drop', (e) => e.preventDefault());
habitListEl.addEventListener('dragend', () => {
  habitListEl.querySelectorAll('.dragging').forEach(r => r.classList.remove('dragging'));
  if (draggedId) {
    const ids = Array.from(habitListEl.querySelectorAll('.habit-row')).map(r => r.dataset.id);
    reorderHabits(ids);
    draggedId = null;
  }
});

/* ============ 启动 ============ */
function renderAll() {
  renderToday();
  renderDay();
  renderCalendar();
  renderMonthEval();
}

renderAll();

// 默认展示：爱你呦（仅为提示展示，不触发任何保存操作）
saveStatus('default');

// exe 环境：启动时从内置持久化接口读取数据
if (IS_EXE) syncFromExeStorage();

// PWA：仅在非 exe、非本机调试环境注册 Service Worker（离线缓存）
if ('serviceWorker' in navigator &&
    location.protocol.indexOf('http') === 0 &&
    location.hostname !== '127.0.0.1' &&
    location.hostname !== 'localhost') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
