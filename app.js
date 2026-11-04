/* =========================================================
   AppsJar — logique de l'application
   ========================================================= */
(() => {
  const APPS = window.APPS || [];
  const CATS = window.CATEGORIES || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Icônes (SVG inline, style trait) ---------- */
  const ICONS = {
    briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
    palette:'<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.5-1.5 0-.9-.7-1.2-.7-2.1 0-.8.6-1.4 1.4-1.4H16a5 5 0 0 0 5-5c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    lifebuoy:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>',
    ruler:'<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
    gantt:'<path d="M3 4v16h18"/><rect x="6" y="6" width="8" height="3" rx="1"/><rect x="10" y="11" width="9" height="3" rx="1"/><rect x="7" y="16" width="6" height="2" rx="1"/>',
    scissors:'<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
    chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    layers:'<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    github:'<path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    flow:'<rect x="3" y="3" width="7" height="5" rx="1"/><rect x="14" y="16" width="7" height="5" rx="1"/><path d="M6.5 8v5a2 2 0 0 0 2 2h9v1"/>',
    image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    file:'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
    type:'<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    ext:'<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
    bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
    play:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="m10 8.5 4 2-4 2z"/>'
  };
  const ico = (n) => `<svg viewBox="0 0 24 24">${ICONS[n] || ICONS.grid}</svg>`;
  const CAT_COLOR = { metier: "#0047FF", design: "#FA6800", aide: "#00A300" };
  const catOf = (id) => CATS.find((c) => c.id === id) || { label: id, icon: "grid" };
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[m]));

  /* ---------- État (persisté) ---------- */
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem("appsjar:" + k)) ?? d; } catch { return d; } },
    set(k, v) { localStorage.setItem("appsjar:" + k, JSON.stringify(v)); }
  };
  const state = {
    nav: "overview",        // overview | new | favs | history | <catId>
    type: "all",            // onglet : all | metier | design | aide
    q: "",
    sort: "cat",
    view: store.get("view", "metro"),
    favs: new Set(store.get("favs", [])),
    hist: store.get("hist", [])
  };

  /* ---------- Sidebar catégories ---------- */
  function renderSideCats() {
    const total = APPS.length;
    let html = `<a href="#" class="side-link side-all" data-nav="overview-all">${ico("grid")} Toutes les catégories <span class="num">${total}</span></a>`;
    CATS.forEach((c) => {
      const n = APPS.filter((a) => a.cat === c.id).length;
      html += `<a href="#" class="side-link" data-nav="${c.id}">
        <span class="cat-ico" style="background:${CAT_COLOR[c.id]}">${ico(c.icon)}</span>
        ${esc(c.label)} <span class="num">${n}</span></a>`;
    });
    $("#side-cats").innerHTML = html;
    $("#count-cats").textContent = `${CATS.length} catégories`;
  }

  /* ---------- Onglets ---------- */
  function renderTabs(base) {
    const tabs = [{ id: "all", label: "Tout", icon: "grid" }, ...CATS.map((c) => ({ id: c.id, label: c.label, icon: c.icon }))];
    $("#tab-row").innerHTML = tabs.map((t) => {
      const n = t.id === "all" ? base.length : base.filter((a) => a.cat === t.id).length;
      return `<button class="tab ${state.type === t.id ? "on" : ""}" data-type="${t.id}">${ico(t.icon)} ${esc(t.label)} <span class="n">${n}</span></button>`;
    }).join("");
  }

  /* ---------- Filtrage ---------- */
  function baseList() {
    switch (state.nav) {
      case "new": return APPS.filter((a) => a.isNew);
      case "favs": return APPS.filter((a) => state.favs.has(a.id));
      case "history": return state.hist.map((id) => APPS.find((a) => a.id === id)).filter(Boolean);
      default:
        if (CATS.some((c) => c.id === state.nav)) return APPS.filter((a) => a.cat === state.nav);
        return APPS.slice();
    }
  }
  function currentList() {
    let list = baseList();
    if (state.type !== "all") list = list.filter((a) => a.cat === state.type);
    const q = state.q.trim().toLowerCase();
    if (q) list = list.filter((a) => [a.name, a.desc, a.tag, catOf(a.cat).label, a.url].join(" ").toLowerCase().includes(q));
    if (state.nav !== "history") {
      const order = CATS.map((c) => c.id);
      if (state.sort === "az") list.sort((a, b) => a.name.localeCompare(b.name, "fr"));
      else if (state.sort === "new") list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      else list.sort((a, b) => order.indexOf(a.cat) - order.indexOf(b.cat));
    }
    return list;
  }
  function navTitle() {
    const t = { overview: "Toutes les catégories", new: "Nouveautés 2026", favs: "Favoris & Sauvegardes", history: "Historique" }[state.nav]
      || catOf(state.nav).label;
    const tab = state.type === "all" ? "Tout" : catOf(state.type).label;
    return `${t} · ${tab}`;
  }

  /* ---------- Rendu : tuile Windows 8 ---------- */
  function tileHTML(a, i) {
    const big = a.size !== "small";
    const live = big && a.preview;
    const faceB = live
      ? `<div class="preview"><iframe data-src="${esc(a.url)}" tabindex="-1" title="${esc(a.name)}" loading="lazy"></iframe></div><span class="label">${esc(a.name)}</span>`
      : `<div class="info"><b>${esc(a.name)}</b><p>${esc(a.desc)}</p></div><span class="label">${esc(a.tag || catOf(a.cat).label)}</span>`;
    return `<div class="tile ${a.size || "medium"}" tabindex="0" role="button" data-id="${a.id}" style="--c:${a.color};--d:${(i * 0.05).toFixed(2)}s" title="${esc(a.name)} — ${esc(a.desc)}">
      ${state.favs.has(a.id) ? '<span class="fav-flag"></span>' : ""}
      <div class="faces">
        <div class="face face-a">
          <div class="big">${ico(a.icon)}</div>
          ${a.mine ? "" : `<span class="ext">${ico("ext")}</span>`}
          ${a.isNew && big ? '<span class="badge">NOUVEAU</span>' : ""}
          <span class="label">${esc(a.name)}</span>
        </div>
        ${big ? `<div class="face face-b">${faceB}</div>` : ""}
      </div>
    </div>`;
  }
  function renderMetro(list) {
    const groups = CATS.map((c) => ({ c, items: list.filter((a) => a.cat === c.id) })).filter((g) => g.items.length);
    let i = 0;
    return `<div class="metro-start">
        <h3>Accueil</h3>
        <div class="who"><div><b>salaheddine</b><small>LearnPls · AppsJar</small></div><img src="assets/logo-lplus.png" alt=""></div>
      </div>
      <div class="metro-groups">
        ${groups.map((g) => `<div class="metro-group">
          <h4>${esc(g.c.label)} <small>${g.items.length}</small></h4>
          <div class="metro">${g.items.map((a) => tileHTML(a, i++)).join("")}</div>
        </div>`).join("")}
      </div>`;
  }

  /* ---------- Rendu : cartes EngiHub ---------- */
  function cardHTML(a, i) {
    const fav = state.favs.has(a.id);
    return `<article class="card" style="--c:${a.color};--d:${(i * 0.04).toFixed(2)}s" data-id="${a.id}">
      <div class="card-top">
        ${a.preview ? `<div class="preview"><iframe data-src="${esc(a.url)}" tabindex="-1" title="${esc(a.name)}" loading="lazy"></iframe></div>` : `<div class="ico">${ico(a.icon)}</div>`}
        <div class="card-tags"><span class="tag tag-cat">${esc(catOf(a.cat).label)}</span><span class="tag">${esc(a.tag || "")}</span></div>
        <span class="tag pub">${a.mine ? "AppsJar" : "Externe"}</span>
      </div>
      <div class="card-body">
        <h3>${esc(a.name)}</h3>
        <p>${esc(a.desc)}</p>
        <div class="card-actions">
          <button class="btn btn-primary" data-view-app="${a.id}">${ico("play")} Aperçu</button>
          <a class="icon-btn" href="${esc(a.url)}" target="_blank" rel="noopener" data-visit="${a.id}" title="Ouvrir dans un nouvel onglet">${ico("ext")}</a>
          <button class="icon-btn ${fav ? "on" : ""}" data-fav="${a.id}" title="Favori">${ico("bookmark")}</button>
        </div>
      </div>
    </article>`;
  }
  function rowHTML(a, i) {
    const fav = state.favs.has(a.id);
    return `<div class="row" style="--c:${a.color};--d:${(i * 0.03).toFixed(2)}s">
      <div class="ico">${ico(a.icon)}</div>
      <div class="meta"><b>${esc(a.name)}</b> <span class="tag tag-cat">${esc(catOf(a.cat).label)}</span><p>${esc(a.desc)}</p></div>
      <span class="url">${esc(a.url.replace(/^https?:\/\//, ""))}</span>
      <button class="icon-btn ${fav ? "on" : ""}" data-fav="${a.id}" title="Favori">${ico("bookmark")}</button>
      <button class="btn btn-ghost" data-view-app="${a.id}">Aperçu</button>
      <a class="btn btn-primary" href="${esc(a.url)}" target="_blank" rel="noopener" data-visit="${a.id}">Ouvrir</a>
    </div>`;
  }

  /* ---------- Rendu principal ---------- */
  let flipTimers = [];
  function render() {
    const base = baseList();
    const list = currentList();
    renderTabs(base);
    $("#sec-title").textContent = navTitle();
    $("#shown").textContent = list.length;

    const grid = $("#grid");
    grid.className = "grid view-" + state.view;
    $("#empty").hidden = list.length > 0;
    if (!list.length) { grid.innerHTML = ""; }
    else if (state.view === "metro") grid.innerHTML = renderMetro(list);
    else if (state.view === "cards") grid.innerHTML = list.map(cardHTML).join("");
    else grid.innerHTML = list.map(rowHTML).join("");

    $$(".viewswitch button").forEach((b) => b.classList.toggle("on", b.dataset.view === state.view));
    $$(".side-link").forEach((l) => {
      const n = l.dataset.nav;
      l.classList.toggle("active", n === state.nav || (n === "overview-all" && state.nav === "overview"));
    });
    $$(".topnav a").forEach((l) => l.classList.toggle("active", l.dataset.nav === "overview" && state.nav === "overview"));
    updateCounts();
    setupPreviews();
    setupLiveTiles();
  }

  function updateCounts() {
    $("#count-favs").textContent = state.favs.size;
    $("#count-hist").textContent = state.hist.length;
    $("#count-new").textContent = `+${APPS.filter((a) => a.isNew).length} màj`;
  }

  /* ---------- Aperçus iframe (chargés à la demande, mis à l'échelle) ---------- */
  const ro = new ResizeObserver((entries) => entries.forEach((e) => {
    const f = e.target.querySelector("iframe");
    if (f) f.style.setProperty("--s", e.contentRect.width / 1280);
  }));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const f = e.target.querySelector("iframe[data-src]");
    if (f) { f.src = f.dataset.src; f.removeAttribute("data-src"); }
    io.unobserve(e.target);
  }), { rootMargin: "200px" });
  function setupPreviews() {
    ro.disconnect();
    $$("#grid .preview").forEach((p) => { ro.observe(p); io.observe(p); });
  }

  /* ---------- Tuiles « live » : elles glissent comme sous Windows 8 ---------- */
  function setupLiveTiles() {
    flipTimers.forEach(clearTimeout);
    flipTimers = [];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    $$("#grid .tile").forEach((t, i) => {
      if (!t.querySelector(".face-b")) return;
      const loop = (first) => {
        flipTimers.push(setTimeout(() => {
          if (!t.matches(":hover")) t.classList.toggle("flip");
          loop(false);
        }, first ? 2500 + i * 900 : 4500 + Math.random() * 3500));
      };
      loop(true);
    });
  }

  /* ---------- Favoris / historique ---------- */
  function toggleFav(id) {
    state.favs.has(id) ? state.favs.delete(id) : state.favs.add(id);
    store.set("favs", [...state.favs]);
  }
  function pushHist(id) {
    state.hist = [id, ...state.hist.filter((x) => x !== id)].slice(0, 30);
    store.set("hist", state.hist);
    updateCounts();
  }

  /* ---------- Diaporama / visionneuse ---------- */
  let vList = [], vIdx = 0;
  function openViewer(id, list) {
    vList = list && list.length ? list : currentList();
    if (!vList.length) vList = APPS.slice();
    vIdx = Math.max(0, vList.findIndex((a) => a.id === id));
    $("#viewer").hidden = false;
    document.body.style.overflow = "hidden";
    $("#v-strip").innerHTML = vList.map((a, i) =>
      `<button data-i="${i}" style="--c:${a.color}"><span>${ico(a.icon)}</span>${esc(a.name)}</button>`).join("");
    showSlide();
  }
  function showSlide() {
    const a = vList[vIdx];
    if (!a) return;
    const v = $("#viewer");
    v.style.setProperty("--c", a.color);
    $("#v-dot").innerHTML = ico(a.icon);
    $("#v-name").textContent = a.name;
    $("#v-cat").textContent = `${catOf(a.cat).label} · ${a.tag || ""}`;
    $("#v-count").textContent = `${vIdx + 1} / ${vList.length}`;
    $("#v-open").href = a.url;
    $("#v-fav").classList.toggle("on", state.favs.has(a.id));
    $$("#v-strip button").forEach((b, i) => b.classList.toggle("on", i === vIdx));
    $("#v-strip button.on")?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });

    // Les sites externes refusent souvent l'intégration : on affiche une fiche à la place
    const frame = $("#v-iframe");
    const blocked = $("#v-blocked");
    if (a.mine && /netlify\.app/.test(a.url)) {
      blocked.hidden = true;
      frame.hidden = false;
      if (frame.src !== a.url) frame.src = a.url;
    } else {
      frame.hidden = true;
      frame.removeAttribute("src");
      blocked.hidden = false;
      $("#v-blocked-ico").innerHTML = ico(a.icon);
      $("#v-blocked-name").textContent = a.name;
      $("#v-blocked-desc").textContent = a.desc;
      $("#v-blocked-open").href = a.url;
    }
    pushHist(a.id);
  }
  function closeViewer() {
    $("#viewer").hidden = true;
    $("#v-iframe").removeAttribute("src");
    document.body.style.overflow = "";
    render();
  }
  const step = (d) => { vIdx = (vIdx + d + vList.length) % vList.length; showSlide(); };

  /* ---------- Hero ---------- */
  function renderHero() {
    const mine = APPS.filter((a) => a.mine).length;
    const pct = Math.round((mine / APPS.length) * 100);
    $("#hero-count").textContent = APPS.length;
    $("#hc-pct").textContent = pct + "%";
    $("#hc-text").textContent = `${mine} applications maison sur ${APPS.length} références`;
    $("#hc-mini").innerHTML = APPS.filter((a) => a.mine).map((a) =>
      `<span style="background:${a.color}" title="${esc(a.name)}">${ico(a.icon)}</span>`).join("");
    requestAnimationFrame(() => setTimeout(() => ($("#hc-bar").style.width = pct + "%"), 200));
  }

  /* ---------- Événements ---------- */
  document.addEventListener("click", (e) => {
    const t = e.target;

    const nav = t.closest("[data-nav]");
    if (nav) {
      e.preventDefault();
      const n = nav.dataset.nav;
      state.nav = n === "overview-all" ? "overview" : n;
      state.type = "all";
      $("#sidebar").classList.remove("open");
      render();
      if (n !== "overview" || nav.closest(".sidebar")) $("#catalogue").scrollIntoView({ behavior: "smooth" });
      return;
    }
    const open = t.closest("[data-open]");
    if (open) { e.preventDefault(); $("#" + open.dataset.open).hidden = false; return; }
    if (t.closest("[data-close]") || t.classList.contains("modal")) { $$(".modal").forEach((m) => (m.hidden = true)); return; }

    const tab = t.closest("[data-type]");
    if (tab) { state.type = tab.dataset.type; render(); return; }

    const vw = t.closest("[data-view]");
    if (vw && vw.closest(".viewswitch")) { state.view = vw.dataset.view; store.set("view", state.view); render(); return; }

    const fav = t.closest("[data-fav]");
    if (fav) { toggleFav(fav.dataset.fav); render(); return; }

    const visit = t.closest("[data-visit]");
    if (visit) { pushHist(visit.dataset.visit); return; }

    const va = t.closest("[data-view-app]");
    if (va) { openViewer(va.dataset.viewApp); return; }

    const tile = t.closest(".tile");
    if (tile) { openViewer(tile.dataset.id); return; }

    const sb = t.closest("#v-strip button");
    if (sb) { vIdx = +sb.dataset.i; showSlide(); return; }
  });

  $("#grid").addEventListener("keydown", (e) => {
    const tile = e.target.closest(".tile");
    if (tile && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openViewer(tile.dataset.id); }
  });

  $("#v-prev").onclick = () => step(-1);
  $("#v-next").onclick = () => step(1);
  $("#v-close").onclick = closeViewer;
  $("#v-fav").onclick = () => { toggleFav(vList[vIdx].id); $("#v-fav").classList.toggle("on", state.favs.has(vList[vIdx].id)); updateCounts(); };
  $("#hero-slideshow").onclick = () => openViewer(APPS[0].id, APPS.slice());

  $("#reset").onclick = (e) => {
    e.preventDefault();
    Object.assign(state, { nav: "overview", type: "all", q: "", sort: "cat" });
    $("#search").value = ""; $("#sort").value = "cat";
    render();
  };
  $("#sort").onchange = (e) => { state.sort = e.target.value; render(); };
  let qt;
  $("#search").addEventListener("input", (e) => {
    clearTimeout(qt);
    qt = setTimeout(() => {
      state.q = e.target.value;
      render();
      if (state.q) $("#catalogue").scrollIntoView({ behavior: "smooth" });
    }, 180);
  });
  $("#burger").onclick = () => $("#sidebar").classList.toggle("open");

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#search").focus(); return; }
    if (!$("#viewer").hidden) {
      if (e.key === "Escape") closeViewer();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      return;
    }
    if (e.key === "Escape") $$(".modal").forEach((m) => (m.hidden = true));
  });

  /* ---------- Init ---------- */
  renderSideCats();
  renderHero();
  render();
})();
