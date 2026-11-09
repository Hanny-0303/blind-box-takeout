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
  const WHEEL_SLICES = 16;
  const INK = '#2b1d12';
  const WHEEL_COLORS = [
    '#ffd9c2', '#ffe9a8', '#f4e0b2', '#e2f0c2',
    '#cdebd8', '#c9ece0', '#cfe4fa', '#d6ddfb',
    '#e2d4f8', '#eed8f3', '#f7d4e6', '#ffd6dd',
    '#ffd2c7', '#f8ddc4', '#ebdfcd', '#d8f0e6',
  ];

  /* 演示店铺：真实评分需要美团/京东开放平台接口，这里只做交互演示 */
  const DEMO_PLATFORMS = [
    {
      key: 'shangou',
      name: '美团闪购',
      url: 'https://shangou.meituan.com/',
      brands: ['闪购食刻', '即时厨房', '24h 食仓'],
      base: 4.7,
    },
    {
      key: 'jd',
      name: '京东外卖',
      url: 'https://www.jd.com/',
      brands: ['京选小馆', '京东食堂', '京喜食铺'],
      base: 4.6,
    },
    {
      key: 'waimai',
      name: '美团外卖',
      url: 'https://www.meituan.com/',
      brands: ['巷口食堂', '饭点研究所', '深夜小馆'],
      base: 4.5,
    },
  ];

  const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
  const DISH_MAP = Object.fromEntries(DISHES.map((d) => [d.id, d]));
  const TREE_MAP = Object.fromEntries(CATEGORY_TREE.map((g) => [g.id, g]));
  const SUBCAT_MAP = {};
  const GROUP_CATS = {};
  CATEGORY_TREE.forEach((g) => {
    GROUP_CATS[g.id] = g.children.flatMap((c) => c.cats);
    g.children.forEach((c) => { SUBCAT_MAP[c.id] = { ...c, group: g.id }; });
  });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ */
  /* 状态                                                                */
  /* ------------------------------------------------------------------ */

  let history = loadHistory();

  const filters = {
    spice: 'any',
    cat: 'any',
    sub: 'any',
    flavor: 'any',
    protein: 'any',
    style: 'any',
    fresh: 'any',
    price: 'any',
    min: 0,
    max: 1000,
  };

  const results = {
    wheel: { dish: null, accepted: false, revealed: true, store: null },
    filter: { dish: null, accepted: false, revealed: false, store: null },
  };

  let sealedCount = 0;

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
  const subcatPanel = $('#subcatPanel');
  const subcatChips = $('#subcatChips');
  const subcatLabel = $('#subcatLabel');
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

  function recordDish(dish, store) {
    history.push({
      id: dish.id,
      ts: Date.now(),
      store: store
        ? { key: store.key, platform: store.platform, brand: store.brand, rating: store.rating }
        : null,
    });
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
      tip.innerHTML = `已记录 ${history.length} 次点单，${topText}。尝鲜会避开常点的分类，念旧会往熟悉的靠。`;
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
    return shuffle(CATEGORIES)
      .slice(0, WHEEL_SLICES)
      .map((cat) => {
        const pool = DISHES.filter((d) => d.cat === cat.id);
        return pool[Math.floor(Math.random() * pool.length)];
      })
      .filter(Boolean);
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
      ctx.translate(cx + Math.cos(angle) * R * 0.465, cy + Math.sin(angle) * R * 0.465);
      ctx.font = `${Math.round(size * 0.066)}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dish.emoji, 0, 0);
      ctx.restore();

      /* 文字沿半径方向，左半边翻正 */
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const radius = R * 0.75;
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
    results.wheel = { dish: null, accepted: false, revealed: true, store: null };
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
    results.wheel = { dish: null, accepted: false, revealed: true, store: null };
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

  function pickDish({ spice, cat, sub, flavor, protein, style, fresh, min, max, excludeId }) {
    const spiceMax = spice === 'any' ? 3 : Number(spice);
    let pool = DISHES.filter((d) => {
      if (d.spice > spiceMax) return false;
      if (cat !== 'any') {
        const allowed = sub !== 'any' && SUBCAT_MAP[sub] ? SUBCAT_MAP[sub].cats : GROUP_CATS[cat];
        if (!allowed || !allowed.includes(d.cat)) return false;
      }
      if (flavor !== 'any' && d.flavor !== flavor) return false;
      if (protein !== 'any' && d.protein !== protein) return false;
      if (style !== 'any' && d.style !== style) return false;
      if (d.price < min || d.price > max) return false;
      return true;
    });
    if (!pool.length) return null;

    if (excludeId) {
      const rest = pool.filter((d) => d.id !== excludeId);
      if (rest.length) pool = rest;
    }

    const weights = pool.map((d) => freshnessWeight(d, fresh));
    return weightedPick(pool, weights);
  }

  function hashStr(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  function buildStores(dish) {
    return DEMO_PLATFORMS.map((p) => {
      const h = hashStr(`${dish.id}-${p.key}`);
      return {
        key: p.key,
        platform: p.name,
        url: p.url,
        brand: p.brands[h % p.brands.length],
        rating: (p.base + (h % 3) * 0.1).toFixed(1),
        minutes: 20 + (h % 21),
        fee: h % 6,
        minOrder: 15 + (h % 3) * 5,
      };
    }).sort((a, b) => Number(b.rating) - Number(a.rating) || a.platform.localeCompare(b.platform));
  }

  function renderStores(dish, highlightStore) {
    const stores = buildStores(dish);
    return `
      <section class="stores-card" aria-label="附近店铺推荐（演示数据）">
        <div class="stores-head">
          <h4>附近能点到</h4>
          <span class="demo-badge">演示店铺</span>
        </div>
        <p class="stores-note">按平台评分从高到低 · 评分与店铺均为演示数据</p>
        <ul class="store-list">
          ${stores.map((s, i) => `
            <li class="store">
              <span class="store-rank" aria-hidden="true">${i + 1}</span>
              <div class="store-body">
                <div class="store-top">
                  <span class="store-name">${s.brand}</span>
                  <span class="platform-badge ${s.key}">${s.platform}</span>
                  ${highlightStore && highlightStore.platform === s.platform && highlightStore.brand === s.brand ? '<span class="last-badge">上次这家</span>' : ''}
                </div>
                <p class="store-meta"><strong>${s.rating}</strong> 分 · 约 ${s.minutes} 分钟 · 配送 ¥${s.fee} · 起送 ¥${s.minOrder}</p>
                <p class="store-dish">招牌：${dish.name}</p>
              </div>
              <button type="button" class="store-go" data-store-query="${dish.name}" data-store-url="${s.url}"
                data-store-key="${s.key}" data-store-platform="${s.platform}" data-store-brand="${s.brand}" data-store-rating="${s.rating}"
                title="复制菜名并打开平台" aria-label="去${s.platform}搜索${dish.name}">去搜</button>
            </li>`).join('')}
        </ul>
        <p class="stores-foot">本页只做推荐，不代下单、不收集支付信息；实际价格以下单页为准。</p>
      </section>`;
  }

  function fallbackCopy(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (err) {
      return false;
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function handleStoreSearch(btn, kind) {
    const query = btn.dataset.storeQuery || '';
    const url = btn.dataset.storeUrl || '';
    if (kind && results[kind]) {
      results[kind].store = {
        key: btn.dataset.storeKey || '',
        platform: btn.dataset.storePlatform || '',
        brand: btn.dataset.storeBrand || '',
        rating: btn.dataset.storeRating || '',
      };
    }
    // 先同步复制，避免新标签页抢走焦点后剪贴板写入失败
    const copied = fallbackCopy(query);
    if (url) window.open(url, '_blank', 'noopener');
    if (copied) {
      toast(`已复制「${query}」，在平台里粘贴搜索`);
      return;
    }
    copyText(query).then((ok) => {
      toast(ok ? `已复制「${query}」，在平台里粘贴搜索` : `在平台里搜索「${query}」`);
    });
  }

  function pickForMe(isReroll) {
    const prev = results.filter;
    const wasRevealed = Boolean(prev.revealed);
    const dish = pickDish({
      spice: filters.spice,
      cat: filters.cat,
      sub: filters.sub,
      flavor: filters.flavor,
      protein: filters.protein,
      style: filters.style,
      fresh: filters.fresh,
      min: filters.min,
      max: filters.max,
      excludeId: isReroll && prev.dish ? prev.dish.id : null,
    });

    if (!dish) {
      sealedCount = 0;
      results.filter = { dish: null, accepted: false, revealed: false, store: null };
      renderEmpty();
      return;
    }

    const same = Boolean(isReroll && prev.dish && prev.dish.id === dish.id);
    results.filter = { dish, accepted: false, revealed: wasRevealed, store: null };

    if (wasRevealed) {
      renderResult('filter', dish, filters.fresh);
    } else {
      sealedCount = isReroll ? sealedCount + 1 : 1;
      renderSealed();
    }

    if (isReroll) {
      if (same) toast('这个条件下只剩这一道了，放宽一点试试');
      else if (wasRevealed) toast('换了一道新的 🍽️');
      else toast('换了一个新盲盒 🎁');
    }
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
      if (!total) return '常点的口味还在养成中，先随便吃，记两次就有偏好了。';
      const catN = countCat(dish.cat);
      if (catN >= 2) return `你点过 ${catN} 次「${cat.name}」，老位置给你留着。`;
      return '从你熟悉的口味里挑的，稳稳的幸福。';
    }
    if (mode === 'wheel') {
      return countDish(dish.id) > 0
        ? '转盘又把它转回来了，看来是真爱。'
        : '转盘已经替你做决定了，反悔就再转一次。';
    }
    const bits = activeFilterBits();
    if (bits.length) {
      return `按「${bits.slice(0, 3).join(' · ')}${bits.length > 3 ? ' 等' : ''}」筛出来，剩下的交给运气。`;
    }
    return '条件刚好都对上，剩下的交给运气。';
  }

  function activeFilterBits() {
    const bits = [];
    if (filters.spice !== 'any') bits.push(SPICE_LABELS[Number(filters.spice)]);
    if (filters.cat !== 'any' && TREE_MAP[filters.cat]) {
      let label = TREE_MAP[filters.cat].name;
      if (filters.sub !== 'any' && SUBCAT_MAP[filters.sub]) label += ` · ${SUBCAT_MAP[filters.sub].name}`;
      bits.push(label);
    }
    if (filters.flavor !== 'any') bits.push(filters.flavor);
    if (filters.protein !== 'any') bits.push(filters.protein);
    if (filters.style !== 'any') bits.push(filters.style);
    if (filters.price !== 'any') bits.push(`¥${filters.min}–${filters.max}`);
    return bits;
  }

  function renderSealed() {
    const bits = activeFilterBits();
    const desc = bits.length
      ? `按你选的 ${bits.length} 个条件，从 ${DISHES.length} 道菜里挑了一个。`
      : `所有条件都随便，从 ${DISHES.length} 道菜里挑了一个。`;

    const sealedTitle = sealedCount > 1 ? `第 ${sealedCount} 个盲盒已就绪` : '盲盒已就绪';
    filterSlot.innerHTML = `
      <article class="result-card sealed-card">
        <div class="seal-icon" aria-hidden="true">🎁</div>
        <h3 class="sealed-title">${sealedTitle}</h3>
        <p class="sealed-desc">${desc}<br>点开之前，先别偷看。</p>
        <div class="actions">
          <button type="button" class="btn btn-primary" data-act="reveal">揭晓答案</button>
          <button type="button" class="btn btn-ghost" data-act="reroll">换一个</button>
        </div>
      </article>`;

    syncFilterDock();
    const card = filterSlot.firstElementChild;
    requestAnimationFrame(() => {
      if (card && card.getBoundingClientRect().bottom > window.innerHeight - 10) {
        card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'end' });
      }
    });
  }

  function revealFilter() {
    const res = results.filter;
    if (!res.dish || res.revealed) return;
    res.revealed = true;
    renderResult('filter', res.dish, filters.fresh);
  }

  function renderResult(kind, dish, mode, reasonOverride) {
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
              <span class="pill">${dish.flavor}</span>
              <span class="pill">¥${dish.price}</span>
              ${freshPill}
            </div>
          </div>
        </div>
        <p class="reason"><span class="reason-icon" aria-hidden="true">✨</span><span>${reasonOverride || buildReason(dish, mode)}</span></p>
        <div class="actions">
          <button type="button" class="btn btn-primary" data-act="accept">就吃这个</button>
          <button type="button" class="btn btn-ghost" data-act="reroll">${kind === 'wheel' ? '再转一次' : '换一个'}</button>
        </div>
      </article>
      ${renderStores(dish, results[kind] ? results[kind].store : null)}`;

    if (kind === 'filter') syncFilterDock();

    const card = slot.firstElementChild;
    requestAnimationFrame(() => {
      if (!card) return;
      // 给下面的店铺列表留出一点可视空间，顺便提示还有内容
      const overflow = card.getBoundingClientRect().bottom - (window.innerHeight - 118);
      if (overflow > 0) {
        window.scrollBy({ top: overflow, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }

  function syncFilterDock() {
    document.body.classList.toggle('filter-has-result', filterSlot.children.length > 0);
  }

  function renderEmpty() {
    filterSlot.innerHTML = `
      <article class="empty-card">
        <div class="empty-emoji" aria-hidden="true">🫥</div>
        <p class="empty-title">这个组合太刁钻了</p>
        <p class="empty-desc">口味和辣度可能冲突了，把分类、价格、口味或辣度放宽一点，选择会多很多。</p>
        <button type="button" class="btn btn-small" data-act="reset">重置条件</button>
      </article>`;
    syncFilterDock();
    filterSlot.firstElementChild.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'end',
    });
  }

  function acceptDish(kind, btn) {
    const result = results[kind];
    if (!result.dish || result.accepted) return;
    result.accepted = true;

    const store = result.store || buildStores(result.dish)[0];
    recordDish(result.dish, store);
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
          <p>每次点「就吃这个」就会自动记一笔。攒几次之后，「尝鲜 / 念旧」就会按你的习惯来挑。</p>
          <button type="button" class="btn btn-small" data-act="seed" style="margin-top:14px;">先来 5 笔示例记录</button>
        </div>
        <p class="sheet-note">记录只保存在这台设备的浏览器里</p>`;
      return;
    }

    sheetTitle.textContent = `吃过 ${stats.total} 次，都记着呢`;

    const recent = history
      .slice(-8)
      .reverse()
      .map((h, i) => {
        const dish = DISH_MAP[h.id];
        const store = h.store;
        const index = history.length - 1 - i;
        return `
          <li>
            <button type="button" class="history-item" data-history-index="${index}" aria-label="再来一次 ${dish.name}">
              <span class="history-emoji" aria-hidden="true">${dish.emoji}</span>
              <span class="history-main">
                <span class="history-top">
                  <span class="history-name">${dish.name}</span>
                  <span class="history-price">¥${dish.price}</span>
                </span>
                <span class="history-sub">${store ? `${store.platform} · ${store.brand}` : '未记录店铺'}</span>
              </span>
              <span class="history-side">
                <span class="history-time">${formatTime(h.ts)}</span>
                <span class="history-go">再来 ›</span>
              </span>
            </button>
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

  function replayHistory(index) {
    const entry = history[index];
    if (!entry) return;
    const dish = DISH_MAP[entry.id];
    if (!dish) return;

    closeSheet();
    setActiveTab('filter');
    results.filter = { dish, accepted: false, revealed: true, store: entry.store || null };
    sealedCount = 0;
    const reason = entry.store
      ? `上次点它是在${formatTime(entry.ts)}，店是「${entry.store.platform} · ${entry.store.brand}」。想再吃就点「就吃这个」。`
      : `上次点它是在${formatTime(entry.ts)}。想再吃就点「就吃这个」。`;
    renderResult('filter', dish, 'history', reason);
    toast('从口味档案里翻出来了');
  }

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
      const store = buildStores(dish)[0];
      history.push({
        id: dish.id,
        ts: Date.now() - (i * 19 + Math.random() * 9) * 3600 * 1000,
        store: { key: store.key, platform: store.platform, brand: store.brand, rating: store.rating },
      });
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

  function setActiveTab(name) {
    tabs.dataset.active = name;
    $$('.tab', tabs).forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === name)));
    $('#panel-wheel').hidden = name !== 'wheel';
    $('#panel-filter').hidden = name !== 'filter';
    if (name === 'wheel') requestAnimationFrame(drawWheel);
  }

  function bindTabs() {
    tabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (!tab) return;
      setActiveTab(tab.dataset.tab);
    });
  }

  function bindWheel() {
    spinBtn.addEventListener('click', spinWheel);
    shuffleBtn.addEventListener('click', resetWheel);

    wheelSlot.addEventListener('click', (e) => {
      const storeBtn = e.target.closest('[data-store-query]');
      if (storeBtn) {
        handleStoreSearch(storeBtn, 'wheel');
        return;
      }
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

  function countCats(cats) {
    return DISHES.reduce((n, d) => n + (cats.includes(d.cat) ? 1 : 0), 0);
  }

  function renderSubcats(groupId) {
    const group = TREE_MAP[groupId];
    if (!group) {
      subcatPanel.hidden = true;
      subcatChips.innerHTML = '';
      return;
    }

    const total = countCats(GROUP_CATS[groupId]);
    const buttons = [
      `<button type="button" class="chip" data-sub="any" aria-pressed="true">随便<span class="chip-count">${total}</span></button>`,
    ];
    group.children.forEach((child) => {
      const n = countCats(child.cats);
      buttons.push(
        `<button type="button" class="chip" data-sub="${child.id}" aria-pressed="false">${child.name}<span class="chip-count">${n}</span></button>`
      );
    });

    subcatChips.innerHTML = buttons.join('');
    subcatLabel.textContent = group.name;
    subcatPanel.hidden = false;
  }

  function bindFilters() {
    $$('.chips[data-group]').forEach((group) => {
      group.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip || !group.contains(chip)) return;
        const key = group.dataset.group;
        $$('.chip', group).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));

        if (key === 'cat') {
          filters.cat = chip.dataset.value;
          filters.sub = 'any';
          renderSubcats(filters.cat);
        } else if (key === 'price') {
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

    subcatChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      filters.sub = chip.dataset.sub;
      $$('.chip', subcatChips).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      clearFilterResult();
    });

    pickBtn.addEventListener('click', () => pickForMe(false));

    filterSlot.addEventListener('click', (e) => {
      const storeBtn = e.target.closest('[data-store-query]');
      if (storeBtn) {
        handleStoreSearch(storeBtn, 'filter');
        return;
      }
      const btn = e.target.closest('button[data-act]');
      if (!btn) return;
      if (btn.dataset.act === 'accept') acceptDish('filter', btn);
      if (btn.dataset.act === 'reveal') revealFilter();
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
    results.filter = { dish: null, accepted: false, revealed: false, store: null };
    sealedCount = 0;
    filterSlot.innerHTML = '';
    syncFilterDock();
  }

  function resetFilters() {
    filters.spice = 'any';
    filters.cat = 'any';
    filters.sub = 'any';
    filters.flavor = 'any';
    filters.protein = 'any';
    filters.style = 'any';
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
    subcatPanel.hidden = true;
    subcatChips.innerHTML = '';
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
      const historyRow = e.target.closest('[data-history-index]');
      if (historyRow) {
        replayHistory(Number(historyRow.dataset.historyIndex));
        return;
      }
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
