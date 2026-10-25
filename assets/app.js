/* =====================================================================
   Mif05 Réseaux — moteur du site (aucune dépendance, tout en JS natif)
   Tu n'as normalement PAS besoin de modifier ce fichier :
   le contenu (cours + questions) est dans le dossier data/.
   ===================================================================== */
(function () {
  "use strict";

  var C = window.COURS;
  var app = document.getElementById("app");

  /* ------------------------------------------------------------------ */
  /* Outils                                                              */
  /* ------------------------------------------------------------------ */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function norm(s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }
  function hashStr(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function stripTags(html) {
    return html.replace(/\[d(\d+)(?:-(\d+))?\]/g, "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  }
  function plural(n, w) { return n + " " + w + (n > 1 ? "s" : ""); }
  var LETTERS = ["A", "B", "C", "D", "E", "F"];

  /* ------------------------------------------------------------------ */
  /* Indexation des données                                              */
  /* ------------------------------------------------------------------ */
  var chapters = C.chapitres.slice().sort(function (a, b) { return a.num - b.num; });
  var chById = {}, secByKey = {}, allQ = [], qById = {};

  chapters.forEach(function (ch) {
    chById[ch.id] = ch;
    ch.sections.forEach(function (s, i) {
      s.ch = ch; s.idx = i; s.key = ch.id + "/" + s.id; s.questions = [];
      s.text = stripTags(s.html);
      secByKey[s.key] = s;
    });
    (ch.questions || []).forEach(function (q) {
      q.ch = ch;
      q.id = ch.id + "-" + hashStr(q.q);
      q.sec = secByKey[ch.id + "/" + q.s] || null;
      if (!q.sec) console.warn("[Mif05] Question sans section valide :", q.s, q.q);
      if (!q.r || q.r.length < 2) console.warn("[Mif05] Question avec moins de 2 réponses :", q.q);
      if (q.sec) q.sec.questions.push(q);
      allQ.push(q);
      qById[q.id] = q;
    });
  });

  /* ------------------------------------------------------------------ */
  /* Sauvegarde locale (progression)                                     */
  /* ------------------------------------------------------------------ */
  var KEY = "mif05.v1";
  var store = (function () {
    var d = { q: {}, lu: {}, setup: {} };
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s) for (var k in s) d[k] = s[k]; } catch (e) {}
    return d;
  })();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }
  function record(q, ok) {
    var r = store.q[q.id] || { n: 0, ok: 0 };
    r.n++; if (ok) r.ok++; r.last = ok ? 1 : 0; r.t = Date.now();
    store.q[q.id] = r; save();
  }
  function stat(qs) {
    var seen = 0, good = 0, bad = 0;
    qs.forEach(function (q) {
      var r = store.q[q.id];
      if (r) { seen++; if (r.last) good++; else bad++; }
    });
    return { total: qs.length, seen: seen, good: good, bad: bad, pct: qs.length ? Math.round(100 * good / qs.length) : 0 };
  }
  function wrongQs() { return allQ.filter(function (q) { var r = store.q[q.id]; return r && !r.last; }); }

  /* ------------------------------------------------------------------ */
  /* Diapos : numéro imprimé → document, page, image                     */
  /* ------------------------------------------------------------------ */
  function slide(n) {
    n = +n;
    for (var i = 0; i < C.docs.length; i++) {
      var d = C.docs[i];
      if (d.premiere && n >= d.premiere && n < d.premiere + d.nb) {
        var p = n - d.premiere + 1;
        return {
          n: n, doc: d, page: p,
          img: d.slides ? d.slides + "/" + p + ".webp" : null,
          thumb: d.slides ? d.slides + "/t/" + p + ".webp" : null,
          pdf: d.fichier + "#page=" + p,
          label: d.id.toUpperCase() + " · diapo " + n
        };
      }
    }
    return null;
  }
  function allSlides() {
    var out = [];
    C.docs.forEach(function (d) { if (d.slides) for (var p = 0; p < d.nb; p++) out.push(d.premiere + p); });
    return out;
  }
  function chip(a, b) {
    var lbl = b ? "diapos " + a + "–" + b : "diapo " + a;
    return '<button type="button" class="chip-d" data-d="' + a + '">' + lbl + "</button>";
  }
  function withChips(html) {
    return html.replace(/\[d(\d+)(?:-(\d+))?\]/g, function (m, a, b) { return chip(a, b); });
  }
  function wrapTables(root) {
    root.querySelectorAll(".content table").forEach(function (t) {
      if (t.parentNode.classList.contains("tbl")) return;
      var w = document.createElement("div"); w.className = "tbl";
      t.parentNode.insertBefore(w, t); w.appendChild(t);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Visionneuse                                                         */
  /* ------------------------------------------------------------------ */
  var V = {
    el: document.getElementById("viewer"), img: document.getElementById("vImg"),
    title: document.getElementById("vTitle"), count: document.getElementById("vCount"),
    pdf: document.getElementById("vPdf"), stage: document.getElementById("vStage"),
    list: allSlides(), cur: null, open: false
  };
  function viewerShow(n) {
    var s = slide(n);
    if (!s || !s.img) { if (s) window.open(s.pdf, "_blank"); return; }
    V.cur = s.n;
    V.img.src = s.img;
    V.img.alt = s.label;
    V.title.textContent = s.label;
    V.pdf.href = s.pdf;
    var idx = V.list.indexOf(s.n);
    V.count.textContent = s.doc.id.toUpperCase() + " · " + s.page + " / " + s.doc.nb;
    document.getElementById("vPrev").disabled = idx <= 0;
    document.getElementById("vNext").disabled = idx >= V.list.length - 1;
    V.stage.scrollTop = 0; V.stage.scrollLeft = 0;
    // précharge les voisines
    [V.list[idx - 1], V.list[idx + 1]].forEach(function (k) { if (k) { var t = slide(k); if (t && t.img) (new Image()).src = t.img; } });
  }
  function viewerOpen(n) {
    viewerShow(n);
    if (!V.open) {
      V.open = true;
      V.el.hidden = false;
      document.body.style.overflow = "hidden";
      history.pushState({ viewer: 1 }, "", location.href);
    }
  }
  function viewerHide() {
    V.open = false; V.el.hidden = true; V.el.classList.remove("zoom");
    document.body.style.overflow = "";
  }
  function viewerStep(d) {
    var idx = V.list.indexOf(V.cur) + d;
    if (idx >= 0 && idx < V.list.length) { V.el.classList.remove("zoom"); viewerShow(V.list[idx]); }
  }
  window.addEventListener("popstate", function () { if (V.open) viewerHide(); });
  document.getElementById("vClose").onclick = function () { history.back(); };
  document.getElementById("vPrev").onclick = function () { viewerStep(-1); };
  document.getElementById("vNext").onclick = function () { viewerStep(1); };
  document.getElementById("vZoom").onclick = function () { V.el.classList.toggle("zoom"); };
  (function () {
    var x0 = null, y0 = null, lastTap = 0;
    V.stage.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) { x0 = null; return; }
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    V.stage.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var t = e.changedTouches[0], dx = t.clientX - x0, dy = t.clientY - y0;
      var now = Date.now();
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        if (now - lastTap < 320) { V.el.classList.toggle("zoom"); lastTap = 0; } else lastTap = now;
      } else if (!V.el.classList.contains("zoom") && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        viewerStep(dx < 0 ? 1 : -1);
      }
      x0 = null;
    });
    V.img.addEventListener("dblclick", function () { V.el.classList.toggle("zoom"); });
    document.addEventListener("keydown", function (e) {
      if (!V.open) return;
      if (e.key === "ArrowRight") viewerStep(1);
      else if (e.key === "ArrowLeft") viewerStep(-1);
      else if (e.key === "Escape") history.back();
    });
  })();

  /* clic sur n'importe quel bouton data-d → ouvre la diapo */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-d]");
    if (b) { e.preventDefault(); viewerOpen(b.getAttribute("data-d")); }
  });

  /* ------------------------------------------------------------------ */
  /* Thème                                                               */
  /* ------------------------------------------------------------------ */
  document.getElementById("themeBtn").onclick = function () {
    var root = document.documentElement;
    var cur = root.getAttribute("data-theme");
    var sysDark = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = cur ? cur === "dark" : sysDark;
    var next = isDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("mif05.theme", next); } catch (e) {}
  };

  /* ------------------------------------------------------------------ */
  /* QCM : état                                                          */
  /* ------------------------------------------------------------------ */
  var QKEY = "mif05.quiz";
  var quiz = (function () {
    try {
      var z = JSON.parse(localStorage.getItem(QKEY));
      // si une question a été modifiée/supprimée depuis, on abandonne ce QCM sauvegardé
      if (z && z.ids && z.ids.length && z.ids.every(function (id) { return qById[id]; })) return z;
    } catch (e) {}
    return null;
  })();
  function saveQuiz() { try { if (quiz) localStorage.setItem(QKEY, JSON.stringify(quiz)); else localStorage.removeItem(QKEY); } catch (e) {} }

  /* replace = true : on remplace l'entrée d'historique (le bouton « retour » ne relance pas le QCM) */
  function startQuiz(qs, opts, replace) {
    if (!qs.length) return;
    qs = shuffle(qs);
    if (opts.n && opts.n < qs.length) qs = qs.slice(0, opts.n);
    quiz = {
      ids: qs.map(function (q) { return q.id; }),
      orders: qs.map(function (q) { return shuffle(q.r.map(function (_, i) { return i; })); }),
      answers: qs.map(function () { return null; }),
      i: 0, sel: null,
      mode: opts.mode || "train",
      penalty: opts.penalty || 0,
      title: opts.title || "QCM",
      done: false
    };
    saveQuiz();
    if (replace) replaceTo("#/qcm/jeu"); else go("#/qcm/jeu");
  }
  function replaceTo(h) { history.replaceState(null, "", h); render(); }
  function quizPoints(z) {
    var ok = 0, ko = 0, sk = 0;
    z.answers.forEach(function (a) { if (a === null || a === "skip") sk++; else if (a === 0) ok++; else ko++; });
    var pts = z.mode === "exam" ? ok - z.penalty * ko : ok;
    var n = z.ids.length;
    return { ok: ok, ko: ko, sk: sk, n: n, pts: pts, note: Math.max(0, pts) / n * 20 };
  }

  /* ------------------------------------------------------------------ */
  /* Routeur                                                             */
  /* ------------------------------------------------------------------ */
  function go(h) { if (location.hash === h) render(); else location.hash = h; }
  function parseQuery(s) {
    var o = {};
    (s || "").split("&").forEach(function (p) { if (!p) return; var kv = p.split("="); o[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1] || ""); });
    return o;
  }
  var routes = [
    [/^\/?$/, viewHome, "home"],
    [/^\/cours$/, viewCours, "cours"],
    [/^\/cours\/([\w-]+)$/, viewChapter, "cours"],
    [/^\/cours\/([\w-]+)\/([\w-]+)$/, viewSection, "cours"],
    [/^\/qcm$/, viewQcmSetup, "qcm"],
    [/^\/qcm\/go$/, viewQcmGo, "qcm"],
    [/^\/qcm\/jeu$/, viewQcmRun, "qcm"],
    [/^\/qcm\/resultat$/, viewQcmResult, "qcm"],
    [/^\/diapos$/, viewDocs, "diapos"],
    [/^\/diapos\/([\w-]+)$/, viewDoc, "diapos"]
  ];
  function render() {
    if (V.open) viewerHide();
    var h = location.hash.replace(/^#/, "") || "/";
    var parts = h.split("?"), path = parts[0], query = parseQuery(parts[1]);
    var tab = "home", found = false;
    for (var i = 0; i < routes.length; i++) {
      var m = path.match(routes[i][0]);
      if (m) { tab = routes[i][2]; found = true; routes[i][1].apply(null, m.slice(1).concat([query])); break; }
    }
    if (!found) viewHome();
    document.querySelectorAll(".nav a").forEach(function (a) { a.classList.toggle("on", a.getAttribute("data-tab") === tab); });
    // bouton flottant « retour au QCM »
    var old = document.getElementById("backquiz"); if (old) old.remove();
    if (quiz && !quiz.done && path.indexOf("/qcm") !== 0) {
      var b = document.createElement("a");
      b.id = "backquiz"; b.className = "backquiz"; b.href = "#/qcm/jeu";
      b.textContent = "↩ Revenir au QCM (" + (quiz.i + 1) + "/" + quiz.ids.length + ")";
      document.body.appendChild(b);
    }
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", render);

  /* ------------------------------------------------------------------ */
  /* Vue : Accueil                                                       */
  /* ------------------------------------------------------------------ */
  function viewHome() {
    var st = stat(allQ);
    var nbWrong = st.bad;
    var h = "";
    h += '<section class="card hero">';
    h += '<div class="layers" aria-hidden="true">' + chapters.map(function (c, i) { return '<i style="background:' + c.couleur + ";width:" + (56 - i * 9) + 'px;margin-left:auto"></i>'; }).join("") + "</div>";
    h += "<h1>" + esc(C.ue) + "</h1><p>" + esc(C.sousTitre) + "</p>";
    h += '<div class="stats">';
    h += '<div class="stat"><b>' + allQ.length + "</b><span>questions</span></div>";
    h += '<div class="stat"><b>' + st.seen + "</b><span>déjà vues</span></div>";
    h += '<div class="stat"><b>' + st.pct + " %</b><span>maîtrisées</span></div>";
    h += "</div></section>";

    if (quiz && !quiz.done) {
      h += '<a class="card resume" href="#/qcm/jeu" style="margin-top:12px"><span class="grow"><b>Reprendre le QCM en cours</b><br><span class="small muted">' + esc(quiz.title) + " · question " + (quiz.i + 1) + "/" + quiz.ids.length + '</span></span><span aria-hidden="true">→</span></a>';
    }

    h += '<div class="btns two" style="margin-top:12px">';
    h += '<a class="btn primary" href="#/qcm">Lancer un QCM</a>';
    h += '<a class="btn" href="#/qcm/go?f=erreurs"' + (nbWrong ? "" : " disabled") + ">Mes erreurs (" + nbWrong + ")</a>";
    h += "</div>";

    h += '<h2 class="h-sec">Chapitres</h2><div class="stack">';
    chapters.forEach(function (ch) {
      var s = stat(ch.questions), lus = ch.sections.filter(function (x) { return store.lu[x.key]; }).length;
      h += '<a class="card chcard" style="--c:' + ch.couleur + '" href="#/cours/' + ch.id + '">';
      h += '<div class="num">CHAPITRE ' + ch.num + " · " + esc(ch.source) + "</div>";
      h += "<h3>" + esc(ch.titre) + "</h3><p>" + esc(ch.resume) + "</p>";
      h += '<div class="bar"><i style="width:' + s.pct + '%"></i></div>';
      h += '<div class="meta"><span>' + lus + "/" + ch.sections.length + " sections lues</span><span>" + s.good + "/" + s.total + " questions réussies</span></div>";
      h += "</a>";
    });
    h += "</div>";

    // infos UE
    var I = C.infos;
    if (I) {
      h += '<h2 class="h-sec">L\'UE</h2>';
      h += '<details class="card infos"><summary>Évaluation, barème du QCM et planning</summary><div class="in">';
      h += "<b>Évaluation</b><ul>" + I.evaluation.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      h += "<b>Barème des QCM</b><ul>" + I.bareme.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
      h += '<b>Planning</b><table class="plan">' + I.planning.map(function (r) { return "<tr><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + "</td></tr>"; }).join("") + "</table>";
      h += '<p class="small muted" style="margin-top:10px">Source : CM1, ' + chip(3, 7) + "</p>";
      h += "</div></details>";
    }
    h += '<p class="foot">Progression enregistrée sur cet appareil · ' + plural(allQ.length, "question") + " · " + plural(chapters.length, "chapitre") + "</p>";
    app.innerHTML = h;
  }

  /* ------------------------------------------------------------------ */
  /* Vue : liste des cours + recherche                                   */
  /* ------------------------------------------------------------------ */
  function viewCours(query) {
    var h = '<h1 class="h-page">Cours</h1>';
    h += '<label class="card search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
    h += '<input id="q" type="search" placeholder="Rechercher : TTL, socket, Dijkstra…" autocomplete="off" value="' + esc(query.q || "") + '"></label>';
    h += '<div id="results"></div><div id="toc">';
    chapters.forEach(function (ch) {
      h += '<h2 class="h-sec" style="color:' + ch.couleur + '">' + ch.num + ". " + esc(ch.titre) + "</h2>";
      h += '<ul class="card seclist" style="--c:' + ch.couleur + '">' + secItems(ch) + "</ul>";
    });
    h += "</div>";
    app.innerHTML = h;
    var inp = document.getElementById("q");
    inp.addEventListener("input", function () { doSearch(inp.value); });
    if (query.q) doSearch(query.q);
  }
  function secItems(ch) {
    return ch.sections.map(function (s, i) {
      var d = s.diapos && s.diapos.length ? (s.diapos.length > 1 ? "diapos " + s.diapos[0] + "–" + s.diapos[s.diapos.length - 1] : "diapo " + s.diapos[0]) : "";
      return '<li><a href="#/cours/' + ch.id + "/" + s.id + '"><span class="n">' + ch.num + "." + (i + 1) + '</span><span class="grow"><div class="t">' + esc(s.titre) + '</div><div class="d">' + d + " · " + plural(s.questions.length, "question") + "</div></span>" + (store.lu[s.key] ? '<span class="chk" title="Lue">✓</span>' : "") + "</a></li>";
    }).join("");
  }
  function doSearch(raw) {
    var res = document.getElementById("results"), toc = document.getElementById("toc");
    var terms = norm(raw).split(/\s+/).filter(function (t) { return t.length > 1; });
    if (!terms.length) { res.innerHTML = ""; toc.classList.remove("hidden"); return; }
    toc.classList.add("hidden");
    var hits = [];
    chapters.forEach(function (ch) {
      ch.sections.forEach(function (s) {
        var hay = norm(s.titre + " " + s.text);
        if (terms.every(function (t) { return hay.indexOf(t) >= 0; })) hits.push(s);
      });
    });
    var qn = allQ.filter(function (q) { var hay = norm(q.q + " " + q.r[0] + " " + q.e); return terms.every(function (t) { return hay.indexOf(t) >= 0; }); });
    var h = "";
    if (!hits.length) h += '<div class="card empty">Aucune section ne contient « ' + esc(raw) + " ».</div>";
    else {
      h += '<div class="card">' + hits.map(function (s) {
        var nt = norm(s.text), pos = nt.indexOf(terms[0]);
        var a = Math.max(0, pos - 60), snippet = s.text.substr(a, 170);
        var snipEsc = esc((a > 0 ? "…" : "") + snippet + "…");
        terms.forEach(function (t) {
          try {
            var pat = t.split("").map(function (c) { return c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\u0300-\\u036f]?"; }).join("");
            snipEsc = snipEsc.normalize("NFD").replace(new RegExp("(" + pat + ")", "gi"), "<mark>$1</mark>").normalize("NFC");
          } catch (e) {}
        });
        return '<a class="hit" href="#/cours/' + s.ch.id + "/" + s.id + '"><div class="t"><span class="dot" style="background:' + s.ch.couleur + '"></span> ' + esc(s.titre) + '</div><div class="x">' + snipEsc + "</div></a>";
      }).join("") + "</div>";
    }
    if (qn.length) {
      h += '<a class="btn block" style="margin-top:12px" href="#/qcm/go?f=recherche&q=' + encodeURIComponent(raw) + '">S\'entraîner sur ' + plural(qn.length, "question") + " liée" + (qn.length > 1 ? "s" : "") + "</a>";
    }
    res.innerHTML = h;
  }

  /* ------------------------------------------------------------------ */
  /* Vue : chapitre                                                      */
  /* ------------------------------------------------------------------ */
  function viewChapter(id) {
    var ch = chById[id]; if (!ch) return go("#/cours");
    var s = stat(ch.questions);
    var h = '<div class="crumbs"><a href="#/cours">Cours</a> › Chapitre ' + ch.num + "</div>";
    h += '<section class="card chhead" style="--c:' + ch.couleur + '"><div class="src">' + esc(ch.source) + "</div><h1>" + esc(ch.titre) + "</h1><p>" + esc(ch.resume) + "</p></section>";
    h += '<h2 class="h-sec">Sections</h2><ul class="card seclist" style="--c:' + ch.couleur + '">' + secItems(ch) + "</ul>";
    h += '<h2 class="h-sec">S\'entraîner</h2><div class="card pad"><div class="row"><div class="grow"><b>QCM du chapitre</b><div class="small muted">' + plural(ch.questions.length, "question") + " · " + s.good + " réussie" + (s.good > 1 ? "s" : "") + "</div></div></div>";
    h += '<div class="bar" style="margin:10px 0 14px;--c:' + ch.couleur + '"><i style="width:' + s.pct + "%;background:" + ch.couleur + '"></i></div>';
    h += '<div class="btns two"><a class="btn primary" href="#/qcm/go?ch=' + ch.id + '">Tout le chapitre</a><a class="btn" href="#/qcm/go?ch=' + ch.id + '&n=10">10 au hasard</a></div></div>';
    app.innerHTML = h;
  }

  /* ------------------------------------------------------------------ */
  /* Vue : section de cours                                              */
  /* ------------------------------------------------------------------ */
  function viewSection(cid, sid) {
    var ch = chById[cid], s = ch && secByKey[cid + "/" + sid];
    if (!s) return go("#/cours");
    store.lu[s.key] = 1; save();
    var h = '<div class="crumbs"><a href="#/cours">Cours</a> › <a href="#/cours/' + ch.id + '">' + esc(ch.court || ch.titre) + "</a> › " + ch.num + "." + (s.idx + 1) + "</div>";
    h += '<article class="card content" style="border-top:4px solid ' + ch.couleur + '"><h1>' + esc(s.titre) + "</h1>" + withChips(s.html) + "</article>";

    if (s.diapos && s.diapos.length) {
      h += '<h2 class="h-sec">Les diapos du CM</h2><div class="strip">';
      s.diapos.forEach(function (n) {
        var sl = slide(n); if (!sl || !sl.thumb) return;
        h += '<button type="button" data-d="' + n + '" aria-label="' + esc(sl.label) + '"><img loading="lazy" src="' + sl.thumb + '" alt=""><span>' + n + "</span></button>";
      });
      h += "</div>";
    }

    h += '<h2 class="h-sec">Vidéos pour mieux comprendre</h2><div class="vids">';
    (s.videos || []).forEach(function (v) {
      h += '<a class="card vid" href="' + esc(v.u) + '" target="_blank" rel="noopener"><span class="play"></span><span class="grow"><div class="t">' + esc(v.t) + '</div><div class="l">' + (v.l === "FR" ? "🇫🇷 FRANÇAIS" : "🇬🇧 ANGLAIS (sous-titres auto possibles)") + "</div></span></a>";
    });
    if (s.recherche) {
      h += '<a class="card vid search" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(s.recherche) + '" target="_blank" rel="noopener"><span class="play">🔎</span><span class="grow"><div class="t">Chercher d\'autres vidéos sur YouTube</div><div class="l">« ' + esc(s.recherche) + " »</div></span></a>";
    }
    h += "</div>";

    if (s.questions.length) {
      h += '<a class="btn primary block" style="margin-top:18px" href="#/qcm/go?ch=' + ch.id + "&s=" + s.id + '">S\'entraîner sur cette section (' + plural(s.questions.length, "question") + ")</a>";
    }

    // précédent / suivant (à travers les chapitres)
    var flat = []; chapters.forEach(function (c) { c.sections.forEach(function (x) { flat.push(x); }); });
    var k = flat.indexOf(s), prev = flat[k - 1], next = flat[k + 1];
    h += '<nav class="pager">';
    h += prev ? '<a class="card prev" href="#/cours/' + prev.ch.id + "/" + prev.id + '"><small>← Précédent</small>' + esc(prev.titre) + "</a>" : "<span></span>";
    h += next ? '<a class="card next" href="#/cours/' + next.ch.id + "/" + next.id + '"><small>Suivant →</small>' + esc(next.titre) + "</a>" : "<span></span>";
    h += "</nav>";
    app.innerHTML = h;
    wrapTables(app);
  }

  /* ------------------------------------------------------------------ */
  /* Vue : réglages du QCM                                               */
  /* ------------------------------------------------------------------ */
  function viewQcmSetup() {
    var S = store.setup;
    if (!S.chs) S.chs = chapters.map(function (c) { return c.id; });
    S.chs = S.chs.filter(function (id) { return chById[id]; });
    if (!S.chs.length) S.chs = chapters.map(function (c) { return c.id; });
    if (!S.n) S.n = 20;
    if (!S.f) S.f = "toutes";
    if (!S.mode) S.mode = "train";
    if (S.pen === undefined) S.pen = 0.5;

    function pool() {
      return allQ.filter(function (q) {
        if (S.chs.indexOf(q.ch.id) < 0) return false;
        var r = store.q[q.id];
        if (S.f === "nouvelles") return !r;
        if (S.f === "erreurs") return r && !r.last;
        return true;
      });
    }
    function draw() {
      var p = pool(), n = S.n === "all" ? p.length : Math.min(S.n, p.length);
      var h = '<h1 class="h-page">QCM</h1><p class="muted" style="margin:0">Comme au contrôle : <b>une seule bonne réponse</b> par question. L\'ordre des réponses change à chaque fois.</p>';
      h += '<div class="card pad" style="margin-top:14px">';

      h += '<div class="field" style="margin-top:0"><span class="lbl">Chapitres</span><div class="chips">';
      chapters.forEach(function (c) {
        var on = S.chs.indexOf(c.id) >= 0;
        h += '<button class="chipsel" data-ch="' + c.id + '" style="--c:' + c.couleur + '" aria-pressed="' + on + '"><span class="dot" style="background:' + c.couleur + '"></span>' + esc(c.court || c.titre) + " <small>" + c.questions.length + "</small></button>";
      });
      h += "</div></div>";

      h += '<div class="field"><span class="lbl">Nombre de questions</span><div class="seg" data-k="n">' +
        [10, 20, 40, "all"].map(function (v) { return '<button data-v="' + v + '" aria-pressed="' + (String(S.n) === String(v)) + '">' + (v === "all" ? "Toutes" : v) + "</button>"; }).join("") + "</div></div>";

      h += '<div class="field"><span class="lbl">Quelles questions ?</span><div class="seg" data-k="f">' +
        [["toutes", "Toutes"], ["nouvelles", "Jamais vues"], ["erreurs", "Mes erreurs"]].map(function (v) { return '<button data-v="' + v[0] + '" aria-pressed="' + (S.f === v[0]) + '">' + v[1] + "</button>"; }).join("") + "</div></div>";

      h += '<div class="field"><span class="lbl">Mode</span><div class="seg" data-k="mode">' +
        [["train", "Entraînement"], ["exam", "Examen"]].map(function (v) { return '<button data-v="' + v[0] + '" aria-pressed="' + (S.mode === v[0]) + '">' + v[1] + "</button>"; }).join("") + "</div>";
      h += '<div class="help">' + (S.mode === "train" ? "Correction et explication juste après chaque réponse." : "Pas de correction avant la fin, comme le vrai contrôle. Tu peux passer une question (0 pt).") + "</div></div>";

      if (S.mode === "exam") {
        h += '<div class="field"><span class="lbl">Réponse fausse</span><div class="seg" data-k="pen">' +
          [[0, "0 pt"], [0.5, "−0,5 pt"], [1, "−1 pt"]].map(function (v) { return '<button data-v="' + v[0] + '" aria-pressed="' + (S.pen === v[0]) + '">' + v[1] + "</button>"; }).join("") + "</div>";
        h += '<div class="help">Barème du CM : juste +1, pas de réponse 0, faux 0 / −0,5 / −1 selon le contrôle.</div></div>';
      }

      h += '<button class="btn primary block" id="start" style="margin-top:20px"' + (n ? "" : " disabled") + ">" + (n ? "Lancer · " + plural(n, "question") : "Aucune question avec ces filtres") + "</button>";
      h += "</div>";
      app.innerHTML = h;

      app.querySelectorAll("[data-ch]").forEach(function (b) {
        b.onclick = function () {
          var id = b.getAttribute("data-ch"), i = S.chs.indexOf(id);
          if (i >= 0) { if (S.chs.length > 1) S.chs.splice(i, 1); } else S.chs.push(id);
          save(); draw();
        };
      });
      app.querySelectorAll(".seg").forEach(function (g) {
        var k = g.getAttribute("data-k");
        g.querySelectorAll("button").forEach(function (b) {
          b.onclick = function () {
            var v = b.getAttribute("data-v");
            S[k] = (k === "n" && v !== "all") || k === "pen" ? +v : v;
            save(); draw();
          };
        });
      });
      document.getElementById("start").onclick = function () {
        var names = S.chs.length === chapters.length ? "Tous les chapitres" : S.chs.map(function (id) { return chById[id].court; }).join(", ");
        startQuiz(pool(), { n: S.n === "all" ? 0 : S.n, mode: S.mode, penalty: S.mode === "exam" ? S.pen : 0, title: names + (S.f === "erreurs" ? " · erreurs" : S.f === "nouvelles" ? " · nouvelles" : "") });
      };
    }
    draw();
  }

  /* lancement direct d'un QCM depuis un lien : #/qcm/go?ch=transport&s=udp&n=10  ou  ?f=erreurs */
  function viewQcmGo(query) {
    var qs = allQ, title = "QCM";
    if (query.f === "erreurs") { qs = wrongQs(); title = "Mes erreurs"; }
    else if (query.f === "recherche") {
      var terms = norm(query.q || "").split(/\s+/).filter(function (t) { return t.length > 1; });
      qs = allQ.filter(function (q) { var hay = norm(q.q + " " + q.r[0] + " " + q.e); return terms.every(function (t) { return hay.indexOf(t) >= 0; }); });
      title = "Recherche « " + (query.q || "") + " »";
    }
    if (query.ch && chById[query.ch]) {
      var ch = chById[query.ch];
      qs = ch.questions; title = ch.court || ch.titre;
      if (query.s && secByKey[ch.id + "/" + query.s]) { var s = secByKey[ch.id + "/" + query.s]; qs = s.questions; title = s.titre; }
    }
    if (!qs.length) { app.innerHTML = '<div class="card empty">Aucune question ici pour l\'instant 🎉<br><a href="#/qcm">Retour aux QCM</a></div>'; return; }
    startQuiz(qs, { n: +query.n || 0, mode: "train", title: title }, true);
  }

  /* ------------------------------------------------------------------ */
  /* Vue : une question                                                  */
  /* ------------------------------------------------------------------ */
  function whereBlock(q) {
    var sl = slide(q.d), h = '<div class="where"><div class="lbl">📍 Où trouver la réponse</div><div class="links">';
    if (sl) {
      h += '<button type="button" class="linkpill" data-d="' + q.d + '">📄 ' + esc(sl.label) + "</button>";
      h += '<a class="linkpill" href="' + sl.pdf + '" target="_blank" rel="noopener">PDF ' + sl.doc.id.toUpperCase() + " p." + sl.page + "</a>";
    }
    if (q.sec) h += '<a class="linkpill" href="#/cours/' + q.ch.id + "/" + q.sec.id + '">📖 Cours ' + q.ch.num + "." + (q.sec.idx + 1) + " · " + esc(q.sec.titre) + "</a>";
    h += "</div>";
    if (sl && sl.img) h += '<button type="button" class="slide-inline" data-d="' + q.d + '" aria-label="Agrandir la ' + esc(sl.label) + '"><img loading="lazy" src="' + sl.img + '" alt="' + esc(sl.label) + '"></button>';
    return h + "</div>";
  }

  function viewQcmRun() {
    if (!quiz) return go("#/qcm");
    if (quiz.done || quiz.i >= quiz.ids.length) { quiz.done = true; saveQuiz(); return replaceTo("#/qcm/resultat"); }
    var i = quiz.i, q = qById[quiz.ids[i]], order = quiz.orders[i], ans = quiz.answers[i];
    var train = quiz.mode === "train", answered = ans !== null;
    var n = quiz.ids.length;

    var h = '<div class="qtop"><span class="count">' + (i + 1) + "/" + n + '</span><div class="bar grow"><i style="width:' + Math.round(100 * i / n) + '%"></i></div><button class="btn ghost" id="quit" style="min-height:36px;padding:6px 10px">Quitter</button></div>';
    h += '<article class="card qcard"><div class="row" style="flex-wrap:wrap;gap:6px"><span class="tag"><span class="dot" style="background:' + q.ch.couleur + '"></span>' + esc(q.ch.court || q.ch.titre) + "</span>" + (q.sec ? '<span class="tag wrap">' + esc(q.sec.titre) + "</span>" : "") + (quiz.mode === "exam" ? '<span class="tag">Examen</span>' : "") + "</div>";
    h += '<div class="qtext">' + esc(q.q) + "</div>";
    h += '<div class="choices' + (answered && train ? " locked" : "") + '">';
    order.forEach(function (ri, k) {
      var cls = "choice";
      if (train && answered) {
        if (ri === 0) cls += " good";
        else if (ri === ans) cls += " bad";
        else cls += " dim";
      } else if (!train && quiz.sel === ri) cls += " sel";
      h += '<button class="' + cls + '" data-ri="' + ri + '"><span class="k">' + LETTERS[k] + "</span><span>" + esc(q.r[ri]) + "</span></button>";
    });
    h += "</div>";

    if (train && answered) {
      var ok = ans === 0;
      h += '<div class="feedback ' + (ok ? "ok" : "ko") + '"><div class="verdict">' + (ok ? "✓ Bonne réponse !" : "✗ Raté — la bonne réponse : " + esc(q.r[0])) + "</div>";
      h += '<p class="expl">' + esc(q.e) + "</p>" + whereBlock(q) + "</div>";
    }
    h += "</article>";

    if (train) {
      h += '<div class="stickybar">' + (answered ? '<button class="btn primary block" id="next">' + (i + 1 < n ? "Question suivante →" : "Voir mon résultat") + "</button>" : "") + "</div>";
    } else {
      h += '<div class="stickybar two"><button class="btn" id="skip">Je ne sais pas</button><button class="btn primary" id="valid"' + (quiz.sel === null ? " disabled" : "") + ">" + (i + 1 < n ? "Valider →" : "Valider et terminer") + "</button></div>";
    }
    app.innerHTML = h;

    app.querySelectorAll(".choice").forEach(function (b) {
      b.onclick = function () {
        var ri = +b.getAttribute("data-ri");
        if (train) {
          if (quiz.answers[i] !== null) return;
          quiz.answers[i] = ri; record(q, ri === 0); saveQuiz(); viewQcmRun();
          var fb = app.querySelector(".feedback"); if (fb) fb.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
          quiz.sel = ri; saveQuiz(); viewQcmRun();
        }
      };
    });
    var next = document.getElementById("next");
    if (next) next.onclick = function () { quiz.i++; saveQuiz(); viewQcmRun(); window.scrollTo(0, 0); };
    var valid = document.getElementById("valid");
    if (valid) valid.onclick = function () {
      if (quiz.sel === null) return;
      quiz.answers[i] = quiz.sel; record(q, quiz.sel === 0); quiz.sel = null; quiz.i++; saveQuiz(); viewQcmRun(); window.scrollTo(0, 0);
    };
    var skip = document.getElementById("skip");
    if (skip) skip.onclick = function () {
      quiz.answers[i] = "skip"; record(q, false); quiz.sel = null; quiz.i++; saveQuiz(); viewQcmRun(); window.scrollTo(0, 0);
    };
    document.getElementById("quit").onclick = function () {
      if (confirm("Quitter ce QCM ? Tes réponses déjà données restent comptées dans ta progression.")) { quiz = null; saveQuiz(); go("#/qcm"); }
    };
  }
  /* raccourcis clavier (ordinateur) : 1-4 ou A-D pour répondre, Entrée pour continuer */
  document.addEventListener("keydown", function (e) {
    if (V.open || !/^#\/qcm\/jeu/.test(location.hash) || e.target.tagName === "INPUT") return;
    var k = e.key.toUpperCase(), idx = "1234".indexOf(k) >= 0 ? "1234".indexOf(k) : "ABCD".indexOf(k);
    var btns = app.querySelectorAll(".choice");
    if (idx >= 0 && btns[idx]) { btns[idx].click(); return; }
    if (e.key === "Enter") { var b = document.getElementById("next") || document.getElementById("valid"); if (b && !b.disabled) b.click(); }
  });

  /* ------------------------------------------------------------------ */
  /* Vue : résultat                                                      */
  /* ------------------------------------------------------------------ */
  function viewQcmResult() {
    if (!quiz) return go("#/qcm");
    if (!quiz.done) return replaceTo("#/qcm/jeu");
    var z = quiz, P = quizPoints(z);
    var pct = Math.round(100 * P.ok / P.n);
    var col = pct >= 75 ? "var(--ok)" : pct >= 50 ? "var(--warn)" : "var(--ko)";
    var R = 52, L = 2 * Math.PI * R;
    var h = '<h1 class="h-page">Résultat</h1><p class="muted" style="margin:0 0 12px">' + esc(z.title) + " · " + (z.mode === "exam" ? "mode examen" : "entraînement") + "</p>";
    h += '<section class="card score"><div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="' + R + '" fill="none" stroke="var(--bg2)" stroke-width="12"/><circle cx="60" cy="60" r="' + R + '" fill="none" stroke="' + col + '" stroke-width="12" stroke-linecap="round" stroke-dasharray="' + L + '" stroke-dashoffset="' + (L * (1 - pct / 100)) + '"/></svg><b>' + pct + "%</b></div>";
    h += '<div class="big">' + (Math.round(P.note * 10) / 10).toString().replace(".", ",") + '<span style="font-size:1.2rem;color:var(--ink3)"> /20</span></div>';
    h += '<div class="sub">' + P.ok + " juste" + (P.ok > 1 ? "s" : "") + " · " + P.ko + " faux" + (P.sk ? " · " + P.sk + " sans réponse" : "") + (z.mode === "exam" && z.penalty ? " · faux = −" + String(z.penalty).replace(".", ",") : "") + "</div></section>";

    var wrongIdx = [];
    z.ids.forEach(function (id, k) { if (z.answers[k] !== 0) wrongIdx.push(k); });
    h += '<div class="btns two" style="margin-top:12px">';
    h += '<button class="btn primary" id="redo"' + (wrongIdx.length ? "" : " disabled") + ">Refaire mes " + wrongIdx.length + " erreur" + (wrongIdx.length > 1 ? "s" : "") + "</button>";
    h += '<a class="btn" href="#/qcm">Nouveau QCM</a></div>';

    h += '<h2 class="h-sec">Correction détaillée</h2><ul class="card rlist">';
    z.ids.forEach(function (id, k) {
      var q = qById[id], a = z.answers[k], ok = a === 0, sk = a === null || a === "skip";
      h += '<li><details' + (ok ? "" : " open") + '><summary><span class="ic ' + (ok ? "ok" : sk ? "sk" : "ko") + '">' + (ok ? "✓" : sk ? "–" : "✗") + '</span><span class="grow"><b>' + (k + 1) + ".</b> " + esc(q.q) + "</span></summary><div class=\"body\">";
      if (!ok && !sk) h += '<div class="ans bad">Ta réponse : ' + esc(q.r[a]) + "</div>";
      if (sk) h += '<div class="ans muted">Pas de réponse</div>';
      h += '<div class="ans good">✓ ' + esc(q.r[0]) + "</div>";
      h += '<p style="margin:8px 0 0">' + esc(q.e) + "</p>" + whereBlock(q) + "</div></details></li>";
    });
    h += "</ul>";
    app.innerHTML = h;
    document.getElementById("redo").onclick = function () {
      var qs = wrongIdx.map(function (k) { return qById[z.ids[k]]; });
      startQuiz(qs, { mode: z.mode, penalty: z.penalty, title: z.title.replace(/ · erreurs$/, "") + " · erreurs" }, true);
    };
  }

  /* ------------------------------------------------------------------ */
  /* Vue : documents (PDF + diapos)                                      */
  /* ------------------------------------------------------------------ */
  function viewDocs() {
    var h = '<h1 class="h-page">Diapos & PDF</h1><p class="muted" style="margin:0 0 14px">Les CM de l\'UE. Touche une diapo pour l\'ouvrir en grand, glisse pour passer à la suivante.</p><div class="stack">';
    C.docs.forEach(function (d) {
      var last = d.premiere ? d.premiere + d.nb - 1 : null;
      h += '<div class="card doc"><span class="tag">' + esc(d.type) + "</span><h3 style=\"margin-top:8px\">" + esc(d.titre) + '</h3><div class="small muted">' + d.nb + " pages" + (last ? " · diapos " + d.premiere + " à " + last : "") + "</div>";
      h += '<div class="btns two" style="margin-top:12px">';
      h += '<a class="btn" href="' + esc(d.fichier) + '" target="_blank" rel="noopener">Ouvrir le PDF</a>';
      h += d.slides ? '<a class="btn primary" href="#/diapos/' + d.id + '">Parcourir les diapos</a>' : "<span></span>";
      h += "</div></div>";
    });
    h += "</div>";
    app.innerHTML = h;
  }
  function viewDoc(id) {
    var d = C.docs.filter(function (x) { return x.id === id; })[0];
    if (!d || !d.slides) return go("#/diapos");
    var h = '<div class="crumbs"><a href="#/diapos">Diapos</a> › ' + esc(d.id.toUpperCase()) + '</div><h1 class="h-page">' + esc(d.titre) + "</h1>";
    h += '<p class="small muted" style="margin:0 0 12px"><a href="' + esc(d.fichier) + '" target="_blank" rel="noopener">Ouvrir le PDF complet</a></p><div class="grid">';
    for (var p = 1; p <= d.nb; p++) {
      var n = d.premiere + p - 1;
      h += '<button type="button" data-d="' + n + '" aria-label="Diapo ' + n + '"><img loading="lazy" src="' + d.slides + "/t/" + p + '.webp" alt=""><span>' + n + "</span></button>";
    }
    h += "</div>";
    app.innerHTML = h;
  }

  /* ------------------------------------------------------------------ */
  /* Démarrage                                                           */
  /* ------------------------------------------------------------------ */
  render();

  /* mode hors-ligne (le site reste utilisable sans réseau une fois visité) */
  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
