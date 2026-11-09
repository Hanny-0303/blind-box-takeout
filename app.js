/* ==========================================================================
   盲盒外卖 · app
   纯原生 JS，没有构建步骤，双击 index.html 就能跑。
   ========================================================================== */

(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const STORAGE_KEY = 'blindbox.waimai.history.v1';
  const MAX_HISTORY = 200;
  const TWO_PI = Math.PI * 2;
  const INK = '#2b1d12';
  const WHEEL_COLORS = [
    '#ffd9c2', '#ffe9a8', '#cdebd8', '#cfe4fa',
    '#f7d4e6', '#e2d4f8', '#ffd2c7', '#d8f0e6',
  ];

  const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
  const DISH_MAP = Object.fromEntries(DISHES.map((d) => [d.id, d]));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* 状态                                                                */
  /* ------------------------------------------------------------------ */

  let history = loadHistory();

  const filters = {
    spice: 'any',
    cat: 'any',
    fresh: 'any',
    price: 'any',
    min: 0,
    max: 1000,
  };

  const results = {
    wheel: { dish: null, accepted: false },
    filter: { dish: null, accepted: false },
  };

  const wheelState = {
    items: [],
    rot: 0,
    spinning: false,
  };

  /* DOM */
  const canvas = $('#wheel');
  const ctx = canvas.getContext('2d');
  const spinBtn = $('#spinBtn');
  const spinLabel = $('#spinLabel');
  const shuffleBtn = $('#shuffleWheel');
  const wheelSlot = $('#wheelResult');
  const filterSlot = $('#filterResult');
  const pickBtn = $('#pickBtn');
  const tabs = $('#tabs');
  const sheet = $('#profileSheet');
  const sheetBody = $('#sheetBody');
  const sheetOverlay = $('#sheetOverlay');
  const sheetTitle = $('#sheetTitle');
  const badge = $('#historyBadge');
  const toastEl = $('#toast');
  const customPrice = $('#customPrice');
  const priceMinInput = $('#priceMin');
  const priceMaxInput = $('#priceMax');

  /* ------------------------------------------------------------------ */
  /* 工具                                                                */
  /* ------------------------------------------------------------------ */

  const mod = (n, m) => ((n % m) + m) % m;
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function weightedPick(items, weights) {
    const total = weights.reduce((sum, w) => sum + w, 0);
    if (total <= 0) return items[Math.floor(Math.random() * items.length)];
    let roll = Math.random() * total;
    for (let i = 0; i < items.length; i += 1) {
      roll -= weights[i];
      if (roll <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  const countDish = (id) => history.reduce((n, h) => n + (h.id === id ? 1 : 0), 0);
  const countCat = (catId) =>
    history.reduce((n, h) => n + (DISH_MAP[h.id] && DISH_MAP[h.id].cat === catId ? 1 : 0), 0);

  /* ------------------------------------------------------------------ */
  /* 本地记录                                                            */
  /* ------------------------------------------------------------------ */

  function loadHistory() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!Array.isArray(raw)) return [];
      return raw
        .filter((h) => h && typeof h.ts === 'number' && DISH_MAP[h.id])
        .sort((a, b) => a.ts - b.ts)
        .slice(-MAX_HISTORY);
    } catch (err) {
      return [];
    }
  }

  function saveHistory() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
      /* 隐身模式之类，记不住就算了 */
    }
  }

  function recordDish(dish) {
    history.push({ id: dish.id, ts: Date.now() });
    history = history.slice(-MAX_HISTORY);
    saveHistory();
  }

  /* ------------------------------------------------------------------ */
  /* 顶栏日期 / 记录角标                                                  */
  /* ------------------------------------------------------------------ */

  function initDate() {
    const d = new Date();
    const week = '日一二三四五六'[d.getDay()];
    $('#todayLabel').textContent = `${d.getMonth() + 1}月${d.getDate()}日 周${week} · 今天吃什么`;
  }

  function updateHistoryUI() {
    const n = history.length;
    badge.hidden = n === 0;
    badge.textContent = n > 99 ? '99+' : String(n);
    renderFreshTip();
  }

  function renderFreshTip() {
    const tip = $('#freshTipText');
    if (!tip) return;
    if (history.length === 0) {
      tip.innerHTML =
        '还没有点单记录。选完点「就吃这个」会自动记一笔。' +
        '<button type="button" data-open-sheet>去补几笔 →</button>';
    } else {
      const top = topCategory();
      const topText = top ? `最常吃「${top.name}」` : '还在认识你';
      tip.innerHTML = `已记录 ${history.length} 次点单，${topText}。想尝新会避开常点的分类，老口味会往熟悉的靠。`;
    }
  }

  function topCategory() {
    const counts = {};
    history.forEach((h) => {
      const dish = DISH_MAP[h.id];
      if (dish) counts[dish.cat] = (counts[dish.cat] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (!sorted.length) return null;
    const cat = CAT_MAP[sorted[0][0]];
    return cat ? { ...cat, count: sorted[0][1] } : null;
  }

  /* ------------------------------------------------------------------ */
  /* 转盘                                                                */
  /* ------------------------------------------------------------------ */

  function buildWheelItems() {
    return shuffle(
      CATEGORIES.map((cat) => {
        const pool = DISHES.filter((d) => d.cat === cat.id);
        return pool[Math.floor(Math.random() * pool.length)];
      })
    );
  }

  function drawWheel() {
    const rect = canvas.getBoundingClientRect();
    const size = Math.round(rect.width);
    if (!size) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const px = Math.round(size * dpr);
    if (canvas.width !== px || canvas.height !== px) {
      canvas.width = px;
      canvas.height = px;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const R = size / 2 - 4;
    const items = wheelState.items;
    const n = items.length;
    if (!n) return;

    const seg = TWO_PI / n;
    const base = -Math.PI / 2 + wheelState.rot;

    /* 扇形 */
    for (let i = 0; i < n; i += 1) {
      const a0 = base + i * seg - seg / 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, a0, a0 + seg);
      ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();
    }

    /* 分隔线 */
    ctx.strokeStyle = 'rgba(43, 29, 18, 0.85)';
    ctx.lineWidth = 1.8;
    for (let i = 0; i < n; i += 1) {
      const a = base + i * seg - seg / 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * 14, cy + Math.sin(a) * 14);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.stroke();
    }

    /* 外圈 */
    ctx.beginPath();
    ctx.arc(cx, cy, R - 1, 0, TWO_PI);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.stroke();

    /* 菜名 + emoji */
    const fontFamily =
      '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif';

    items.forEach((dish, i) => {
      const angle = base + i * seg;
      const label = dish.short || dish.name;
      const fontPx =
        label.length >= 6
          ? Math.max(10, size * 0.034)
          : label.length >= 5
            ? Math.max(10.5, size * 0.038)
            : Math.max(11.5, size * 0.042);

      /* emoji 保持正向 */
      ctx.save();
      ctx.translate(cx + Math.cos(angle) * R * 0.43, cy + Math.sin(angle) * R * 0.43);
      ctx.font = `${Math.round(size * 0.075)}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dish.emoji, 0, 0);
      ctx.restore();

      /* 文字沿半径方向，左半边翻正 */
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const radius = R * 0.735;
      if (Math.cos(angle) < 0) {
        ctx.rotate(Math.PI);
        ctx.translate(-radius, 0);
      } else {
        ctx.translate(radius, 0);
      }
      ctx.font = `800 ${fontPx}px ${fontFamily}`;
      ctx.fillStyle = INK;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 0, 0);
      ctx.restore();
    });
  }

  function spinWheel() {
    if (wheelState.spinning || !wheelState.items.length) return;

    wheelState.spinning = true;
    results.wheel = { dish: null, accepted: false };
    spinBtn.disabled = true;
    spinBtn.classList.add('spinning');
    spinLabel.textContent = '转…';
    shuffleBtn.disabled = true;

    const n = wheelState.items.length;
    const seg = TWO_PI / n;
    const targetIndex = Math.floor(Math.random() * n);
    const jitter = (Math.random() - 0.5) * seg * 0.58;
    const startRot = wheelState.rot;
    const targetRot = -targetIndex * seg + jitter;
    const turns = 4 + Math.floor(Math.random() * 2);
    const delta = mod(targetRot - startRot, TWO_PI) + turns * TWO_PI;
    const duration = reduceMotion ? 1 : 3900 + Math.random() * 500;

    animateSpin(startRot, startRot + delta, duration, () => {
      wheelState.rot = mod(startRot + delta, TWO_PI);
      drawWheel();
      wheelState.spinning = false;
      spinBtn.disabled = false;
      spinBtn.classList.remove('spinning');
      spinLabel.textContent = '再转';
      shuffleBtn.disabled = false;

      const dish = wheelState.items[targetIndex];
      results.wheel = { dish, accepted: false };
      renderResult('wheel', dish, 'wheel');
    });
  }

  function animateSpin(from, to, duration, done) {
    if (duration <= 1) {
      wheelState.rot = to;
      done();
      return;
    }
    const start = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 4);

    function frame(now) {
      const t = clamp((now - start) / duration, 0, 1);
      wheelState.rot = from + (to - from) * easeOut(t);
      drawWheel();
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        done();
      }
    }
    requestAnimationFrame(frame);
  }

  function resetWheel() {
    if (wheelState.spinning) return;
    wheelState.items = buildWheelItems();
    wheelState.rot = 0;
    results.wheel = { dish: null, accepted: false };
    wheelSlot.innerHTML = '';
    drawWheel();
    toast('换了一批新候选 🍽️');
  }

  /* ------------------------------------------------------------------ */
  /* 筛选与随机                                                          */
  /* ------------------------------------------------------------------ */

  function freshnessWeight(dish, mode) {
    if (mode === 'any' || history.length === 0) return 1;
    const catN = countCat(dish.cat);
    const dishN = countDish(dish.id);
    if (mode === 'new') {
      const base = 1 / (1 + catN * 0.85 + dishN * 1.4);
      return dishN === 0 ? base * 1.7 : base;
    }
    return 1 + catN * 0.55 + dishN * 1.15;
  }

  function pickDish({ spice, cat, fresh, min, max, excludeId }) {
    const spiceMax = spice === 'any' ? 3 : Number(spice);
    const pool = DISHES.filter((d) => {
      if (d.spice > spiceMax) return false;
      if (cat !== 'any' && d.cat !== cat) return false;
      if (d.price < min || d.price > max) return false;
      return true;
    });
    if (!pool.length) return null;

    const weights = pool.map((d) => {
      let w = freshnessWeight(d, fresh);
      if (excludeId && d.id === excludeId) w *= 0.05;
      return w;
    });
    return weightedPick(pool, weights);
  }

  function pickForMe(isReroll) {
    const dish = pickDish({
      spice: filters.spice,
      cat: filters.cat,
      fresh: filters.fresh,
      min: filters.min,
      max: filters.max,
      excludeId: isReroll && results.filter.dish ? results.filter.dish.id : null,
    });

    if (!dish) {
      results.filter = { dish: null, accepted: false };
      renderEmpty();
      return;
    }

    results.filter = { dish, accepted: false };
    renderResult('filter', dish, filters.fresh);
  }

  /* ------------------------------------------------------------------ */
  /* 结果卡片                                                            */
  /* ------------------------------------------------------------------ */

  function buildReason(dish, mode) {
    const cat = CAT_MAP[dish.cat];
    const total = history.length;

    if (mode === 'new') {
      if (!total) return '第一口盲盒，先从不认识的味道开始。';
      if (countCat(dish.cat) === 0) return `「${cat.name}」你一次都没点过，今天开个新地图。`;
      return '尽量避开了你常点的口味，换点新鲜感。';
    }
    if (mode === 'old') {
      if (!total) return '老口味还在养成中，先随便吃，记两次就有偏好了。';
      const catN = countCat(dish.cat);
      if (catN >= 2) return `你点过 ${catN} 次「${cat.name}」，老位置给你留着。`;
      return '从你熟悉的口味里挑的，稳稳的幸福。';
    }
    if (mode === 'wheel') {
      return countDish(dish.id) > 0
        ? '转盘又把它转回来了，看来是真爱。'
        : '转盘已经替你做决定了，反悔就再转一次。';
    }
    return '条件刚好都对上，剩下的交给运气。';
  }

  function renderResult(kind, dish, mode) {
    const slot = kind === 'wheel' ? wheelSlot : filterSlot;
    const cat = CAT_MAP[dish.cat];
    const eaten = countDish(dish.id);
    const freshPill =
      eaten === 0
        ? '<span class="pill fresh-pill">🆕 没吃过</span>'
        : `<span class="pill old-pill">吃过 ${eaten} 次</span>`;

    slot.innerHTML = `
      <article class="result-card">
        <div class="dish">
          <div class="dish-art" style="--art:${cat.color}" aria-hidden="true">${dish.emoji}</div>
          <div class="dish-info">
            <h3 class="dish-name">${dish.name}</h3>
            <p class="dish-desc">${dish.desc}</p>
            <div class="dish-meta">
              <span class="pill">${cat.emoji} ${cat.name}</span>
              <span class="pill">${SPICE_LABELS[dish.spice]}</span>
              <span class="pill">¥${dish.price}</span>
              ${freshPill}
            </div>
          </div>
        </div>
        <p class="reason"><span class="reason-icon" aria-hidden="true">✨</span><span>${buildReason(dish, mode)}</span></p>
        <div class="actions">
          <button type="button" class="btn btn-primary" data-act="accept">就吃这个</button>
          <button type="button" class="btn btn-ghost" data-act="reroll">${kind === 'wheel' ? '再转一次' : '换一个'}</button>
        </div>
      </article>`;

    const card = slot.firstElementChild;
    requestAnimationFrame(() => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 10) {
        card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'end' });
      }
    });
  }

  function renderEmpty() {
    filterSlot.innerHTML = `
      <article class="empty-card">
        <div class="empty-emoji" aria-hidden="true">🫥</div>
        <p class="empty-title">这个组合太刁钻了</p>
        <p class="empty-desc">翻遍菜单也没找到完全符合的。把价格或辣度放宽一点，选择会多很多。</p>
        <button type="button" class="btn btn-small" data-act="reset">重置条件</button>
      </article>`;
    filterSlot.firstElementChild.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'end',
    });
  }

  function acceptDish(kind, btn) {
    const result = results[kind];
    if (!result.dish || result.accepted) return;
    result.accepted = true;

    recordDish(result.dish);
    updateHistoryUI();

    btn.classList.add('btn-done');
    btn.disabled = true;
    btn.textContent = '已记下 ✓';

    const pill = (kind === 'wheel' ? wheelSlot : filterSlot).querySelector('.fresh-pill, .old-pill');
    if (pill) {
      const n = countDish(result.dish.id);
      pill.className = 'pill old-pill';
      pill.textContent = `吃过 ${n} 次`;
    }

    burst(btn);
    toast('已记下，口味档案 +1 🗂️');
  }

  /* ------------------------------------------------------------------ */
  /* 口味档案                                                            */
  /* ------------------------------------------------------------------ */

  let clearTimer = null;

  function computeStats() {
    const total = history.length;
    if (!total) return { total: 0 };
    const entries = history.map((h) => DISH_MAP[h.id]).filter(Boolean);
    const avg = entries.reduce((sum, d) => sum + d.price, 0) / entries.length;

    const spiceCounts = [0, 0, 0, 0];
    entries.forEach((d) => {
      spiceCounts[d.spice] += 1;
    });
    let topSpice = 0;
    spiceCounts.forEach((n, i) => {
      if (n > spiceCounts[topSpice]) topSpice = i;
    });

    return {
      total,
      avg: Math.round(avg),
      topCat: topCategory(),
      topSpice,
    };
  }

  function formatTime(ts) {
    const d = new Date(ts);
    const now = new Date();
    const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    if (d.toDateString() === now.toDateString()) return `今天 ${hm}`;
    return `${d.getMonth() + 1}月${d.getDate()}日 ${hm}`;
  }

  function renderSheet() {
    clearTimeout(clearTimer);
    const stats = computeStats();

    if (!stats.total) {
      sheetTitle.textContent = '还没有外卖记忆';
      sheetBody.innerHTML = `
        <div class="sheet-empty">
          <div class="empty-emoji" aria-hidden="true">🗂️</div>
          <strong>还没有点单记录</strong>
          <p>每次点「就吃这个」就会自动记一笔。攒几次之后，「想尝试新东西 / 老口味」就会按你的习惯来挑。</p>
          <button type="button" class="btn btn-small" data-act="seed" style="margin-top:14px;">先来 5 笔示例记录</button>
        </div>
        <p class="sheet-note">记录只保存在这台设备的浏览器里</p>`;
      return;
    }

    sheetTitle.textContent = `吃过 ${stats.total} 次，都记着呢`;

    const recent = history
      .slice(-8)
      .reverse()
      .map((h) => {
        const dish = DISH_MAP[h.id];
        return `
          <li class="history-item">
            <span class="history-emoji" aria-hidden="true">${dish.emoji}</span>
            <span class="history-name">${dish.name}</span>
            <span class="history-time">${formatTime(h.ts)}</span>
          </li>`;
      })
      .join('');

    sheetBody.innerHTML = `
      <div class="stats">
        <div class="stat">
          <p class="stat-label">总点单</p>
          <p class="stat-value">${stats.total}<small>次</small></p>
        </div>
        <div class="stat">
          <p class="stat-label">最常吃</p>
          <p class="stat-value">${stats.topCat ? `${stats.topCat.emoji} ${stats.topCat.name}` : '—'}<small>${stats.topCat ? `×${stats.topCat.count}` : ''}</small></p>
        </div>
        <div class="stat">
          <p class="stat-label">平均花费</p>
          <p class="stat-value">¥${stats.avg}</p>
        </div>
        <div class="stat">
          <p class="stat-label">辣度偏好</p>
          <p class="stat-value">${SPICE_LABELS[stats.topSpice]}</p>
        </div>
      </div>
      <p class="sheet-sub">最近点过</p>
      <ul class="history-list">${recent}</ul>
      <div class="sheet-foot">
        <button type="button" class="btn btn-ghost btn-small" data-act="clear">清空记录</button>
      </div>
      <p class="sheet-note">记录只保存在这台设备的浏览器里</p>`;
  }

  let lastFocus = null;

  function openSheet() {
    lastFocus = document.activeElement;
    renderSheet();
    sheetOverlay.hidden = false;
    requestAnimationFrame(() => document.body.classList.add('sheet-open'));
    sheet.setAttribute('aria-hidden', 'false');
    $('#closeSheet').focus({ preventScroll: true });
  }

  function closeSheet() {
    document.body.classList.remove('sheet-open');
    sheet.setAttribute('aria-hidden', 'true');
    clearTimeout(clearTimer);
    window.setTimeout(() => {
      if (!document.body.classList.contains('sheet-open')) sheetOverlay.hidden = true;
    }, 420);
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus({ preventScroll: true });
    }
  }

  function seedHistory() {
    const cats = shuffle(CATEGORIES).slice(0, 2);
    const pool = DISHES.filter((d) => cats.some((c) => c.id === d.cat));
    for (let i = 0; i < 5; i += 1) {
      const dish = pool[Math.floor(Math.random() * pool.length)];
      history.push({ id: dish.id, ts: Date.now() - (i * 19 + Math.random() * 9) * 3600 * 1000 });
    }
    history = history.sort((a, b) => a.ts - b.ts).slice(-MAX_HISTORY);
    saveHistory();
    renderSheet();
    updateHistoryUI();
    toast('补好了 5 笔示例记录 🗂️');
  }

  function handleClear(btn) {
    if (btn.dataset.armed === '1') {
      history = [];
      saveHistory();
      updateHistoryUI();
      renderSheet();
      toast('记录已清空，重新开始');
      return;
    }
    btn.dataset.armed = '1';
    btn.textContent = '再点一次确认清空';
    btn.classList.add('btn-primary');
    clearTimer = window.setTimeout(() => {
      btn.dataset.armed = '0';
      btn.textContent = '清空记录';
      btn.classList.remove('btn-primary');
    }, 3200);
  }

  /* ------------------------------------------------------------------ */
  /* 提示 / 彩纸                                                          */
  /* ------------------------------------------------------------------ */

  let toastTimer = null;

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove('show'), 2100);
  }

  function burst(el) {
    if (reduceMotion || !el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const glyphs = ['✨', '🎉', '🍜', '🥡', '💛', '🌶️', '🍚'];

    for (let i = 0; i < 16; i += 1) {
      const s = document.createElement('span');
      s.className = 'confetti';
      s.textContent = glyphs[i % glyphs.length];
      s.style.left = `${cx}px`;
      s.style.top = `${cy}px`;
      s.style.setProperty('--dx', `${(Math.random() * 2 - 1) * 170}px`);
      s.style.setProperty('--dy', `${-70 - Math.random() * 150}px`);
      s.style.setProperty('--rot', `${(Math.random() * 2 - 1) * 240}deg`);
      s.style.animationDelay = `${Math.random() * 90}ms`;
      document.body.appendChild(s);
      window.setTimeout(() => s.remove(), 1600);
    }
  }

  /* ------------------------------------------------------------------ */
  /* 事件绑定                                                            */
  /* ------------------------------------------------------------------ */

  function bindTabs() {
    tabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (!tab) return;
      const name = tab.dataset.tab;
      tabs.dataset.active = name;
      $$('.tab', tabs).forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
      $('#panel-wheel').hidden = name !== 'wheel';
      $('#panel-filter').hidden = name !== 'filter';
      if (name === 'wheel') requestAnimationFrame(drawWheel);
    });
  }

  function bindWheel() {
    spinBtn.addEventListener('click', spinWheel);
    shuffleBtn.addEventListener('click', resetWheel);

    wheelSlot.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-act]');
      if (!btn) return;
      if (btn.dataset.act === 'accept') acceptDish('wheel', btn);
      if (btn.dataset.act === 'reroll') spinWheel();
    });

    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(() => drawWheel());
      ro.observe(canvas);
    } else {
      window.addEventListener('resize', drawWheel);
    }
  }

  function bindFilters() {
    $$('.chips').forEach((group) => {
      group.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip || !group.contains(chip)) return;
        const key = group.dataset.group;
        $$('.chip', group).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));

        if (key === 'price') {
          const value = chip.dataset.value;
          if (value === 'custom') {
            customPrice.hidden = false;
            filters.price = 'custom';
            readCustomPrice();
          } else {
            customPrice.hidden = true;
            filters.price = value;
            filters.min = Number(chip.dataset.min);
            filters.max = Number(chip.dataset.max);
          }
        } else {
          filters[key] = chip.dataset.value;
        }

        clearFilterResult();
      });
    });

    const onCustomInput = () => {
      if (filters.price === 'custom') {
        readCustomPrice();
        clearFilterResult();
      }
    };
    priceMinInput.addEventListener('change', onCustomInput);
    priceMaxInput.addEventListener('change', onCustomInput);

    pickBtn.addEventListener('click', () => pickForMe(false));

    filterSlot.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-act]');
      if (!btn) return;
      if (btn.dataset.act === 'accept') acceptDish('filter', btn);
      if (btn.dataset.act === 'reroll') pickForMe(true);
      if (btn.dataset.act === 'reset') resetFilters();
    });

    $('#freshTip').addEventListener('click', (e) => {
      if (e.target.closest('[data-open-sheet]')) openSheet();
    });
  }

  function readCustomPrice() {
    let min = parseInt(priceMinInput.value, 10);
    let max = parseInt(priceMaxInput.value, 10);
    if (Number.isNaN(min)) min = 0;
    if (Number.isNaN(max)) max = 1000;
    min = clamp(min, 0, 1000);
    max = clamp(max, 0, 1000);
    if (min > max) [min, max] = [max, min];
    priceMinInput.value = String(min);
    priceMaxInput.value = String(max);
    filters.min = min;
    filters.max = max;
  }

  function clearFilterResult() {
    results.filter = { dish: null, accepted: false };
    filterSlot.innerHTML = '';
  }

  function resetFilters() {
    filters.spice = 'any';
    filters.cat = 'any';
    filters.fresh = 'any';
    filters.price = 'any';
    filters.min = 0;
    filters.max = 1000;

    $$('.chips').forEach((group) => {
      $$('.chip', group).forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.value === 'any')));
    });
    customPrice.hidden = true;
    priceMinInput.value = '0';
    priceMaxInput.value = '1000';
    clearFilterResult();
    toast('条件已重置');
  }

  function bindSheet() {
    $('#profileBtn').addEventListener('click', openSheet);
    $('#closeSheet').addEventListener('click', closeSheet);
    sheetOverlay.addEventListener('click', closeSheet);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('sheet-open')) closeSheet();
    });

    sheetBody.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-act]');
      if (!btn) return;
      if (btn.dataset.act === 'seed') seedHistory();
      if (btn.dataset.act === 'clear') handleClear(btn);
    });
  }

  /* ------------------------------------------------------------------ */
  /* 启动                                                                */
  /* ------------------------------------------------------------------ */

  function init() {
    initDate();
    wheelState.items = buildWheelItems();
    updateHistoryUI();
    bindTabs();
    bindWheel();
    bindFilters();
    bindSheet();
    drawWheel();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => drawWheel()).catch(() => {});
    }
  }

  init();
})();
