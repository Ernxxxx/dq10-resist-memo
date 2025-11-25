const resistanceDefinitions = [
  {
    group: '状態異常',
    items: [
      '封印ガード',
      '幻惑ガード',
      '転びガード',
      '眠りガード',
      '混乱ガード',
      'マヒガード',
      '呪いガード',
      '毒ガード',
      '踊りガード',
      '即死ガード',
      'おびえガード',
      '魅了ガード',
      'MP吸収ガード'
    ]
  },
  {
    group: 'ダメージ軽減',
    items: [
      'ブレス耐性',
      '呪文耐性'
    ]
  },
  {
    group: '属性耐性',
    items: [
      '炎耐性',
      '氷耐性',
      '雷耐性',
      '闇耐性',
      '風耐性',
      '土耐性',
      '光耐性'
    ]
  }
];

const GEAR_DATA_URL = 'assets/gear-catalog.json';
const BOSS_PRESETS_URL = 'assets/boss-resist-presets.json';
const STORAGE_KEY = 'dq10GearMemoEntries';

document.addEventListener('DOMContentLoaded', () => {
  if (window.__GEAR_PAGE_INITIALIZED) return;
  window.__GEAR_PAGE_INITIALIZED = true;
  const form = document.getElementById('gearForm');
  const nameInput = document.getElementById('gearName');
  const noteInput = document.getElementById('gearNote');
  const resistSelect = document.getElementById('gearResistSelect');
  const resistValueInput = document.getElementById('gearResistValue');
  const addResistBtn = document.getElementById('gearAddResist');
  const resistEntriesContainer = document.getElementById('gearResistEntries');
  const resistSummaryContainer = document.getElementById('gearResistSummary');
  const statSelect = document.getElementById('gearStatSelect');
  const statCustomInput = document.getElementById('gearStatCustom');
  const statCustomWrapper = document.getElementById('gearStatCustomWrapper');
  const statValueInput = document.getElementById('gearStatValue');
  const addStatBtn = document.getElementById('gearAddStat');
  const statEntriesContainer = document.getElementById('gearStatEntries');
  const searchInput = document.getElementById('gearSearch');
  const clearSearchBtn = document.getElementById('gearClearSearch');
  const listEl = document.getElementById('gearList');
  const emptyState = document.getElementById('gearEmptyState');
  const formTitle = document.getElementById('gearFormTitle');
  const submitBtn = document.getElementById('gearSubmit');
  const resetBtn = document.getElementById('gearReset');
  const clearResistsBtn = document.getElementById('gearClearResists');
  const clearStatsBtn = document.getElementById('gearClearStats');
  const visibleCount = document.getElementById('gearVisibleCount');
  const ownedCount = document.getElementById('ownedCount');
  const trackedResistCount = document.getElementById('trackedResistCount');
  const updatedAtLabel = document.getElementById('updatedAtLabel');
  const nameDatalist = document.getElementById('gearNameOptions');
  const catalogSelect = document.getElementById('gearCatalogSelect');
  const catalogEmptyLabel = document.getElementById('gearCatalogEmpty');
  const slotSelect = document.getElementById('gearSlotSelect');
  const slotCustomInput = document.getElementById('gearSlotCustom');
  const slotCustomWrapper = document.getElementById('gearSlotCustomWrapper');
  const jobSelect = document.getElementById('gearJobSelect');
  const slotFilterTabs = document.getElementById('gearTabs');
  const loadoutSummary = document.getElementById('gearLoadoutSummary');
  const loadoutClearBtn = document.getElementById('gearLoadoutClear');
  const loadoutSelectedList = document.getElementById('gearLoadoutSelected');
  const resistFilterContainer = document.getElementById('gearResistFilterChips');
  const resistThresholdSelect = document.getElementById('gearResistThreshold');
  const jobFilterSelect = document.getElementById('gearJobFilter');
  const bossPresetSelect = document.getElementById('gearBossPresetSelect');
  const bossPresetSummary = document.getElementById('gearBossPresetSummary');
  const SLOT_CUSTOM_VALUE = 'custom';
  const STAT_CUSTOM_VALUE = 'custom';
  const slotPresetValues = slotSelect
    ? Array.from(slotSelect.options)
        .map((option) => option.value)
        .filter((value) => value && value !== SLOT_CUSTOM_VALUE)
    : [];
  const slotPresetSet = new Set(slotPresetValues);

  if (!form) return;

  let entries = loadEntries();
  let editingId = null;
  let formResistances = [];
  let formStats = [];
  let gearCatalogEntries = [];
  let catalogEntryMap = new Map();
  let catalogLoaded = false;
  let catalogLoadError = false;
  let selectedLoadoutIds = new Set();
  const selectedResistFilters = new Set();
  let bossPresets = [];
  let bossPresetMap = new Map();
  let activeBossPreset = null;
  let activeSlotFilter = 'all';

  buildResistanceSelect(resistSelect);
  renderResistanceFilterChips();
  buildJobFilterSelect(jobFilterSelect, jobSelect);
  loadBossPresets();
  updateBossPresetSummary();
  loadCatalogEntries();
  updateCatalogControls();
  handleSlotChange();
  handleJobChange();
  renderResistanceEntries();
  renderStatEntries();
  handleStatChange();
  renderState();
  updateClearButtons();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const slot = getSlotValue();
    const note = noteInput.value.trim();
    const jobs = getSelectedJobs();
    const resistances = serializeResistances();
    const stats = serializeStats();
    if (!slot) {
      slotSelect?.focus();
      return;
    }
    if (!name) {
      nameInput.focus();
      return;
    }
    const timestamp = new Date().toISOString();
    if (editingId) {
      entries = entries.map((entry) =>
        entry.id === editingId
          ? { ...entry, name, slot, note, jobs, resistances, stats, updatedAt: timestamp }
          : entry
      );
    } else {
      const newEntry = {
        id: createId(),
        name,
        slot,
        note,
        jobs,
        resistances,
        stats,
        updatedAt: timestamp
      };
      entries = [newEntry, ...entries];
    }
    persistEntries(entries);
    renderState();
    resetForm();
  });

  resetBtn.addEventListener('click', () => {
    resetForm();
  });

  clearResistsBtn.addEventListener('click', () => {
    setFormResistances([]);
    updateClearButtons();
  });

  clearStatsBtn?.addEventListener('click', () => {
    setFormStats([]);
    updateClearButtons();
  });

  listEl.addEventListener('click', (event) => {
    const actionBtn = event.target.closest('[data-action]');
    if (!actionBtn) return;
    const id = actionBtn.dataset.id;
    if (!id) return;
    if (actionBtn.dataset.action === 'edit') {
      startEdit(id);
    } else if (actionBtn.dataset.action === 'delete') {
      deleteEntry(id);
    }
  });

  searchInput.addEventListener('input', () => {
    renderList();
    updateClearButtons();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearResistFilter();
    resetResistThreshold();
    clearJobFilter();
    renderList();
    updateClearButtons();
    searchInput.focus();
  });

  catalogSelect?.addEventListener('change', () => {
    applySelectedCatalogEntry();
  });

  slotSelect?.addEventListener('change', () => {
    handleSlotChange();
  });

  slotCustomInput?.addEventListener('input', () => {
    updateSlotDependentState();
  });

  jobSelect?.addEventListener('change', () => {
    handleJobChange();
  });

  statSelect?.addEventListener('change', () => {
    handleStatChange();
  });

  addStatBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    handleAddStat();
  });

  statValueInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddStat();
    }
  });

  resistFilterContainer?.addEventListener('pointerdown', (event) => {
    const chip = event.target.closest('[data-resist-filter]');
    if (!chip) return;
    const value = chip.dataset.resistFilter;
    if (!value) return;
    if (selectedResistFilters.has(value)) {
      selectedResistFilters.delete(value);
      chip.classList.remove('is-active');
      chip.setAttribute('aria-pressed', 'false');
    } else {
      selectedResistFilters.add(value);
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');
    }
    resetBossPresetSelection();
    renderList();
    updateClearButtons();
    event.preventDefault();
  });

  jobFilterSelect?.addEventListener('change', () => {
    renderList();
    updateClearButtons();
  });

  bossPresetSelect?.addEventListener('change', () => {
    applyBossPreset(bossPresetSelect.value);
  });

  resistThresholdSelect?.addEventListener('change', () => {
    renderList();
    updateClearButtons();
  });

  slotFilterTabs?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-slot-filter]');
    if (!button) return;
    const value = button.dataset.slotFilter || 'all';
    activeSlotFilter = value;
    slotFilterTabs.querySelectorAll('[data-slot-filter]').forEach((el) => {
      el.setAttribute('aria-current', el === button ? 'true' : 'false');
    });
    renderList();
  });

  addResistBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    handleAddResistance();
  });

  resistValueInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddResistance();
    }
  });

  loadoutClearBtn?.addEventListener('click', () => {
    if (selectedLoadoutIds.size === 0) return;
    selectedLoadoutIds.clear();
    renderList();
    updateLoadoutSummary();
    loadoutClearBtn.disabled = true;
  });

  slotFilterTabs?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-slot-filter]');
    if (!btn) return;
    activeSlotFilter = btn.dataset.slotFilter || 'all';
    slotFilterTabs.querySelectorAll('[data-slot-filter]').forEach((el) => {
      el.setAttribute('aria-current', el === btn ? 'true' : 'false');
    });
    renderList();
  });

  resistEntriesContainer?.addEventListener('click', (event) => {
    const removeBtn = event.target.closest('[data-remove-resist]');
    if (!removeBtn) return;
    const targetId = removeBtn.dataset.removeResist;
    if (!targetId) return;
    formResistances = formResistances.filter((entry) => entry.id !== targetId);
    renderResistanceEntries();
    updateClearButtons();
  });

  statEntriesContainer?.addEventListener('click', (event) => {
    const removeBtn = event.target.closest('[data-remove-stat]');
    if (!removeBtn) return;
    const targetId = removeBtn.dataset.removeStat;
    if (!targetId) return;
    formStats = formStats.filter((entry) => entry.id !== targetId);
    renderStatEntries();
    updateClearButtons();
  });


  function createId() {
    if (window.crypto?.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function loadEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (error) {
      console.error('耐性装備の読み込みに失敗しました', error);
      return [];
    }
  }

  function persistEntries(value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  }

  function buildResistanceSelect(select) {
    if (!select) return;
    select.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = '耐性を選択';
    select.append(placeholder);
    resistanceDefinitions.forEach((group) => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = group.group;
      group.items.forEach((label) => {
        const option = document.createElement('option');
        option.value = label;
        option.textContent = label;
        optgroup.append(option);
      });
      select.append(optgroup);
    });
  }

  function handleAddResistance() {
    if (!resistSelect) return;
    const label = resistSelect.value;
    if (!label) {
      resistSelect.focus();
      return;
    }
    const rawValue = Number(resistValueInput?.value);
    const normalizedValue = Number.isFinite(rawValue) ? Math.max(0, rawValue) : null;
    formResistances = [
      ...formResistances,
      { id: createId(), label, value: normalizedValue }
    ];
    if (resistValueInput) {
      resistValueInput.value = '';
    }
    renderResistanceEntries();
    updateClearButtons();
  }

  function setFormResistances(values = []) {
    formResistances = normalizeResistanceEntries(values, { withId: true });
    renderResistanceEntries();
    updateClearButtons();
  }

  function serializeResistances() {
    return formResistances.map((entry) => ({
      label: entry.label,
      value: Number.isFinite(entry.value) ? entry.value : null
    }));
  }

  function renderResistanceEntries() {
    if (!resistEntriesContainer) return;
    resistEntriesContainer.innerHTML = '';
    if (formResistances.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'gear-resist-empty';
      empty.textContent = 'まだ登録がありません。';
      resistEntriesContainer.append(empty);
    } else {
      const frag = document.createDocumentFragment();
      formResistances.forEach((entry) => {
        const row = document.createElement('div');
        row.className = 'gear-resist-entry';
        const label = document.createElement('span');
        label.className = 'gear-resist-entry__label';
        label.textContent = entry.label;
        const value = document.createElement('span');
        value.className = 'gear-resist-entry__value';
        value.textContent = Number.isFinite(entry.value) ? `${entry.value}%` : '-';
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'gear-resist-entry__remove';
        removeBtn.dataset.removeResist = entry.id;
        removeBtn.textContent = '削除';
        row.append(label, value, removeBtn);
        frag.append(row);
      });
      resistEntriesContainer.append(frag);
    }
    renderResistanceSummary();
  }

  function renderResistanceSummary() {
    if (!resistSummaryContainer) return;
    resistSummaryContainer.innerHTML = '';
    const totals = aggregateResistanceTotals(formResistances);
    if (totals.size === 0) {
      const empty = document.createElement('span');
      empty.className = 'gear-resist-summary__empty';
      empty.textContent = '登録なし';
      resistSummaryContainer.append(empty);
      return;
    }
    totals.forEach((data, label) => {
      const chip = document.createElement('span');
      chip.className = 'gear-resist-summary__chip';
      if (Number.isFinite(data.total) && data.total > 0) {
        const capped = Math.min(data.total, 100);
        if (capped >= 100) {
          chip.dataset.maxed = 'true';
        }
        chip.textContent = `${label} ${capped}%`;
      } else if (data.hasUnknown) {
        chip.textContent = label;
      } else {
        chip.textContent = `${label} 0%`;
      }
      resistSummaryContainer.append(chip);
    });
  }

  function aggregateResistanceTotals(entries = []) {
    const totals = new Map();
    entries.forEach((entry) => {
      if (!entry || !entry.label) return;
      if (Number.isFinite(entry.value)) {
        const current = totals.get(entry.label) || { total: 0, hasUnknown: false };
        current.total += entry.value;
        totals.set(entry.label, current);
      } else {
        const current = totals.get(entry.label) || { total: 0, hasUnknown: false };
        current.hasUnknown = true;
        totals.set(entry.label, current);
      }
    });
    return totals;
  }

  function handleStatChange() {
    const useCustom = statSelect?.value === STAT_CUSTOM_VALUE;
    if (statCustomWrapper) statCustomWrapper.hidden = !useCustom;
    if (statCustomInput) {
      statCustomInput.required = useCustom;
      if (!useCustom) {
        statCustomInput.value = '';
      }
    }
  }

  function handleAddStat() {
    const label = getStatLabel();
    if (!label) {
      statSelect?.focus();
      return;
    }
    const rawValue = Number(statValueInput?.value);
    const normalizedValue = Number.isFinite(rawValue) ? rawValue : null;
    formStats = [
      ...formStats,
      { id: createId(), label, value: normalizedValue }
    ];
    if (statValueInput) {
      statValueInput.value = '';
    }
    renderStatEntries();
    updateClearButtons();
  }

  function getStatLabel() {
    if (!statSelect) return '';
    const selected = statSelect.value;
    if (!selected) return '';
    if (selected === STAT_CUSTOM_VALUE) {
      return statCustomInput?.value.trim() || '';
    }
    return selected;
  }

  function setFormStats(values = []) {
    formStats = normalizeStatEntries(values, { withId: true });
    renderStatEntries();
    updateClearButtons();
  }

  function serializeStats() {
    return formStats.map((entry) => ({
      label: entry.label,
      value: Number.isFinite(entry.value) ? entry.value : null
    }));
  }

  function renderStatEntries() {
    if (!statEntriesContainer) return;
    statEntriesContainer.innerHTML = '';
    if (formStats.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'gear-resist-empty';
      empty.textContent = 'まだ登録がありません。';
      statEntriesContainer.append(empty);
      return;
    }
    const frag = document.createDocumentFragment();
    formStats.forEach((entry) => {
      const row = document.createElement('div');
      row.className = 'gear-stat-entry';
      const label = document.createElement('span');
      label.className = 'gear-stat-entry__label';
      label.textContent = entry.label;
      const value = document.createElement('span');
      value.className = 'gear-stat-entry__value';
      value.textContent = Number.isFinite(entry.value) ? `${entry.value}` : '-';
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'gear-stat-entry__remove';
      removeBtn.dataset.removeStat = entry.id;
      removeBtn.textContent = '削除';
      row.append(label, value, removeBtn);
      frag.append(row);
    });
    statEntriesContainer.append(frag);
  }

  function normalizeStatEntries(entries = [], { withId = false } = {}) {
    if (!Array.isArray(entries)) return [];
    return entries
      .map((item) => {
        if (!item) return null;
        if (typeof item === 'string') {
          const base = { label: item, value: null };
          return withId ? { ...base, id: createId() } : base;
        }
        if (typeof item === 'object') {
          const label = (item.label || '').trim();
          if (!label) return null;
          const numeric = Number(item.value);
          const normalizedValue = Number.isFinite(numeric) ? numeric : null;
          const base = { label, value: normalizedValue };
          return withId ? { ...base, id: item.id || createId() } : base;
        }
        return null;
      })
      .filter(Boolean);
  }

  function normalizeResistanceEntries(resistances = [], { withId = false } = {}) {
    if (!Array.isArray(resistances)) return [];
    return resistances
      .map((item) => {
        if (!item) return null;
        if (typeof item === 'string') {
          const base = { label: item, value: null };
          return withId ? { ...base, id: createId() } : base;
        }
        if (typeof item === 'object') {
          const label = item.label || '';
          if (!label) return null;
          const numeric = Number(item.value);
          const normalizedValue = Number.isFinite(numeric) ? numeric : null;
          const base = { label, value: normalizedValue };
          return withId ? { ...base, id: item.id || createId() } : base;
        }
        return null;
      })
      .filter(Boolean);
  }

  function renderState() {
    renderList();
    renderStats();
    updateLoadoutSummary();
  }

  function renderList() {
    const keyword = searchInput.value.trim().toLowerCase();
    const sorted = [...entries].sort(
      (a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
    );
    const slotFiltered = sorted.filter((entry) => matchesSlotFilter(entry.slot));
    const resistFiltered = slotFiltered.filter((entry) => matchesResistFilter(entry));
    const jobFiltered = resistFiltered.filter((entry) => matchesJobFilter(entry));
    const filtered = keyword
      ? jobFiltered.filter((entry) => matchesKeyword(entry, keyword))
      : jobFiltered;
    listEl.innerHTML = '';
    if (filtered.length === 0) {
      emptyState.hidden = false;
      visibleCount.textContent = '0件';
      return;
    }
    emptyState.hidden = true;
    const frag = document.createDocumentFragment();
    filtered.forEach((entry) => {
      const card = document.createElement('article');
      card.className = 'gear-card';
      const header = document.createElement('header');
      header.className = 'gear-card__header';

      const titleWrap = document.createElement('div');
      titleWrap.className = 'gear-card__header-title';
      const title = document.createElement('h3');
      title.textContent = entry.name;
      if (title.textContent.length >= 14) {
        title.classList.add('long');
      }
      const slot = document.createElement('p');
      slot.className = 'gear-card__meta';
      slot.textContent = entry.slot || '部位メモなし';
      titleWrap.append(title, slot);
      const timestamp = document.createElement('time');
      timestamp.className = 'gear-card__timestamp';
      timestamp.dateTime = entry.updatedAt || '';
      timestamp.textContent = formatDateTime(entry.updatedAt);

      const headerRight = document.createElement('div');
      headerRight.className = 'gear-card__header-right';
      headerRight.append(timestamp);
      header.append(titleWrap, headerRight);

      const resistWrap = document.createElement('div');
      resistWrap.className = 'gear-card__resists';
      const normalizedResists = normalizeResistanceEntries(entry.resistances || []);
      if (normalizedResists.length > 0) {
        const rawList = document.createElement('div');
        rawList.className = 'gear-card__resists-list';
        normalizedResists.forEach((resist) => {
          const chip = document.createElement('div');
          chip.className = 'resistance-chip resistance-chip--raw';
          const labelEl = document.createElement('span');
          labelEl.textContent = resist.label;
          chip.append(labelEl);
          if (Number.isFinite(resist.value)) {
            const valueEl = document.createElement('span');
            valueEl.className = 'resistance-chip__value';
            valueEl.textContent = `${resist.value}%`;
            chip.append(valueEl);
          }
          rawList.append(chip);
        });
        resistWrap.append(rawList);

        const aggregates = aggregateResistanceTotals(normalizedResists);
        if (aggregates.size > 0) {
          const summaryBlock = document.createElement('div');
          summaryBlock.className = 'gear-card__resists-summary';
          const summaryLabel = document.createElement('p');
          summaryLabel.className = 'gear-card__resists-note';
          summaryLabel.textContent = '合計（最大100%まで反映）';
          summaryBlock.append(summaryLabel);
          const summaryChips = document.createElement('div');
          summaryChips.className = 'gear-card__resists-total';
          aggregates.forEach((data, label) => {
            const chip = document.createElement('span');
            chip.className = 'gear-card__resists-total-chip';
            if (Number.isFinite(data.total) && data.total > 0) {
              const capped = Math.min(data.total, 100);
              chip.textContent = `${label} ${capped}%`;
            } else if (data.hasUnknown) {
              chip.textContent = label;
            } else {
              chip.textContent = `${label} 0%`;
            }
            summaryChips.append(chip);
          });
          summaryBlock.append(summaryChips);
          resistWrap.append(summaryBlock);
        }
      } else {
        const placeholder = document.createElement('span');
        placeholder.className = 'gear-card__placeholder';
        placeholder.textContent = '耐性登録なし';
        resistWrap.append(placeholder);
      }

      const statsList = normalizeStatEntries(entry.stats || []);
      let statsBlock = null;
      if (statsList.length > 0) {
        statsBlock = document.createElement('div');
        statsBlock.className = 'gear-card__stats';
        statsList.forEach((stat) => {
          const row = document.createElement('div');
          row.className = 'gear-card__stat-chip';
          const label = document.createElement('span');
          label.textContent = stat.label;
          row.append(label);
          if (Number.isFinite(stat.value)) {
            const value = document.createElement('span');
            value.textContent = stat.value > 0 ? `+${stat.value}` : `${stat.value}`;
            row.append(value);
          }
          statsBlock.append(row);
        });
      }

      const note = document.createElement('p');
      note.className = 'gear-card__note';
      note.textContent = entry.note || 'メモなし';

      const actions = document.createElement('div');
      actions.className = 'gear-card__actions';
      const loadoutToggle = document.createElement('label');
      loadoutToggle.className = 'gear-card__loadout';
      const loadoutCheckbox = document.createElement('input');
      loadoutCheckbox.type = 'checkbox';
      loadoutCheckbox.checked = selectedLoadoutIds.has(entry.id);
      loadoutCheckbox.addEventListener('change', () => {
        toggleLoadoutSelection(entry.id, loadoutCheckbox.checked);
      });
      loadoutToggle.append(loadoutCheckbox, document.createTextNode('セット'));

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'gear-card__btn';
      editBtn.dataset.action = 'edit';
      editBtn.dataset.id = entry.id;
      editBtn.textContent = '編集';
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'gear-card__btn gear-card__btn--danger';
      deleteBtn.dataset.action = 'delete';
      deleteBtn.dataset.id = entry.id;
      deleteBtn.textContent = '削除';
      actions.append(loadoutToggle, editBtn, deleteBtn);

      card.append(header, resistWrap);
      if (statsBlock) {
        card.append(statsBlock);
      }
      card.append(note, actions);
      frag.append(card);
    });
    listEl.append(frag);
    visibleCount.textContent = `${filtered.length}件`;
  }

  function updateLoadoutSummary() {
    if (!loadoutSummary) return;
    const existingIds = new Set(entries.map((entry) => entry.id));
    selectedLoadoutIds.forEach((id) => {
      if (!existingIds.has(id)) {
        selectedLoadoutIds.delete(id);
      }
    });
    const selectedEntries = entries.filter((entry) => selectedLoadoutIds.has(entry.id));
    renderLoadoutSelection(selectedEntries);
    loadoutSummary.innerHTML = '';
    if (selectedLoadoutIds.size === 0) {
      const empty = document.createElement('span');
      empty.className = 'gear-resist-summary__empty';
      empty.textContent = '未選択';
      loadoutSummary.append(empty);
      if (loadoutClearBtn) loadoutClearBtn.disabled = true;
      return;
    }
    const combined = [];
    entries.forEach((entry) => {
      if (!selectedLoadoutIds.has(entry.id)) return;
      combined.push(...normalizeResistanceEntries(entry.resistances || []));
    });
    const totals = aggregateResistanceTotals(combined);
    if (totals.size === 0) {
      const empty = document.createElement('span');
      empty.className = 'gear-resist-summary__empty';
      empty.textContent = '耐性登録なし';
      loadoutSummary.append(empty);
      return;
    }
    totals.forEach((data, label) => {
      const chip = document.createElement('span');
      chip.className = 'gear-resist-summary__chip';
      if (Number.isFinite(data.total) && data.total > 0) {
        const capped = Math.min(data.total, 100);
        if (capped >= 100) {
          chip.dataset.maxed = 'true';
        }
        chip.textContent = `${label} ${capped}%`;
      } else if (data.hasUnknown) {
        chip.textContent = label;
      } else {
        chip.textContent = `${label} 0%`;
      }
      loadoutSummary.append(chip);
    });

    if (loadoutClearBtn) {
      loadoutClearBtn.disabled = selectedLoadoutIds.size === 0;
    }
  }

  function toggleLoadoutSelection(id, isSelected) {
    if (isSelected) {
      selectedLoadoutIds.add(id);
    } else {
      selectedLoadoutIds.delete(id);
    }
    if (loadoutClearBtn) {
      loadoutClearBtn.disabled = selectedLoadoutIds.size === 0;
    }
    updateLoadoutSummary();
  }

  function getSlotValue() {
    if (!slotSelect) return '';
    const selected = slotSelect.value;
    if (!selected) return '';
    if (selected === SLOT_CUSTOM_VALUE) {
      return slotCustomInput?.value.trim() || '';
    }
    return selected;
  }

  function setSlotValue(value) {
    if (!slotSelect) return;
    const normalized = (value || '').trim();
    if (!normalized) {
      slotSelect.value = '';
      if (slotCustomInput) {
        slotCustomInput.value = '';
        slotCustomInput.required = false;
      }
      if (slotCustomWrapper) slotCustomWrapper.hidden = true;
      updateSlotDependentState();
      return;
    }
    if (slotPresetSet.has(normalized)) {
      slotSelect.value = normalized;
      if (slotCustomInput) {
        slotCustomInput.value = '';
        slotCustomInput.required = false;
      }
      if (slotCustomWrapper) slotCustomWrapper.hidden = true;
    } else {
      slotSelect.value = SLOT_CUSTOM_VALUE;
      if (slotCustomWrapper) slotCustomWrapper.hidden = false;
      if (slotCustomInput) {
        slotCustomInput.value = normalized;
        slotCustomInput.required = true;
      }
    }
    updateSlotDependentState();
    renderCatalogList();
  }

  function handleSlotChange() {
    if (!slotSelect) return;
    const useCustom = slotSelect.value === SLOT_CUSTOM_VALUE;
    if (slotCustomWrapper) slotCustomWrapper.hidden = !useCustom;
    if (slotCustomInput) {
      slotCustomInput.required = useCustom;
      if (!useCustom) {
        slotCustomInput.value = '';
      }
    }
    updateSlotDependentState();
    renderCatalogList();
  }

  function matchesSlotFilter(slot = '') {
    if (activeSlotFilter === 'all') return true;
    const normalized = (slot || '').trim();
    if (activeSlotFilter === 'その他') {
      return normalized ? !slotPresetSet.has(normalized) : true;
    }
    return normalized === activeSlotFilter;
  }

  function getSelectedJobs() {
    const value = getJobValue();
    return value ? [value] : [];
  }

  function setSelectedJobs(values = []) {
    setJobValue(values[0] || '');
  }

  function getJobValue() {
    if (!jobSelect) return '';
    return jobSelect.value || '';
  }

  function setJobValue(value) {
    if (!jobSelect) return;
    const normalized = (value || '').trim();
    if (!normalized) {
      jobSelect.value = '';
    } else {
      const hasOption = Array.from(jobSelect.options).some((option) => option.value === normalized);
      jobSelect.value = hasOption ? normalized : '';
    }
    handleJobChange();
  }

  function handleJobChange() {
    if (!jobSelect) return;
    renderCatalogList();
  }

  function updateSlotDependentState() {
    const hasSlot = Boolean(getSlotValue());
    [
      nameInput,
      catalogSelect
    ].forEach((control) => {
      if (!control) return;
      control.disabled = !hasSlot;
      if (!hasSlot && control === catalogSelect) {
        control.selectedIndex = -1;
      }
    });
    if (!hasSlot && catalogEmptyLabel) {
      catalogEmptyLabel.hidden = false;
      catalogEmptyLabel.textContent = '部位を選択すると候補が表示されます。';
    }
    updateCatalogControls();
  }

  function getFilteredCatalogEntries() {
    const jobFilter = getJobFilterTarget();
    if (!jobFilter) {
      return gearCatalogEntries;
    }
    return gearCatalogEntries.filter((entry) => {
      if (!Array.isArray(entry.jobs) || entry.jobs.length === 0) return false;
      return entry.jobs.includes(jobFilter);
    });
  }

  function getJobFilterTarget() {
    if (!jobSelect) return '';
    return jobSelect.value || '';
  }

  function renderStats() {
    const total = entries.length;
    ownedCount.textContent = String(total);
    const resistSet = new Set();
    entries.forEach((entry) => {
      normalizeResistanceEntries(entry.resistances || []).forEach((resist) => {
        if (resist.label) {
          resistSet.add(resist.label);
        }
      });
    });
    trackedResistCount.textContent = String(resistSet.size);
    const latest = entries
      .map((entry) => entry.updatedAt)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))[0];
    const formatted = latest ? formatDate(latest) : null;
    updatedAtLabel.textContent = formatted || '--';
  }

  function matchesKeyword(entry, keyword) {
    const jobs = getEntryJobLabels(entry);
    const resistanceText = normalizeResistanceEntries(entry.resistances || []).map((resist) => {
      if (!resist.label) return '';
      if (Number.isFinite(Number(resist.value))) {
        return `${resist.label} ${resist.value}%`;
      }
      return resist.label;
    });
    const statText = normalizeStatEntries(entry.stats || []).map((stat) => {
      if (!stat.label) return '';
      if (Number.isFinite(Number(stat.value))) {
        return `${stat.label} ${stat.value}`;
      }
      return stat.label;
    });
    const haystack = [
      entry.name,
      entry.slot,
      entry.note,
      ...jobs,
      ...resistanceText,
      ...statText
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(keyword);
  }


  function resetForm() {
    form.reset();
    if (slotSelect) {
      slotSelect.value = '';
    }
    if (slotCustomInput) {
      slotCustomInput.value = '';
      slotCustomInput.required = false;
    }
    if (slotCustomWrapper) {
      slotCustomWrapper.hidden = true;
    }
    setJobValue('');
    setFormResistances([]);
    setFormStats([]);
    if (statSelect) {
      statSelect.value = '';
    }
    handleStatChange();
    editingId = null;
    formTitle.textContent = '耐性装備を登録';
    submitBtn.textContent = '保存する';
    updateSlotDependentState();
    updateClearButtons();
  }

  function startEdit(id) {
    const target = entries.find((entry) => entry.id === id);
    if (!target) return;
    editingId = target.id;
    formTitle.textContent = '耐性装備を編集';
    submitBtn.textContent = '更新する';
    nameInput.value = target.name || '';
    setSlotValue(target.slot || '');
    setSelectedJobs(target.jobs || []);
    noteInput.value = target.note || '';
    setFormResistances(target.resistances || []);
    setFormStats(target.stats || []);
    handleStatChange();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    nameInput.focus();
    updateClearButtons();
  }

  function deleteEntry(id) {
    const target = entries.find((entry) => entry.id === id);
    if (!target) return;
    const confirmed = window.confirm(`「${target.name}」を削除しますか？`);
    if (!confirmed) return;
    entries = entries.filter((entry) => entry.id !== id);
    selectedLoadoutIds.delete(id);
    persistEntries(entries);
    if (editingId === id) {
      resetForm();
    }
    renderState();
  }

  function updateClearButtons() {
    clearResistsBtn.disabled = formResistances.length === 0;
    if (clearStatsBtn) {
      clearStatsBtn.disabled = formStats.length === 0;
    }
    const hasSearch = Boolean(searchInput.value.trim());
    const hasFilters = hasActiveFilters();
    clearSearchBtn.disabled = !hasSearch && !hasFilters;
    resetBtn.disabled = !editingId && !formHasValue();
    updateCatalogControls();
  }

  function formHasValue() {
    if (nameInput.value.trim()) return true;
    if (getSlotValue()) return true;
    if (getJobValue()) return true;
    if (noteInput.value.trim()) return true;
    if (formResistances.length > 0) return true;
    if (formStats.length > 0) return true;
    return false;
  }

  function formatDateTime(isoString) {
    if (!isoString) return '--';
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '--';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
  }

  function formatDate(isoString) {
    if (!isoString) return null;
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return null;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd}`;
  }

  function populateGearNameSuggestions() {
    if (!nameDatalist) return;
    nameDatalist.innerHTML = '';
    if (!gearCatalogEntries.length) return;
    const uniqueNames = Array.from(new Set(gearCatalogEntries.map((entry) => entry.name)));
    uniqueNames.sort((a, b) => a.localeCompare(b, 'ja'));
    const frag = document.createDocumentFragment();
    uniqueNames.forEach((name) => {
      const option = document.createElement('option');
      option.value = name;
      frag.append(option);
    });
    nameDatalist.append(frag);
  }

  function renderCatalogList() {
    if (!catalogSelect) return;
    catalogSelect.innerHTML = '';
    const slotReady = Boolean(getSlotValue());
    if (!slotReady) {
      showCatalogMessage('部位を選択すると候補が表示されます。');
      updateCatalogControls();
      return;
    }
    if (!catalogLoaded) {
      showCatalogMessage('装備リストを読み込み中です…');
      updateCatalogControls();
      return;
    }
    if (catalogLoadError) {
      showCatalogMessage('装備リストの読み込みに失敗しました。');
      updateCatalogControls();
      return;
    }
    const filtered = getFilteredCatalogEntries();
    if (filtered.length === 0) {
      showCatalogMessage('該当する装備がありません。');
      updateCatalogControls();
      return;
    }
    if (catalogEmptyLabel) catalogEmptyLabel.hidden = true;
    const frag = document.createDocumentFragment();
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    placeholder.textContent = '装備候補を選択してください';
    frag.append(placeholder);
    filtered.forEach((entry) => {
      const option = document.createElement('option');
      option.value = entry.name;
      const levelPrefix = entry.level ? `Lv${entry.level} ` : '';
      option.textContent = `${levelPrefix}${entry.name}`;
      option.dataset.level = entry.level || '';
      frag.append(option);
    });
    catalogSelect.append(frag);
    updateCatalogControls();
  }

  function showCatalogMessage(text) {
    if (catalogEmptyLabel) {
      catalogEmptyLabel.hidden = false;
      catalogEmptyLabel.textContent = text;
    }
    if (catalogSelect) {
      catalogSelect.innerHTML = '';
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.disabled = true;
      placeholder.selected = true;
      placeholder.textContent = text;
      catalogSelect.append(placeholder);
      catalogSelect.disabled = true;
    }
  }

  async function loadCatalogEntries() {
    const inlineData = getInlineCatalogData();
    if (window.location.protocol === 'file:' && inlineData) {
      gearCatalogEntries = inlineData;
      catalogLoadError = false;
      catalogLoaded = true;
      rebuildCatalogMap();
      populateGearNameSuggestions();
      renderCatalogList();
      updateCatalogControls();
      renderList();
      return;
    }
    try {
      const targetUrl = new URL(GEAR_DATA_URL, window.location.href);
      const response = await fetch(targetUrl, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      gearCatalogEntries = Array.isArray(data) ? data : [];
      catalogLoadError = false;
    } catch (error) {
      console.error('装備カタログの読み込みに失敗しました', error);
      if (inlineData) {
        gearCatalogEntries = inlineData;
        catalogLoadError = false;
      } else {
        gearCatalogEntries = [];
        catalogLoadError = true;
      }
    } finally {
      catalogLoaded = true;
      rebuildCatalogMap();
      populateGearNameSuggestions();
      renderCatalogList();
      updateCatalogControls();
      updateSlotDependentState();
      renderList();
    }
  }

  async function loadBossPresets() {
    if (!bossPresetSelect) return;
    const inlineData = getInlineBossPresets();
    if (window.location.protocol === 'file:' && inlineData) {
      bossPresets = inlineData;
      rebuildBossPresetMap();
      buildBossPresetSelect();
      return;
    }
    try {
      const response = await fetch(BOSS_PRESETS_URL, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      bossPresets = Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('ボス耐性プリセットの読み込みに失敗しました', error);
      bossPresets = inlineData || [];
    } finally {
      rebuildBossPresetMap();
      buildBossPresetSelect();
    }
  }

  function rebuildBossPresetMap() {
    bossPresetMap = new Map();
    bossPresets.forEach((preset) => {
      if (!preset || !preset.name) return;
      bossPresetMap.set(preset.name, preset);
    });
  }

  function buildBossPresetSelect() {
    if (!bossPresetSelect) return;
    bossPresetSelect.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = bossPresets.length > 0 ? 'ボスを選択' : '耐性データなし';
    bossPresetSelect.append(placeholder);
    if (bossPresets.length === 0) {
      return;
    }
    const grouped = new Map();
    bossPresets.forEach((preset) => {
      if (!preset || !preset.name || !Array.isArray(preset.resistances) || preset.resistances.length === 0) {
        return;
      }
      const key = preset.category || 'other';
      if (!grouped.has(key)) {
        grouped.set(key, {
          label: preset.categoryLabel || key,
          items: []
        });
      }
      grouped.get(key).items.push(preset);
    });
    const sortedGroups = Array.from(grouped.values()).sort((a, b) =>
      a.label.localeCompare(b.label, 'ja')
    );
    sortedGroups.forEach((group) => {
      group.items.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
      const optgroup = document.createElement('optgroup');
      optgroup.label = group.label;
      group.items.forEach((preset) => {
        const option = document.createElement('option');
        option.value = preset.name;
        option.textContent = preset.name;
        optgroup.append(option);
      });
      bossPresetSelect.append(optgroup);
    });
  }

  function getInlineCatalogData() {
    if (Array.isArray(window.__GEAR_CATALOG__)) {
      return window.__GEAR_CATALOG__;
    }
    return null;
  }

  function getInlineBossPresets() {
    if (Array.isArray(window.__BOSS_PRESETS__)) {
      return window.__BOSS_PRESETS__;
    }
    return null;
  }

  function applyBossPreset(name) {
    if (!name) {
      setResistFilters([]);
      renderList();
      updateClearButtons();
      return;
    }
    const preset = bossPresetMap.get(name);
    if (!preset) return;
    activeBossPreset = preset;
    const mustResists = preset.resistances
      .filter((resist) => resist.priority === 'must')
      .map((resist) => resist.label);
    const targets =
      mustResists.length > 0
        ? mustResists
        : preset.resistances.map((resist) => resist.label).filter(Boolean);
    setResistFilters(targets);
    updateBossPresetSummary(preset, targets);
    renderList();
    updateClearButtons();
  }

  function resetBossPresetSelection() {
    activeBossPreset = null;
    if (bossPresetSelect) {
      bossPresetSelect.value = '';
    }
    updateBossPresetSummary();
  }

  function updateBossPresetSummary(preset = null, applied = []) {
    if (!bossPresetSummary) return;
    if (!preset) {
      bossPresetSummary.textContent = '選択すると必須耐性で一括フィルターされます。';
      return;
    }
    const text = applied.length > 0 ? applied.join(' / ') : '耐性情報なし';
    bossPresetSummary.textContent = `${preset.name}: ${text}`;
  }

  function updateCatalogControls() {
    const slotReady = Boolean(getSlotValue());
    if (catalogSelect) {
      catalogSelect.disabled = !slotReady || catalogLoadError || !catalogLoaded;
    }
  }

  function applySelectedCatalogEntry() {
    if (!catalogSelect) return;
    const value = catalogSelect.value;
    if (!value) return;
    nameInput.value = value;
    nameInput.focus();
    updateCatalogControls();
  }

  function renderResistanceFilterChips() {
    if (!resistFilterContainer) return;
    resistFilterContainer.innerHTML = '';
    resistanceDefinitions.forEach((group) => {
      const groupWrapper = document.createElement('div');
      groupWrapper.className = 'gear-filter-chips__group';
      const groupLabel = document.createElement('span');
      groupLabel.className = 'gear-filter-chips__group-label';
      groupLabel.textContent = group.group;
      const chipWrap = document.createElement('div');
      chipWrap.className = 'gear-filter-chips__items';
      group.items.forEach((label) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'gear-filter-chip';
        button.dataset.resistFilter = label;
        button.textContent = label;
        button.setAttribute('aria-pressed', 'false');
        chipWrap.append(button);
      });
      groupWrapper.append(groupLabel, chipWrap);
      resistFilterContainer.append(groupWrapper);
    });
  }

  function buildJobFilterSelect(select, sourceSelect) {
    if (!select) return;
    select.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'すべての職業';
    select.append(placeholder);
    if (!sourceSelect) return;
    Array.from(sourceSelect.options).forEach((option) => {
      if (!option.value) return;
      const clone = option.cloneNode(true);
      clone.selected = false;
      select.append(clone);
    });
  }

  function getResistFilterValues() {
    return Array.from(selectedResistFilters);
  }

  function getResistThreshold() {
    if (!resistThresholdSelect) return 0;
    const value = Number(resistThresholdSelect.value);
    return Number.isFinite(value) ? value : 0;
  }

  function setResistFilters(values = []) {
    selectedResistFilters.clear();
    values.forEach((value) => {
      if (value) {
        selectedResistFilters.add(value);
      }
    });
    if (resistFilterContainer) {
      resistFilterContainer.querySelectorAll('[data-resist-filter]').forEach((chip) => {
        const label = chip.dataset.resistFilter;
        const isActive = selectedResistFilters.has(label);
        chip.classList.toggle('is-active', isActive);
        chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }
    if (!values.length) {
      resetBossPresetSelection();
    }
  }

  function clearResistFilter() {
    setResistFilters([]);
  }

  function resetResistThreshold() {
    if (resistThresholdSelect) {
      resistThresholdSelect.value = '0';
    }
  }

  function getJobFilterValue() {
    return jobFilterSelect?.value || '';
  }

  function clearJobFilter() {
    if (!jobFilterSelect) return;
    jobFilterSelect.value = '';
  }

  function hasActiveFilters() {
    const resistCount = getResistFilterValues().length;
    const thresholdActive = getResistThreshold() > 0 && resistCount > 0;
    return resistCount > 0 || Boolean(getJobFilterValue()) || thresholdActive;
  }

  function matchesResistFilter(entry) {
    const targets = getResistFilterValues();
    if (!targets.length) return true;
    const threshold = getResistThreshold();
    const aggregates = aggregateResistanceTotals(normalizeResistanceEntries(entry.resistances || []));
    return targets.every((target) => {
      const data = aggregates.get(target);
      if (!data) return false;
      if (threshold <= 0) return true;
      if (!Number.isFinite(data.total)) return false;
      const capped = Math.min(data.total, 100);
      return capped >= threshold;
    });
  }

  function matchesJobFilter(entry) {
    const target = getJobFilterValue();
    if (!target) return true;
    return getEntryJobLabels(entry).includes(target);
  }

  function renderLoadoutSelection(selectedEntries = []) {
    if (!loadoutSelectedList) return;
    loadoutSelectedList.innerHTML = '';
    if (!selectedEntries.length) {
      const empty = document.createElement('li');
      empty.className = 'gear-loadout__selected-empty';
      empty.textContent = '未選択';
      loadoutSelectedList.append(empty);
      return;
    }
    selectedEntries.forEach((entry) => {
      const item = document.createElement('li');
      item.className = 'gear-loadout__selected-item';
      const slot = document.createElement('span');
      slot.className = 'gear-loadout__selected-slot';
      slot.textContent = entry.slot || '-';
      const name = document.createElement('span');
      name.className = 'gear-loadout__selected-name';
      name.textContent = entry.name;
      const resists = document.createElement('div');
      resists.className = 'gear-loadout__selected-resists';
      const aggregates = aggregateResistanceTotals(normalizeResistanceEntries(entry.resistances || []));
      if (aggregates.size === 0) {
        const none = document.createElement('span');
        none.className = 'gear-loadout__selected-resists-empty';
        none.textContent = '耐性登録なし';
        resists.append(none);
      } else {
        aggregates.forEach((data, label) => {
          const chip = document.createElement('span');
          chip.className = 'gear-loadout__selected-resist-chip';
          if (Number.isFinite(data.total) && data.total > 0) {
            const capped = Math.min(data.total, 100);
            chip.textContent = `${label} ${capped}%`;
          } else if (data.hasUnknown) {
            chip.textContent = label;
          } else {
            chip.textContent = `${label} 0%`;
          }
          resists.append(chip);
        });
      }
      item.append(slot, name, resists);
      loadoutSelectedList.append(item);
    });
  }

  function getEntryJobLabels(entry) {
    if (!entry) return [];
    const catalogEntry = getCatalogEntryForName(entry.name);
    const catalogJobs = Array.isArray(catalogEntry?.jobs) ? catalogEntry.jobs : [];
    const storedJobs = Array.isArray(entry.jobs) ? entry.jobs : [];
    const combined = [...catalogJobs, ...storedJobs]
      .map((job) => (job || '').trim())
      .filter(Boolean);
    return Array.from(new Set(combined));
  }

  function rebuildCatalogMap() {
    catalogEntryMap = new Map();
    gearCatalogEntries.forEach((entry) => {
      const key = normalizeCatalogName(entry?.name);
      if (!key || catalogEntryMap.has(key)) return;
      catalogEntryMap.set(key, entry);
    });
  }

  function getCatalogEntryForName(name) {
    const key = normalizeCatalogName(name);
    if (!key) return null;
    return catalogEntryMap.get(key) || null;
  }

  function normalizeCatalogName(value) {
    return (value || '').trim();
  }
});
