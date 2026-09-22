(function () {
  var LANG_KEY = "ao_lang";
  var AREA_ORDER = window.AO_AREA_ORDER;
  var INSIGHT_ORDER = window.AO_INSIGHT_ORDER;

  function getLang() {
    var stored = localStorage.getItem(LANG_KEY);
    if (stored === "sw" || stored === "en") return stored;
    var nav = (navigator.language || "").toLowerCase();
    return nav.indexOf("sw") === 0 ? "sw" : "en";
  }

  function dict() {
    return window.AO_I18N[getLang()] || window.AO_I18N.en;
  }

  function t(path) {
    var cur = dict();
    var parts = path.split(".");
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return "";
      cur = cur[parts[i]];
    }
    return cur == null ? "" : cur;
  }

  function rootPrefix() {
    return document.body.getAttribute("data-root") || "";
  }

  function pageName() {
    return document.body.getAttribute("data-page") || "home";
  }

  function qs(name) {
    var m = /(?:\?|&)id=([^&]+)/.exec(location.search);
    return m ? decodeURIComponent(m[1]) : "";
  }

  function renderChrome() {
    var d = dict();
    var root = rootPrefix();
    var page = pageName();
    var current = {
      home: page === "home",
      firm: page === "about",
      practice: page === "practice" || page === "area",
      advocates: page === "advocates",
      insights: page === "insights" || page === "insight",
      contact: page === "contact" || page === "thanks"
    };

    function navLink(href, key, on) {
      return (
        '<a href="' +
        root +
        href +
        '"' +
        (on ? ' aria-current="page"' : "") +
        ">" +
        d.nav[key] +
        "</a>"
      );
    }

    var header = document.getElementById("site-header");
    if (header) {
      header.innerHTML =
        '<header class="masthead"><div class="wrap">' +
        '<div class="masthead-row"><div class="masthead-top">' +
        '<a class="masthead-name" href="' +
        root +
        'index.html">Aguko Osman &amp; Co.<span>' +
        d.brandSub +
        "</span></a>" +
        '<div class="masthead-meta">' +
        d.court +
        "</div></div>" +
        '<div class="lang-switch" role="group" aria-label="' +
        d.langAria +
        '">' +
        '<button type="button" data-set-lang="en" aria-pressed="' +
        (getLang() === "en") +
        '">English</button>' +
        "<span aria-hidden=\"true\">·</span>" +
        '<button type="button" data-set-lang="sw" aria-pressed="' +
        (getLang() === "sw") +
        '">Kiswahili</button>' +
        "</div></div>" +
        '<div class="nav-bar"><nav class="nav-links" aria-label="' +
        d.navAria +
        '">' +
        navLink("index.html", "home", current.home) +
        navLink("about.html", "firm", current.firm) +
        navLink("practice.html", "practice", current.practice) +
        navLink("advocates.html", "advocates", current.advocates) +
        navLink("insights.html", "insights", current.insights) +
        navLink("contact.html", "contact", current.contact) +
        '</nav><button class="menu-btn" type="button" aria-expanded="false">' +
        d.menu +
        "</button></div></div></header>";
    }

    var footer = document.getElementById("site-footer");
    if (footer) {
      footer.innerHTML =
        '<footer class="wrap colophon"><div>© ' +
        new Date().getFullYear() +
        " " +
        d.footer.rights +
        "</div><div>" +
        '<a href="' +
        root +
        'privacy.html">' +
        d.footer.privacy +
        "</a> · " +
        '<a href="' +
        root +
        'terms.html">' +
        d.footer.terms +
        "</a> · " +
        '<a href="' +
        root +
        'profile.html">' +
        d.footer.profile +
        "</a> · " +
        d.footer.city +
        "</div></footer>";
    }

    var skip = document.querySelector(".skip");
    if (skip) skip.textContent = d.skip;

    bindMenu();
    bindLang();
  }

  function bindMenu() {
    var bar = document.querySelector(".nav-bar");
    var btn = document.querySelector(".menu-btn");
    if (!bar || !btn) return;
    btn.onclick = function () {
      var open = bar.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? dict().close : dict().menu;
    };
  }

  function bindLang() {
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.onclick = function () {
        localStorage.setItem(LANG_KEY, btn.getAttribute("data-set-lang"));
        apply();
      };
    });
  }

  function setTitle() {
    var page = pageName();
    var d = dict();
    document.documentElement.lang = getLang() === "sw" ? "sw" : "en";
    var title = d.home.title;
    if (page === "about") title = d.about.title;
    if (page === "practice" || page === "area") title = d.practice.title;
    if (page === "advocates") title = d.advocates.title;
    if (page === "insights" || page === "insight") title = d.insights.title;
    if (page === "contact") title = d.contact.title;
    if (page === "thanks") title = d.thanks.title;
    if (page === "privacy") title = d.privacy.title;
    if (page === "terms") title = d.terms.title;
    if (page === "profile") title = d.profile.title;
    if (page === "handover") title = d.handover.title;
    if (page === "area") {
      var area = qs("id");
      if (d.areas[area]) title = d.areas[area].title + " — Aguko Osman & Co.";
    }
    if (page === "insight") {
      var id = qs("id");
      if (d.insights.items[id]) title = d.insights.items[id].title + " — Aguko Osman & Co.";
    }
    document.title = title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      var desc = d.home.desc;
      if (page === "about") desc = d.about.desc;
      if (page === "practice" || page === "area") desc = d.practice.desc;
      if (page === "advocates") desc = d.advocates.desc;
      if (page === "insights" || page === "insight") desc = d.insights.desc;
      if (page === "contact") desc = d.contact.desc;
      if (page === "privacy") desc = d.privacy.desc;
      if (page === "terms") desc = d.terms.desc;
      meta.setAttribute("content", desc);
    }
  }

  function applyStatic() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = t(el.getAttribute("data-i18n"));
      if (typeof val === "string") el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var val = t(el.getAttribute("data-i18n-html"));
      if (typeof val === "string") el.innerHTML = val.replace(/\n/g, "<br>");
    });
  }

  function fillPracticeIndex() {
    var mount = document.getElementById("practice-index");
    if (!mount) return;
    var d = dict();
    mount.innerHTML = AREA_ORDER.map(function (id) {
      var a = d.areas[id];
      return (
        '<a class="index-row" href="practice-area.html?id=' +
        id +
        '"><h2>' +
        a.title +
        "</h2><p>" +
        a.blurb +
        '</p><span class="go">' +
        d.home.read +
        "</span></a>"
      );
    }).join("");
  }

  function fillHomeAreas() {
    var mount = document.getElementById("home-areas");
    if (!mount) return;
    var d = dict();
    var picks = ["dispute", "corporate", "conveyancing"];
    var html = picks.map(function (id) {
      var a = d.areas[id];
      return (
        '<a class="index-row" href="practice-area.html?id=' +
        id +
        '"><h2>' +
        a.title +
        "</h2><p>" +
        a.blurb +
        '</p><span class="go">' +
        d.home.read +
        "</span></a>"
      );
    }).join("");
    html +=
      '<a class="index-row" href="practice.html"><h2>' +
      d.home.allAreas +
      "</h2><p>" +
      d.home.allBlurb +
      '</p><span class="go">' +
      d.home.read +
      "</span></a>";
    mount.innerHTML = html;
  }

  function fillInsightsIndex() {
    var mount = document.getElementById("insights-index");
    if (!mount) return;
    var d = dict();
    mount.innerHTML = INSIGHT_ORDER.map(function (id) {
      var a = d.insights.items[id];
      return (
        '<a class="index-row" href="insight.html?id=' +
        id +
        '"><h2>' +
        a.title +
        "</h2><p>" +
        a.blurb +
        '</p><span class="go">' +
        d.home.read +
        "</span></a>"
      );
    }).join("");
  }

  function fillAreaPage() {
    var mount = document.getElementById("area-mount");
    if (!mount) return;
    var id = qs("id") || "dispute";
    var d = dict();
    var a = d.areas[id] || d.areas.dispute;
    mount.innerHTML =
      '<p class="area-nav"><a href="practice.html">' +
      d.practice.back +
      "</a></p>" +
      '<p class="page-kicker">' +
      a.meta +
      "</p>" +
      ' <h1 class="lede" style="max-width:18ch;">' +
      a.title +
      "</h1>" +
      '<div class="prose"><p>' +
      a.p1 +
      "</p><p>" +
      a.p2 +
      "</p></div>" +
      '<p class="notice"><a href="contact.html">' +
      d.home.ctaWrite +
      "</a></p>";
  }

  function fillInsightPage() {
    var mount = document.getElementById("insight-mount");
    if (!mount) return;
    var id = qs("id") || "searches";
    var d = dict();
    var a = d.insights.items[id] || d.insights.items.searches;
    mount.innerHTML =
      '<article class="insight"><p class="page-kicker">' +
      a.tag +
      "</p><h1 class=\"lede\" style=\"max-width:20ch;\">" +
      a.title +
      '</h1><p class="byline">' +
      a.byline +
      '</p><div class="prose"><p>' +
      a.p1 +
      "</p><p>" +
      a.p2 +
      "</p><p>" +
      a.p3 +
      "</p><p>" +
      a.p4 +
      "</p></div><p class=\"notice\"><a href=\"insights.html\">← " +
      d.insights.back +
      "</a></p></article>";
  }

  function bindForm() {
    var form = document.getElementById("inquiry");
    if (!form) return;
    form.onsubmit = function (e) {
      e.preventDefault();
      var d = dict();
      var status = document.getElementById("form-status");
      var btn = form.querySelector('button[type="submit"]');
      var fd = new FormData(form);
      fd.append("_subject", "Website inquiry — Aguko Osman & Co.");
      fd.append("_template", "table");
      if (btn) {
        btn.disabled = true;
        btn.textContent = d.contact.sending;
      }
      fetch("https://formsubmit.co/ajax/info@agukoosman.com", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd
      })
        .then(function (res) {
          if (!res.ok) throw new Error("send");
          location.href = "thanks.html";
        })
        .catch(function () {
          if (status) {
            status.textContent = d.contact.err;
            status.className = "form-status is-error";
          }
          var name = form.name.value;
          var email = form.email.value;
          var phone = form.phone.value;
          var matter = form.matter.value;
          var message = form.message.value;
          var body =
            "Name: " +
            name +
            "\nEmail: " +
            email +
            "\nPhone: " +
            phone +
            "\nMatter: " +
            matter +
            "\n\n" +
            message;
          location.href =
            "mailto:info@agukoosman.com?subject=" +
            encodeURIComponent("Website inquiry") +
            "&body=" +
            encodeURIComponent(body);
          if (btn) {
            btn.disabled = false;
            btn.textContent = d.contact.send;
          }
        });
    };
  }

  function apply() {
    renderChrome();
    setTitle();
    applyStatic();
    fillHomeAreas();
    fillPracticeIndex();
    fillInsightsIndex();
    fillAreaPage();
    fillInsightPage();
    bindForm();
  }

  try {
    apply();
  } finally {
    document.body.classList.add("ao-ready");
  }
})();
