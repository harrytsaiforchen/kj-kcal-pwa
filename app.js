const KJ_PER_KCAL = 4.184;
const HISTORY_LIMIT = 9;
const HISTORY_STORAGE_KEY = 'kj-kcal-history-v1';
const STATE_STORAGE_KEY = 'kj-kcal-state-v1';
const DAILY_BALANCE_STORAGE_KEY = 'kj-kcal-daily-balance-v1';
const HERO_FILL_FLOOR = 8;
const DIAL_MIN_PERCENT = 2;
const DIAL_ANIMATION_MS = 420;
const DEFAULT_DAILY_PROFILE = {
  sex: 'female',
  age: 30,
  heightCm: 165,
  weightKg: 60,
  activity: 1.375,
};

const presets = [
  { label: '100 kJ', value: 100, unit: 'kj', note: '极轻量' },
  { label: '500 kJ', value: 500, unit: 'kj', note: '轻巧补给' },
  { label: '1000 kJ', value: 1000, unit: 'kj', note: '常见零食' },
  { label: '2000 kJ', value: 2000, unit: 'kj', note: '接近正餐' },
  { label: '250 kcal', value: 250, unit: 'kcal', note: '轻食范围' },
  { label: '500 kcal', value: 500, unit: 'kcal', note: '标准一餐' },
  { label: '750 kcal', value: 750, unit: 'kcal', note: '高能量' },
  { label: '1000 kcal', value: 1000, unit: 'kcal', note: '强补给' },
];

const comparisonCards = [
  {
    title: '轻盈零食',
    ceilingKj: 800,
    note: '像一份小甜点、饮品或小包装零食。',
  },
  {
    title: '轻食正餐',
    ceilingKj: 1800,
    note: '更像沙拉、简餐或比较克制的一餐。',
  },
  {
    title: '标准正餐',
    ceilingKj: 3000,
    note: '接近日常主餐的体感区间。',
  },
  {
    title: '高能量补给',
    ceilingKj: 5000,
    note: '更适合大份主餐、运动补给或放纵餐。',
  },
];

const zoneRules = [
  {
    limit: 800,
    name: '轻盈补给',
    note: '适合作为小零食、饮品或一份偏轻的加餐。',
  },
  {
    limit: 1800,
    name: '轻食区间',
    note: '更接近轻食、简餐或比较克制的一份正餐。',
  },
  {
    limit: 3000,
    name: '主餐区间',
    note: '这已经是比较典型的一份正餐能量级别。',
  },
  {
    limit: Infinity,
    name: '高能量区间',
    note: '更像大份主餐、运动补给或偏放纵的一次摄入。',
  },
];

const kjInput = document.querySelector('#kjInput');
const kcalInput = document.querySelector('#kcalInput');
const valueCardKj = document.querySelector('#valueCardKj');
const valueCardKcal = document.querySelector('#valueCardKcal');
const energySlider = document.querySelector('#energySlider');
const sliderLabel = document.querySelector('#sliderLabel');
const sliderValue = document.querySelector('#sliderValue');
const sliderScale = document.querySelector('#sliderScale');
const presetGrid = document.querySelector('#presetGrid');
const comparisonGrid = document.querySelector('#comparisonGrid');
const historyList = document.querySelector('#historyList');
const clearHistoryButton = document.querySelector('#clearHistoryButton');
const saveHistoryButton = document.querySelector('#saveHistoryButton');
const dragModeKj = document.querySelector('#dragModeKj');
const dragModeKcal = document.querySelector('#dragModeKcal');
const dialPrimary = document.querySelector('#dialPrimary');
const dialSecondary = document.querySelector('#dialSecondary');
const energyDial = document.querySelector('#energyDial');
const zoneValue = document.querySelector('#zoneValue');
const zoneNote = document.querySelector('#zoneNote');
const labelValue = document.querySelector('#labelValue');
const installBanner = document.querySelector('#installBanner');
const installTitle = document.querySelector('#installTitle');
const installDescription = document.querySelector('#installDescription');
const installButton = document.querySelector('#installButton');
const heroZonePill = document.querySelector('#heroZonePill');
const heroLabelLine = document.querySelector('#heroLabelLine');
const heroRulerFill = document.querySelector('#heroRulerFill');
const packZoneBadge = document.querySelector('#packZoneBadge');
const sheetKjValue = document.querySelector('#sheetKjValue');
const sheetKcalValue = document.querySelector('#sheetKcalValue');
const sheetQuickRead = document.querySelector('#sheetQuickRead');
const sheetTranslation = document.querySelector('#sheetTranslation');
const sheetScenario = document.querySelector('#sheetScenario');
const sheetLabelLine = document.querySelector('#sheetLabelLine');
const sheetFootnote = document.querySelector('#sheetFootnote');
const importCurrentButton = document.querySelector('#importCurrentButton');
const addEntryButton = document.querySelector('#addEntryButton');
const intakeTotalKcal = document.querySelector('#intakeTotalKcal');
const intakeTotalKj = document.querySelector('#intakeTotalKj');
const intakeCountValue = document.querySelector('#intakeCountValue');
const entryList = document.querySelector('#entryList');
const sexInput = document.querySelector('#sexInput');
const ageInput = document.querySelector('#ageInput');
const heightInput = document.querySelector('#heightInput');
const weightInput = document.querySelector('#weightInput');
const activityInput = document.querySelector('#activityInput');
const bmrValue = document.querySelector('#bmrValue');
const tdeeValue = document.querySelector('#tdeeValue');
const deficitCard = document.querySelector('#deficitCard');
const deficitLabel = document.querySelector('#deficitLabel');
const deficitValue = document.querySelector('#deficitValue');
const deficitNote = document.querySelector('#deficitNote');
const supportsDialPropertyAnimation =
  typeof CSS !== 'undefined' && typeof CSS.registerProperty === 'function';

let deferredInstallPrompt = null;
let previousRender = {
  kilojoules: null,
  zoneName: '',
};
let lastMotionAt = 0;
let dialAnimationFrame = 0;
let currentDialPercent = DIAL_MIN_PERCENT;

const loadedState = loadState();
const loadedHistory = loadHistory();
const loadedDailyBalance = loadDailyBalance();

const state = {
  kilojoules: loadedState.kilojoules,
  dragUnit: loadedState.dragUnit,
  history: loadedHistory,
  dailyBalance: loadedDailyBalance,
};

renderPresets();
renderComparisons();
renderHistory();
renderDailyBalanceEntries();
render();
setupInstallPrompt();
registerServiceWorker();
preventWheelChangeOnFocus(kjInput);
preventWheelChangeOnFocus(kcalInput);
preventWheelChangeOnFocus(ageInput);
preventWheelChangeOnFocus(heightInput);
preventWheelChangeOnFocus(weightInput);

kjInput.addEventListener('input', (event) => {
  const value = parseInputValue(event.target.value);
  if (value === null) {
    return;
  }

  state.kilojoules = value;
  state.dragUnit = 'kj';
  persistState();
  render();
});

kcalInput.addEventListener('input', (event) => {
  const value = parseInputValue(event.target.value);
  if (value === null) {
    return;
  }

  state.kilojoules = kcalToKj(value);
  state.dragUnit = 'kcal';
  persistState();
  render();
});

energySlider.addEventListener('input', (event) => {
  const sliderNumber = Number(event.target.value);
  if (!Number.isFinite(sliderNumber) || sliderNumber < 0) {
    return;
  }

  state.kilojoules = state.dragUnit === 'kj' ? sliderNumber : kcalToKj(sliderNumber);
  persistState();
  render();
});

dragModeKj.addEventListener('click', () => {
  state.dragUnit = 'kj';
  persistState();
  render();
});

dragModeKcal.addEventListener('click', () => {
  state.dragUnit = 'kcal';
  persistState();
  render();
});

clearHistoryButton.addEventListener('click', () => {
  state.history = [];
  persistHistory();
  renderHistory();
});

saveHistoryButton.addEventListener('click', () => {
  saveCurrentToHistory();
});

importCurrentButton.addEventListener('click', () => {
  state.dailyBalance.entries.push(
    createDailyEntry({
      name: `条目 ${state.dailyBalance.entries.length + 1}`,
      value: roundForStorage(kjToKcal(state.kilojoules)),
      unit: 'kcal',
    }),
  );
  persistDailyBalance();
  renderDailyBalanceEntries();
  renderDailyBalanceMetrics();
});

addEntryButton.addEventListener('click', () => {
  state.dailyBalance.entries.push(createDailyEntry());
  persistDailyBalance();
  renderDailyBalanceEntries();
  renderDailyBalanceMetrics();
});

sexInput.addEventListener('change', () => {
  state.dailyBalance.profile.sex = sexInput.value === 'male' ? 'male' : 'female';
  persistDailyBalance();
  renderDailyBalanceMetrics();
});

ageInput.addEventListener('change', () => {
  updateDailyProfileNumber('age', ageInput.value, 10, 100, DEFAULT_DAILY_PROFILE.age);
});

heightInput.addEventListener('change', () => {
  updateDailyProfileNumber('heightCm', heightInput.value, 100, 250, DEFAULT_DAILY_PROFILE.heightCm);
});

weightInput.addEventListener('change', () => {
  updateDailyProfileNumber('weightKg', weightInput.value, 20, 300, DEFAULT_DAILY_PROFILE.weightKg);
});

activityInput.addEventListener('change', () => {
  state.dailyBalance.profile.activity = normalizeActivityFactor(activityInput.value);
  persistDailyBalance();
  renderDailyBalanceMetrics();
});

installButton.addEventListener('click', async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      showStandaloneBanner();
    }
    deferredInstallPrompt = null;
    renderInstallBanner();
  }
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  showStandaloneBanner();
});

function render() {
  const kj = clampNonNegative(state.kilojoules);
  const kcal = kjToKcal(kj);
  const sliderConfig = getSliderConfig(state.dragUnit, kj, kcal);
  const sliderCurrentValue = state.dragUnit === 'kj' ? kj : kcal;
  const zone = getZone(kj);
  const formattedKj = formatNumber(kj);
  const formattedKcal = formatNumber(kcal);
  const packaging = getPackagingContent(kj, kcal, zone);
  const shouldPulseValue =
    previousRender.kilojoules !== null && Math.abs(previousRender.kilojoules - kj) > 0.01;
  const shouldPulseZone = previousRender.zoneName !== '' && previousRender.zoneName !== zone.name;

  if (document.activeElement !== kjInput) {
    kjInput.value = formatInputNumber(kj);
  }

  if (document.activeElement !== kcalInput) {
    kcalInput.value = formatInputNumber(kcal);
  }

  energySlider.max = String(sliderConfig.max);
  energySlider.step = String(sliderConfig.step);
  energySlider.value = String(clamp(sliderCurrentValue, 0, sliderConfig.max));
  energySlider.setAttribute('aria-valuemin', '0');
  energySlider.setAttribute('aria-valuemax', String(sliderConfig.max));
  energySlider.setAttribute('aria-valuenow', String(clamp(sliderCurrentValue, 0, sliderConfig.max)));
  sliderLabel.textContent = `当前拖动单位：${state.dragUnit === 'kj' ? 'kJ' : 'kcal'}`;
  sliderValue.textContent = `${formatNumber(sliderCurrentValue)} ${state.dragUnit === 'kj' ? 'kJ' : 'kcal'}`;
  sliderScale.replaceChildren(...sliderConfig.scale.map((text) => createScaleText(text)));

  dragModeKj.classList.toggle('is-active', state.dragUnit === 'kj');
  dragModeKcal.classList.toggle('is-active', state.dragUnit === 'kcal');
  valueCardKj.classList.toggle('is-active', state.dragUnit === 'kj');
  valueCardKcal.classList.toggle('is-active', state.dragUnit === 'kcal');

  dialPrimary.textContent = `${formattedKcal} kcal`;
  dialSecondary.textContent = `${formattedKj} kJ`;
  labelValue.textContent = `${formattedKj} kJ / ${formattedKcal} kcal`;
  zoneValue.textContent = zone.name;
  zoneNote.textContent = zone.note;
  heroZonePill.textContent = zone.name;
  heroLabelLine.textContent = `${formattedKj} kJ ≈ ${formattedKcal} kcal`;
  packZoneBadge.textContent = zone.name;
  sheetKjValue.textContent = `${formattedKj} kJ`;
  sheetKcalValue.textContent = `${formattedKcal} kcal`;
  sheetQuickRead.textContent = packaging.quickRead;
  sheetTranslation.textContent = packaging.translation;
  sheetScenario.textContent = packaging.scenario;
  sheetLabelLine.textContent = packaging.labelLine;
  sheetFootnote.textContent = packaging.footnote;

  const dialPercent = Math.min(kj / Math.max(sliderConfig.kjCeiling, 1), 1);
  const dialPercentValue = Math.max(dialPercent * 100, DIAL_MIN_PERCENT);
  setDialPercent(dialPercentValue, previousRender.kilojoules !== null);
  heroRulerFill.style.width = `${Math.max(dialPercentValue, HERO_FILL_FLOOR)}%`;

  highlightComparison(kj);
  syncDailyProfileInputs();
  renderDailyBalanceMetrics();
  renderInstallBanner();

  if (shouldPulseValue) {
    pulseElements([valueCardKj, valueCardKcal, dialPrimary, dialSecondary, sheetKjValue, sheetKcalValue]);
  }

  if (shouldPulseZone) {
    pulseElements([heroZonePill, packZoneBadge, zoneValue, sheetQuickRead], 320);
  }

  previousRender = {
    kilojoules: kj,
    zoneName: zone.name,
  };
}

function renderPresets() {
  const fragment = document.createDocumentFragment();

  presets.forEach((preset) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'preset-button';
    button.innerHTML = `<strong>${preset.label}</strong><span>${preset.note}</span>`;
    button.addEventListener('click', () => {
      state.kilojoules = preset.unit === 'kj' ? preset.value : kcalToKj(preset.value);
      state.dragUnit = preset.unit;
      persistState();
      render();
    });
    fragment.append(button);
  });

  presetGrid.replaceChildren(fragment);
}

function renderComparisons() {
  const fragment = document.createDocumentFragment();

  comparisonCards.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'comparison-card';
    article.dataset.ceilingKj = String(item.ceilingKj);
    article.innerHTML = `
      <p class="insight-label">${item.title}</p>
      <span class="comparison-value">≤ ${formatNumber(item.ceilingKj)} kJ</span>
      <span class="comparison-note">${item.note}</span>
    `;
    fragment.append(article);
  });

  comparisonGrid.replaceChildren(fragment);
}

function highlightComparison(kj) {
  const cards = comparisonGrid.querySelectorAll('.comparison-card');
  const activeCard =
    comparisonCards.find((item) => kj <= item.ceilingKj) ??
    comparisonCards[comparisonCards.length - 1];

  cards.forEach((card) => {
    const ceiling = Number(card.dataset.ceilingKj);
    card.classList.toggle('active', ceiling === activeCard.ceilingKj);
  });
}

function getPackagingContent(kj, kcal, zone) {
  const formattedKj = formatNumber(kj);
  const formattedKcal = formatNumber(kcal);
  const scenario = getScenarioCopy(kj, zone);
  const labelLine =
    state.dragUnit === 'kj'
      ? `如果包装上写着 ${formattedKj} kJ`
      : `如果你脑中更习惯 ${formattedKcal} kcal`;
  const translation =
    state.dragUnit === 'kj'
      ? `约 ${formattedKcal} kcal`
      : `约 ${formattedKj} kJ`;
  const footnote =
    state.dragUnit === 'kj'
      ? `那它大约就是 ${formattedKcal} kcal。把它想成“${zone.name}”更直观，读标签时就不用反复心算。`
      : `那它大约对应 ${formattedKj} kJ。看到包装只写 kJ 时，可以直接往“${zone.name}”这个量级去判断。`;

  return {
    quickRead: zone.name,
    translation,
    scenario,
    labelLine,
    footnote,
  };
}

function getScenarioCopy(kj, zone) {
  if (kj <= 800) {
    return '更像一份轻零食、饮品或小包装补给。';
  }

  if (kj <= 1800) {
    return '更像一份轻食、简餐，或者比较克制的一餐。';
  }

  if (kj <= 3000) {
    return '更像一份标准主餐，已经接近日常正餐体感。';
  }

  return `更像一份高能量主餐、运动补给或偏放纵的一次摄入，属于“${zone.name}”。`;
}

function pulseElements(elements, cooldown = 180) {
  const now = Date.now();
  if (now - lastMotionAt < cooldown) {
    return;
  }

  lastMotionAt = now;
  elements.filter(Boolean).forEach((element) => {
    element.classList.remove('is-bumping');
    void element.offsetWidth;
    element.classList.add('is-bumping');
  });
}

function renderHistory() {
  if (state.history.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'history-empty';
    empty.textContent = '还没有最近使用记录。你可以先换算一个数值，再点“保存到最近使用”。';
    historyList.replaceChildren(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  state.history.forEach((entry) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'history-item';
    button.innerHTML = `
      <span class="history-primary">${formatNumber(entry.kj)} kJ</span>
      <span class="history-secondary">${formatNumber(kjToKcal(entry.kj))} kcal</span>
      <span class="history-secondary">${formatRelativeTime(entry.savedAt)}</span>
    `;

    button.addEventListener('click', () => {
      state.kilojoules = entry.kj;
      state.dragUnit = entry.dragUnit;
      persistState();
      render();
    });

    fragment.append(button);
  });

  historyList.replaceChildren(fragment);
}

function saveCurrentToHistory() {
  const roundedKj = roundForStorage(state.kilojoules);
  const deduped = state.history.filter((entry) => Math.abs(entry.kj - roundedKj) > 0.001);
  deduped.unshift({
    kj: roundedKj,
    dragUnit: state.dragUnit,
    savedAt: Date.now(),
  });
  state.history = deduped.slice(0, HISTORY_LIMIT);
  persistHistory();
  renderHistory();
}

function renderDailyBalanceEntries() {
  const fragment = document.createDocumentFragment();

  state.dailyBalance.entries.forEach((entry, index) => {
    fragment.append(createDailyEntryRow(entry, index));
  });

  entryList.replaceChildren(fragment);
}

function createDailyEntryRow(entry, index) {
  const row = document.createElement('article');
  row.className = 'entry-row';

  const nameInput = document.createElement('input');
  nameInput.className = 'entry-name';
  nameInput.type = 'text';
  nameInput.placeholder = '例如：早餐 / 午餐 / 零食';
  nameInput.setAttribute('aria-label', `第 ${index + 1} 项名称`);
  nameInput.value = entry.name;
  nameInput.addEventListener('input', (event) => {
    entry.name = event.target.value;
    persistDailyBalance();
    renderDailyBalanceMetrics();
  });

  const energyInput = document.createElement('input');
  energyInput.className = 'entry-energy';
  energyInput.type = 'number';
  energyInput.inputMode = 'decimal';
  energyInput.min = '0';
  energyInput.step = 'any';
  energyInput.placeholder = '0';
  energyInput.setAttribute('aria-label', `第 ${index + 1} 项能量值`);
  energyInput.value = entry.value > 0 ? formatInputNumber(entry.value) : '';
  preventWheelChangeOnFocus(energyInput);
  energyInput.addEventListener('input', (event) => {
    entry.value = parseInputValue(event.target.value) ?? 0;
    persistDailyBalance();
    preview.textContent = formatEntryPreview(entry);
    renderDailyBalanceMetrics();
  });

  const unitSelect = document.createElement('select');
  unitSelect.className = 'entry-unit';
  unitSelect.setAttribute('aria-label', `第 ${index + 1} 项能量单位`);
  unitSelect.innerHTML = `
    <option value="kcal">kcal</option>
    <option value="kj">kJ</option>
  `;
  unitSelect.value = entry.unit;
  unitSelect.addEventListener('change', (event) => {
    entry.unit = event.target.value === 'kj' ? 'kj' : 'kcal';
    persistDailyBalance();
    preview.textContent = formatEntryPreview(entry);
    renderDailyBalanceMetrics();
  });

  const preview = document.createElement('p');
  preview.className = 'entry-preview';
  preview.textContent = formatEntryPreview(entry);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'ghost-button entry-remove';
  removeButton.textContent = '删除';
  removeButton.addEventListener('click', () => {
    state.dailyBalance.entries = state.dailyBalance.entries.filter((item) => item.id !== entry.id);
    if (state.dailyBalance.entries.length === 0) {
      state.dailyBalance.entries = [createDailyEntry()];
    }
    persistDailyBalance();
    renderDailyBalanceEntries();
    renderDailyBalanceMetrics();
  });

  row.append(nameInput, energyInput, unitSelect, preview, removeButton);
  return row;
}

function renderDailyBalanceMetrics() {
  const totals = getDailyBalanceTotals();
  const profile = state.dailyBalance.profile;
  const metabolism = calculateDailyMetabolism(profile);
  const difference = metabolism.tdee - totals.kcal;
  const activeEntries = state.dailyBalance.entries.filter(
    (entry) => entry.value > 0.001 || entry.name.trim() !== '',
  ).length;

  intakeTotalKcal.textContent = `${formatNumber(totals.kcal)} kcal`;
  intakeTotalKj.textContent = `${formatNumber(totals.kj)} kJ`;
  intakeCountValue.textContent = `${activeEntries} 项`;
  bmrValue.textContent = `${formatNumber(metabolism.bmr)} kcal`;
  tdeeValue.textContent = `${formatNumber(metabolism.tdee)} kcal`;

  deficitCard.classList.remove('is-positive', 'is-negative');

  if (difference >= 0) {
    deficitCard.classList.add('is-positive');
    deficitLabel.textContent = '今日热量缺口';
    deficitValue.textContent = `${formatNumber(difference)} kcal`;
    deficitNote.textContent = `按当前记录，你今天距离预计总消耗还差约 ${formatNumber(difference)} kcal。`;
    return;
  }

  deficitCard.classList.add('is-negative');
  deficitLabel.textContent = '今日热量盈余';
  deficitValue.textContent = `${formatNumber(Math.abs(difference))} kcal`;
  deficitNote.textContent = `按当前记录，你今天比预计总消耗多摄入约 ${formatNumber(Math.abs(difference))} kcal。`;
}

function syncDailyProfileInputs() {
  if (document.activeElement !== ageInput) {
    ageInput.value = String(state.dailyBalance.profile.age);
  }

  if (document.activeElement !== heightInput) {
    heightInput.value = formatInputNumber(state.dailyBalance.profile.heightCm);
  }

  if (document.activeElement !== weightInput) {
    weightInput.value = formatInputNumber(state.dailyBalance.profile.weightKg);
  }

  sexInput.value = state.dailyBalance.profile.sex;
  activityInput.value = String(state.dailyBalance.profile.activity);
}

function getDailyBalanceTotals() {
  const kj = state.dailyBalance.entries.reduce((sum, entry) => {
    if (entry.unit === 'kj') {
      return sum + entry.value;
    }

    return sum + kcalToKj(entry.value);
  }, 0);

  return {
    kj,
    kcal: kjToKcal(kj),
  };
}

function calculateDailyMetabolism(profile) {
  const base =
    profile.sex === 'male'
      ? 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age + 5
      : 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age - 161;

  const bmr = clampNonNegative(base);
  return {
    bmr,
    tdee: bmr * profile.activity,
  };
}

function formatEntryPreview(entry) {
  if (entry.unit === 'kj') {
    return `≈ ${formatNumber(kjToKcal(entry.value))} kcal`;
  }

  return `≈ ${formatNumber(kcalToKj(entry.value))} kJ`;
}

function createDailyEntry(overrides = {}) {
  return {
    id: createLocalId(),
    name: typeof overrides.name === 'string' ? overrides.name : '',
    value: clampNonNegative(Number(overrides.value)),
    unit: overrides.unit === 'kj' ? 'kj' : 'kcal',
  };
}

function createLocalId() {
  return `entry-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function loadDailyBalance() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DAILY_BALANCE_STORAGE_KEY) ?? '{}');
    const entries = Array.isArray(parsed.entries)
      ? parsed.entries.map((entry) => createDailyEntry(entry))
      : [];

    return {
      entries: entries.length > 0 ? entries : [createDailyEntry()],
      profile: normalizeDailyProfile(parsed.profile),
    };
  } catch {
    return {
      entries: [createDailyEntry()],
      profile: { ...DEFAULT_DAILY_PROFILE },
    };
  }
}

function normalizeDailyProfile(profile) {
  return {
    sex: profile?.sex === 'male' ? 'male' : DEFAULT_DAILY_PROFILE.sex,
    age: normalizeProfileNumber(profile?.age, 10, 100, DEFAULT_DAILY_PROFILE.age, true),
    heightCm: normalizeProfileNumber(profile?.heightCm, 100, 250, DEFAULT_DAILY_PROFILE.heightCm),
    weightKg: normalizeProfileNumber(profile?.weightKg, 20, 300, DEFAULT_DAILY_PROFILE.weightKg),
    activity: normalizeActivityFactor(profile?.activity),
  };
}

function updateDailyProfileNumber(key, value, min, max, fallback) {
  state.dailyBalance.profile[key] = normalizeProfileNumber(value, min, max, fallback);
  persistDailyBalance();
  syncDailyProfileInputs();
  renderDailyBalanceMetrics();
}

function normalizeProfileNumber(value, min, max, fallback, integer = false) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  const safeValue = clamp(parsed, min, max);
  return integer ? Math.round(safeValue) : safeValue;
}

function normalizeActivityFactor(value) {
  const parsed = Number(value);
  const allowed = [1.2, 1.375, 1.55, 1.725, 1.9];
  return allowed.find((item) => Math.abs(item - parsed) < 0.001) ?? DEFAULT_DAILY_PROFILE.activity;
}

function persistDailyBalance() {
  localStorage.setItem(DAILY_BALANCE_STORAGE_KEY, JSON.stringify(state.dailyBalance));
}

function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    renderInstallBanner();
  });

  renderInstallBanner();
}

function renderInstallBanner() {
  const standalone = isStandalone();
  const isIosSafari = detectIosSafari();

  if (standalone) {
    showStandaloneBanner();
    return;
  }

  if (deferredInstallPrompt) {
    installBanner.hidden = false;
    installTitle.textContent = '添加到主屏幕';
    installDescription.textContent = '安装后会以独立窗口打开，也会缓存首屏资源，随手点开更像一个小 App。';
    installButton.hidden = false;
    installButton.textContent = '立即安装';
    return;
  }

  if (isIosSafari) {
    installBanner.hidden = false;
    installTitle.textContent = 'iPhone 添加方式';
    installDescription.textContent = '在 Safari 点分享按钮，再选“添加到主屏幕”。以后从桌面点开，就能直接进入这个换算工具。';
    installButton.hidden = true;
    return;
  }

  installBanner.hidden = true;
}

function showStandaloneBanner() {
  installBanner.hidden = false;
  installTitle.textContent = '主屏幕模式已开启';
  installDescription.textContent = '现在它会像一个独立工具那样打开。最近记录和离线首屏也会跟着保留。';
  installButton.hidden = true;
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        registration.update().catch(() => undefined);
      })
      .catch(() => {
        // Service worker registration is best-effort.
      });
  });
}

function preventWheelChangeOnFocus(input) {
  input.addEventListener(
    'wheel',
    (event) => {
      if (document.activeElement === input) {
        event.preventDefault();
      }
    },
    { passive: false },
  );
}

function setDialPercent(targetPercent, shouldAnimate) {
  if (!energyDial) {
    return;
  }

  const clampedTarget = clamp(targetPercent, DIAL_MIN_PERCENT, 100);

  if (supportsDialPropertyAnimation || !shouldAnimate) {
    stopDialAnimation();
    currentDialPercent = clampedTarget;
    energyDial.style.setProperty('--dial-max', `${clampedTarget}%`);
    return;
  }

  animateDialFallback(clampedTarget);
}

function animateDialFallback(targetPercent) {
  stopDialAnimation();

  const startPercent = currentDialPercent;
  const delta = targetPercent - startPercent;

  if (Math.abs(delta) < 0.01) {
    currentDialPercent = targetPercent;
    energyDial.style.setProperty('--dial-max', `${targetPercent}%`);
    return;
  }

  const startAt = performance.now();
  const step = (now) => {
    const progress = clamp((now - startAt) / DIAL_ANIMATION_MS, 0, 1);
    const easedProgress = 1 - (1 - progress) ** 3;
    currentDialPercent = startPercent + delta * easedProgress;
    energyDial.style.setProperty('--dial-max', `${currentDialPercent}%`);

    if (progress < 1) {
      dialAnimationFrame = window.requestAnimationFrame(step);
      return;
    }

    currentDialPercent = targetPercent;
    energyDial.style.setProperty('--dial-max', `${targetPercent}%`);
    dialAnimationFrame = 0;
  };

  dialAnimationFrame = window.requestAnimationFrame(step);
}

function stopDialAnimation() {
  if (!dialAnimationFrame) {
    return;
  }

  window.cancelAnimationFrame(dialAnimationFrame);
  dialAnimationFrame = 0;
}

function getSliderConfig(unit, kj, kcal) {
  if (unit === 'kcal') {
    const max = pickCeiling(kcal, [250, 500, 800, 1200, 2000, 3000]);
    return {
      max,
      step: max <= 500 ? 1 : 5,
      scale: buildScaleLabels(max, 'kcal'),
      kjCeiling: max * KJ_PER_KCAL,
    };
  }

  const max = pickCeiling(kj, [500, 1000, 2000, 3000, 5000, 8000, 12000]);
  return {
    max,
    step: max <= 1000 ? 10 : 25,
    scale: buildScaleLabels(max, 'kJ'),
    kjCeiling: max,
  };
}

function buildScaleLabels(max, unit) {
  return [0, 0.25, 0.5, 0.75, 1].map((fraction) => `${formatNumber(max * fraction)} ${unit}`);
}

function createScaleText(text) {
  const span = document.createElement('span');
  span.textContent = text;
  return span;
}

function getZone(kj) {
  return zoneRules.find((rule) => kj <= rule.limit) ?? zoneRules[zoneRules.length - 1];
}

function pickCeiling(value, candidates) {
  const safeValue = clampNonNegative(value);
  const match = candidates.find((candidate) => safeValue <= candidate);
  if (match) {
    return match;
  }

  const multiple = candidates[candidates.length - 1];
  return Math.ceil(safeValue / multiple) * multiple;
}

function loadHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) => ({
        kj: clampNonNegative(Number(entry.kj)),
        dragUnit: entry.dragUnit === 'kcal' ? 'kcal' : 'kj',
        savedAt: Number(entry.savedAt) || Date.now(),
      }))
      .filter((entry) => Number.isFinite(entry.kj));
  } catch {
    return [];
  }
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STATE_STORAGE_KEY) ?? '{}');
    const kilojoules = clampNonNegative(Number(parsed.kilojoules));
    return {
      kilojoules: Number.isFinite(kilojoules) ? kilojoules : 1000,
      dragUnit: parsed.dragUnit === 'kcal' ? 'kcal' : 'kj',
    };
  } catch {
    return {
      kilojoules: 1000,
      dragUnit: 'kj',
    };
  }
}

function persistHistory() {
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(state.history));
}

function persistState() {
  localStorage.setItem(
    STATE_STORAGE_KEY,
    JSON.stringify({
      kilojoules: roundForStorage(state.kilojoules),
      dragUnit: state.dragUnit,
    }),
  );
}

function kjToKcal(value) {
  return clampNonNegative(value) / KJ_PER_KCAL;
}

function kcalToKj(value) {
  return clampNonNegative(value) * KJ_PER_KCAL;
}

function parseInputValue(value) {
  if (value.trim() === '') {
    return 0;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return clampNonNegative(parsed);
}

function clampNonNegative(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, value);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function roundForStorage(value) {
  return Math.round(value * 1000) / 1000;
}

function formatNumber(value) {
  const rounded = Math.round(value * 10) / 10;
  const hasFraction = Math.abs(rounded - Math.trunc(rounded)) > 0.001;

  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: hasFraction ? 1 : 0,
    maximumFractionDigits: hasFraction ? 1 : 0,
  }).format(rounded);
}

function formatInputNumber(value) {
  const rounded = Math.round(value * 10) / 10;
  const hasFraction = Math.abs(rounded - Math.trunc(rounded)) > 0.001;
  return rounded.toFixed(hasFraction ? 1 : 0);
}

function formatRelativeTime(timestamp) {
  const diffMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));

  if (diffMinutes < 1) {
    return '刚刚保存';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} 分钟前`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} 小时前`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} 天前`;
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true
  );
}

function detectIosSafari() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isTouchMac = /macintosh/.test(userAgent) && window.navigator.maxTouchPoints > 1;
  const isIos = /iphone|ipad|ipod/.test(userAgent) || isTouchMac;
  const isSafari = /safari/.test(userAgent) && !/crios|fxios|edgios/.test(userAgent);
  return isIos && isSafari;
}
