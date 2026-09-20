document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var links = document.querySelector('nav.links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  var slides = document.querySelectorAll('.hero-slider .slide');
  var dots = document.querySelectorAll('.slide-dots button');
  if (slides.length) {
    var current = 0;
    var timer;

    function showSlide(i) {
      slides.forEach(function (s) { s.classList.remove('active'); });
      dots.forEach(function (d) { d.classList.remove('active'); });
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function nextSlide() { showSlide(current + 1); }
    function prevSlide() { showSlide(current - 1); }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(nextSlide, 6000);
    }

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { showSlide(i); startAuto(); });
    });

    var nextBtn = document.querySelector('.slide-arrow.next');
    var prevBtn = document.querySelector('.slide-arrow.prev');
    if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); startAuto(); });

    showSlide(0);
    startAuto();
  }

  var form = document.querySelector('form.enquiry');
  if (form) {
    form.addEventListener('submit', function (e) {
      var status = document.querySelector('.form-status');
      if (!status) return;
      // Netlify Forms handles the actual submission via the form's
      // data-netlify attribute; this just gives the user feedback.
      setTimeout(function () {
        status.textContent = "Thanks — your enquiry has been sent. We'll be in touch soon.";
        status.className = 'form-status show ok';
        form.reset();
      }, 400);
    });
  }
});

/* =====================================================================
   ELLA - Elvo Energy chat agent
   Added to this file so it appears on every page automatically.
   Edit the CONFIG block below if the details change.
   ===================================================================== */
(function () {
  var CONFIG = {
    email: "elvoenergy@zohomail.in",  // used only if the website form service is unavailable
    formName: "enquiry",              // same Netlify form the Contact page uses
    incomeLimit: "$150,000"           // Solar Victoria income cap from 1 July 2026. Update if the rules change.
  };

  function initElla() {
    if (document.getElementById("ella-root")) return;

    /* ---------- styles (everything is prefixed so it cannot affect the rest of the site) ---------- */
    var css = `
#ella-root{--ella-green:#0F5C4A;--ella-green-dark:#0A4436;--ella-sun:#F2A93B;--ella-navy:#12324A;--ella-mist:#EAF4F0;--ella-ink:#1B2B2A;--ella-line:#D5E4DE;--ella-bottom:20px;font-size:16px;line-height:1.5;color:#1B2B2A;text-align:left}
:where(#ella-root,#ella-root *){box-sizing:border-box}
:where(#ella-root) :where(button,input){font:inherit;letter-spacing:normal;text-transform:none}
#ella-root .ella-launcher{position:fixed;right:20px;bottom:calc(var(--ella-bottom) + env(safe-area-inset-bottom,0px));z-index:2147483000;display:block;width:68px;height:68px;min-width:0;margin:0;padding:0;border-radius:50%;border:3px solid #fff;cursor:pointer;background:var(--ella-mist);box-shadow:0 6px 20px rgba(10,68,54,.35);transition:transform .15s ease}
#ella-root .ella-launcher:hover{transform:scale(1.05)}
#ella-root .ella-launcher:focus-visible,#ella-root .ella-btn:focus-visible,#ella-root .ella-input:focus-visible,#ella-root .ella-x:focus-visible{outline:3px solid var(--ella-sun);outline-offset:2px}
#ella-root .ella-face{position:absolute;top:0;left:0;right:0;bottom:0;border-radius:50%;overflow:hidden;display:block}
#ella-root .ella-face svg,#ella-root .ella-avatar svg{width:100%;height:100%;display:block;max-width:none}
#ella-root .ella-online{position:absolute;right:1px;bottom:1px;width:15px;height:15px;border-radius:50%;background:#2DBE6C;border:2px solid #fff}
#ella-root .ella-teaser{position:fixed;right:20px;bottom:calc(var(--ella-bottom) + 84px + env(safe-area-inset-bottom,0px));z-index:2147483000;max-width:230px;background:#fff;color:#1B2B2A;border-radius:14px 14px 4px 14px;padding:10px 14px;font-size:14px;box-shadow:0 6px 20px rgba(0,0,0,.18);display:none;cursor:pointer}
#ella-root .ella-teaser.show{display:block}
#ella-root .ella-panel{position:fixed;right:20px;bottom:calc(var(--ella-bottom) + 84px + env(safe-area-inset-bottom,0px));z-index:2147483001;width:370px;height:min(600px,calc(100vh - var(--ella-bottom) - 110px));height:min(600px,calc(100dvh - var(--ella-bottom) - 110px));display:none;flex-direction:column;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(10,50,40,.35)}
#ella-root .ella-panel.open{display:flex}
#ella-root .ella-head{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--ella-green);color:#fff}
#ella-root .ella-avatar{width:44px;height:44px;border-radius:50%;overflow:hidden;flex:none;border:2px solid rgba(255,255,255,.7);background:var(--ella-mist)}
#ella-root .ella-who{flex:1;min-width:0}
#ella-root .ella-who b{display:block;font-size:16px;font-weight:700;color:#fff}
#ella-root .ella-who span{font-size:12.5px;opacity:.9;color:#fff}
#ella-root .ella-x{background:none;border:0;color:#fff;font-size:26px;line-height:1;padding:4px 8px;border-radius:8px;cursor:pointer;width:auto;height:auto;min-width:0}
#ella-root .ella-msgs{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:16px 14px;background:var(--ella-mist);display:flex;flex-direction:column;gap:8px}
#ella-root .ella-m{max-width:84%;padding:9px 13px;border-radius:16px;font-size:15px;line-height:1.45;white-space:pre-line;word-wrap:break-word}
#ella-root .ella-bot{align-self:flex-start;background:#fff;color:#1B2B2A;border-bottom-left-radius:4px;box-shadow:0 1px 2px rgba(0,0,0,.06)}
#ella-root .ella-me{align-self:flex-end;background:var(--ella-green);color:#fff;border-bottom-right-radius:4px}
#ella-root .ella-card{max-width:94%;font-size:14px;border-left:4px solid var(--ella-sun)}
#ella-root .ella-dots{display:inline-flex;gap:4px;padding:4px 2px}
#ella-root .ella-dots i{width:7px;height:7px;border-radius:50%;background:#9DB8AF;animation:ella-blink 1s infinite;display:block}
#ella-root .ella-dots i:nth-child(2){animation-delay:.15s}
#ella-root .ella-dots i:nth-child(3){animation-delay:.3s}
@keyframes ella-blink{0%,60%,100%{opacity:.3}30%{opacity:1}}
#ella-root .ella-foot{border-top:1px solid var(--ella-line);background:#fff;padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px))}
#ella-root .ella-opts{display:flex;flex-wrap:wrap;gap:8px}
#ella-root .ella-opts .ella-btn{background:#fff;color:var(--ella-green);border:1.5px solid var(--ella-green);border-radius:999px;padding:8px 14px;font-size:14.5px;font-weight:600;cursor:pointer;width:auto;min-width:0;margin:0;line-height:1.3}
#ella-root .ella-opts .ella-btn:hover{background:var(--ella-green);color:#fff}
#ella-root .ella-opts .ella-btn.ella-sel,#ella-root .ella-opts .ella-btn.ella-primary{background:var(--ella-green);color:#fff}
#ella-root .ella-opts .ella-btn.ella-primary:hover{background:var(--ella-green-dark)}
#ella-root .ella-opts .ella-btn:disabled{opacity:.4;cursor:default}
#ella-root .ella-form{display:none;gap:8px;margin:0;padding:0;border:0;background:none;width:auto;max-width:none}
#ella-root .ella-input{flex:1;min-width:0;width:auto;height:auto;margin:0;font-size:16px;line-height:1.3;padding:10px 12px;border:1.5px solid var(--ella-line);border-radius:12px;background:#fff;color:#1B2B2A;box-shadow:none}
#ella-root .ella-send{background:var(--ella-sun);color:var(--ella-navy);border:0;border-radius:12px;padding:0 16px;font-weight:700;cursor:pointer;width:auto;height:auto;min-width:0;margin:0}
@media (max-width:480px){
  #ella-root .ella-panel{top:0;right:0;bottom:0;left:0;width:auto;height:auto;border-radius:0}
  #ella-root .ella-panel.open ~ .ella-launcher{display:none}
}
@media (prefers-reduced-motion:reduce){#ella-root *{animation:none!important;transition:none!important}}
`;
    var style = document.createElement("style");
    style.id = "ella-style";
    style.textContent = css;
    document.head.appendChild(style);

    /* ---------- markup ---------- */
    var root = document.createElement("div");
    root.id = "ella-root";
    root.innerHTML = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <symbol id="ella-face" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill="#DDF3EA"/>
    <path d="M25 54C20 24 38 10 52 10C70 10 82 26 76 54C76 62 73 67 70 69L30 69C27 65 25 60 25 54Z" fill="#3B2416"/>
    <path d="M6 100C8 82 26 76 50 76C74 76 92 82 94 100Z" fill="#12324A"/>
    <path d="M39 77L50 93L61 77L54 75L46 75Z" fill="#fff"/>
    <path d="M39 77L47 96L33 100L30 84Z" fill="#0D2739"/>
    <path d="M61 77L53 96L67 100L70 84Z" fill="#0D2739"/>
    <path d="M43 62L43 78Q50 84 57 78L57 62Z" fill="#E6B08D"/>
    <ellipse cx="50" cy="47" rx="19" ry="22" fill="#F3C8A8"/>
    <path d="M30 47C28 30 41 22 53 23C64 24 71 32 70 47C65 38 57 33 47 32C40 33 34 38 30 47Z" fill="#3B2416"/>
    <circle cx="31.5" cy="56" r="2" fill="#F2A93B"/><circle cx="68.5" cy="56" r="2" fill="#F2A93B"/>
    <path d="M36.5 45.5Q41.5 42.5 46.5 44.5" stroke="#3B2416" stroke-width="1.9" fill="none" stroke-linecap="round"/>
    <path d="M53.5 44.5Q58.5 42.5 63.5 45.5" stroke="#3B2416" stroke-width="1.9" fill="none" stroke-linecap="round"/>
    <ellipse cx="42" cy="50" rx="2.3" ry="2.7" fill="#2B1B12"/><ellipse cx="58" cy="50" rx="2.3" ry="2.7" fill="#2B1B12"/>
    <circle cx="42.8" cy="49" r=".8" fill="#fff"/><circle cx="58.8" cy="49" r=".8" fill="#fff"/>
    <path d="M50 52Q52.3 57 49.5 58.3" stroke="#D49B78" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M42.5 62.5Q50 68.5 57.5 62.5" stroke="#B5433F" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  </symbol>
</svg>
<div class="ella-teaser" role="button" tabindex="0">Hi, I'm Ella. Ask me about Victorian solar rebates.</div>
<div class="ella-panel" role="dialog" aria-label="Chat with Ella from Elvo Energy">
  <div class="ella-head">
    <div class="ella-avatar"><svg viewBox="0 0 100 100"><use href="#ella-face"/></svg></div>
    <div class="ella-who"><b>Ella</b><span>Elvo Energy &middot; Victoria solar rebates</span></div>
    <button type="button" class="ella-x" aria-label="Close chat">&times;</button>
  </div>
  <div class="ella-msgs" aria-live="polite"></div>
  <div class="ella-foot">
    <div class="ella-opts"></div>
    <form class="ella-form" autocomplete="on" novalidate>
      <input class="ella-input" aria-label="Your answer" enterkeyhint="send">
      <button class="ella-btn ella-send" type="submit">Send</button>
    </form>
  </div>
</div>
<button type="button" class="ella-launcher" aria-label="Chat with Ella">
  <span class="ella-face"><svg viewBox="0 0 100 100"><use href="#ella-face"/></svg></span>
  <span class="ella-online"></span>
</button>`;
    document.body.appendChild(root);

    var $ = function (s) { return root.querySelector(s); };
    var msgs = $(".ella-msgs"), opts = $(".ella-opts"), form = $(".ella-form"), input = $(".ella-input"),
        panel = $(".ella-panel"), teaser = $(".ella-teaser"), launcher = $(".ella-launcher");
    var data = {}, current = null, busy = false, started = false;

    var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    var first = function (n) { return (n || "").trim().split(/\s+/)[0]; };

    function bubble(text, cls) {
      var d = document.createElement("div");
      d.className = "ella-m " + (cls === "me" ? "ella-me" : "ella-bot") + (cls === "bot card" ? " ella-card" : "");
      d.textContent = text;
      msgs.appendChild(d);
      scrollEnd();
      return d;
    }
    function typing() {
      var d = document.createElement("div");
      d.className = "ella-m ella-bot";
      d.innerHTML = '<span class="ella-dots"><i></i><i></i><i></i></span>';
      msgs.appendChild(d);
      scrollEnd();
      return d;
    }
    async function say(lines) {
      lines = [].concat(lines || []).filter(Boolean);
      for (var i = 0; i < lines.length; i++) {
        var t = typing();
        await wait(450 + Math.min(lines[i].length * 10, 650));
        t.remove();
        bubble(lines[i]);
      }
    }
    function scrollEnd() {
      requestAnimationFrame(function () { msgs.scrollTop = msgs.scrollHeight; });
    }
    function summary() {
      var d = data, rows = [["I am a", d.type], ["Name", d.name]];
      if (d.company) rows.push(["Company", d.company]);
      if (d.interest) rows.push(["Interested in", d.interest]);
      if (d.location) rows.push(["Suburb / postcode", d.location]);
      if (d.income) rows.push(["Household income", d.income]);
      rows.push(["Email", d.email], ["Phone", d.phone], ["Best time to call", d.time]);
      return rows.map(function (r) { return r[0] + ": " + r[1]; }).join("\n");
    }

    var TEXT = {
      name: { placeholder: "Your name", type: "text", ac: "name" },
      company: { placeholder: "Company name", type: "text", ac: "organization" },
      postcode: { placeholder: "e.g. Werribee 3030", type: "text", ac: "postal-code" },
      email: { placeholder: "you@example.com", type: "email", ac: "email" },
      phone: { placeholder: "e.g. 0412 345 678", type: "tel", ac: "tel" }
    };
    var TIME_MAP = {
      "Morning": "Morning (9am\u201312pm)",
      "Afternoon": "Afternoon (12pm\u20134pm)",
      "Evening": "Evening (4pm\u20136pm)",
      "Anytime": "Anytime"
    };

    var flow = {
      type: {
        say: function () { return ["Hi, I'm Ella from Elvo Energy \u{1F44B}", "I help Victorians get the most out of the solar rebate program. Which best describes you?"]; },
        choices: ["Homeowner", "Business", "Installer partner"],
        key: "type", next: function () { return "name"; }
      },
      name: {
        say: function () { return "Great! What's your name?"; },
        text: TEXT.name, key: "name",
        check: function (v) { return v.length >= 2 || "Please enter your name."; },
        next: function (d) { return d.type === "Installer partner" ? "company" : "interest"; }
      },
      company: {
        say: function (d) { return "Nice to meet you, " + first(d.name) + "! What's your company name?"; },
        text: TEXT.company, key: "company",
        check: function (v) { return v.length >= 2 || "Please enter your company name."; },
        next: function () { return "email"; }
      },
      interest: {
        say: function (d) { return ["Nice to meet you, " + first(d.name) + "! What are you interested in?", "You can pick more than one, then tap Continue."]; },
        choices: ["Solar panels", "Solar battery", "Heat pump", "All three", "Other solar solution"],
        multi: true, all: ["Solar panels", "Solar battery", "Heat pump"],
        key: "interest", next: function () { return "postcode"; }
      },
      postcode: {
        say: function () { return "What's your suburb and postcode?"; },
        text: TEXT.postcode, key: "location",
        check: function (v) { return /\b\d{4}\b/.test(v) || "Please include your 4-digit postcode, like 3000."; },
        after: function (d) {
          var pc = (d.location.match(/\b(\d{4})\b/) || [])[1];
          return (pc && pc[0] !== "3" && pc[0] !== "8")
            ? "Just so you know, our rebate guidance is for properties in Victoria. Our team will check your address for you." : null;
        },
        next: function (d) { return d.type === "Homeowner" ? "income" : "email"; }
      },
      income: {
        say: function () { return "A quick eligibility check: is your combined household income " + CONFIG.incomeLimit + " a year or less? Your best estimate is fine."; },
        choices: ["Yes, " + CONFIG.incomeLimit + " or less", "No, more than " + CONFIG.incomeLimit],
        key: "income",
        after: function () { return "Thanks. Our team will confirm exactly what you're eligible for."; },
        next: function () { return "email"; }
      },
      email: {
        say: function (d) { return d.type === "Installer partner" ? "What's the best email address to reach you on?" : "What's your email address?"; },
        text: TEXT.email, key: "email",
        check: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "That email doesn't look right. Please check it and try again."; },
        next: function () { return "phone"; }
      },
      phone: {
        say: function () { return "What's the best phone number to reach you on? Our team will follow up with a call."; },
        text: TEXT.phone, key: "phone",
        check: function (v) { return v.replace(/\D/g, "").length >= 8 || "Please enter a phone number with at least 8 digits."; },
        next: function () { return "time"; }
      },
      time: {
        say: function () { return "When is the best time for us to call?"; },
        choices: ["Morning", "Afternoon", "Evening", "Anytime"],
        key: "time", next: function () { return "review"; }
      },
      review: {
        say: function (d) { return ["Thanks, " + first(d.name) + "! Here's what I have:"]; },
        card: true,
        choices: ["Send my details to Elvo"], primary: true,
        action: function () { return submit(); },
        next: function () { return "thanks"; }
      },
      thanks: {
        say: function (d, res) {
          var l = [];
          if (res === "mailto") l.push("Your email app should now be open with your details. Just press Send to finish.");
          l.push("All done, " + first(d.name) + "! \u{1F389} Our team will call you on " + d.phone + " (" + d.time.toLowerCase() + ").");
          return l;
        },
        choices: ["Start again"],
        action: function () { data = {}; msgs.innerHTML = ""; return "type"; },
        next: function (d, res) { return res; }
      }
    };

    /* Sends the enquiry to the same Netlify form the Contact page uses. If that is not available, falls back to the customer's email app. */
    async function submit() {
      var d = data;
      var pc = (d.location || "").match(/\b(\d{4})\b/);
      var note = ["Sent via Ella chat assistant."];
      if (d.company) note.push("Company: " + d.company);
      if (d.location) note.push("Suburb / postcode: " + d.location);
      if (d.income) note.push("Household income: " + d.income);
      var fields = {
        "form-name": CONFIG.formName,
        "bot-field": "",
        name: d.name,
        email: d.email,
        phone: d.phone,
        best_time: TIME_MAP[d.time] || d.time,
        enquirer_type: d.type,
        interest: d.interest || "",
        postcode: pc ? pc[1] : "",
        message: note.join("\n")
      };
      try {
        var r = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(fields).toString()
        });
        if (r.ok) return "sent";
      } catch (e) { /* fall through to email */ }
      var url = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("New enquiry via Ella (" + d.type + ")") +
                "&body=" + encodeURIComponent(summary());
      window.location.href = url;
      return "mailto";
    }

    function clearUI() { opts.innerHTML = ""; opts.style.display = "none"; form.style.display = "none"; }

    async function go(id, res) {
      current = id; busy = true; clearUI();
      var s = flow[id];
      await say(s.say(data, res));
      if (s.card) bubble(summary(), "bot card");
      if (s.choices) {
        opts.style.display = "flex";
        if (s.multi) {
          var picked = {}, btns = {};
          var cont = document.createElement("button");
          cont.type = "button"; cont.className = "ella-btn ella-primary"; cont.textContent = "Continue \u203A"; cont.disabled = true;
          var refresh = function () {
            var allOn = s.all.every(function (x) { return picked[x]; });
            s.choices.forEach(function (k) {
              var on = (k === "All three") ? allOn : !!picked[k];
              btns[k].classList.toggle("ella-sel", on);
              btns[k].setAttribute("aria-pressed", on);
              btns[k].textContent = (on ? "\u2713 " : "") + k;
            });
            cont.disabled = !Object.keys(picked).length;
          };
          s.choices.forEach(function (c) {
            var b = document.createElement("button");
            b.type = "button"; b.className = "ella-btn"; b.textContent = c; b.setAttribute("aria-pressed", "false");
            b.onclick = function () {
              if (c === "All three") {
                var allOn = s.all.every(function (x) { return picked[x]; });
                s.all.forEach(function (x) { if (allOn) delete picked[x]; else picked[x] = 1; });
              } else if (picked[c]) { delete picked[c]; } else { picked[c] = 1; }
              refresh();
            };
            btns[c] = b; opts.appendChild(b);
          });
          cont.onclick = function () {
            var list = s.choices.filter(function (k) { return k !== "All three" && picked[k]; });
            answer(list.join(", "));
          };
          opts.appendChild(cont);
        } else {
          s.choices.forEach(function (c) {
            var b = document.createElement("button");
            b.type = "button"; b.className = "ella-btn" + (s.primary ? " ella-primary" : ""); b.textContent = c;
            b.onclick = function () { answer(c); };
            opts.appendChild(b);
          });
        }
      } else {
        var t = s.text;
        input.type = t.type; input.placeholder = t.placeholder; input.autocomplete = t.ac; input.value = "";
        form.style.display = "flex";
        input.focus();
      }
      busy = false;
      scrollEnd();
    }

    async function answer(value) {
      if (busy) return;
      value = String(value).trim();
      if (!value) return;
      var s = flow[current];
      if (s.action) {
        busy = true; clearUI();
        bubble(value, "me");
        var res = await s.action();
        return go(s.next(data, res), res);
      }
      bubble(value, "me");
      if (s.check) {
        var ok = s.check(value);
        if (ok !== true) { busy = true; input.value = ""; await say(ok); busy = false; input.focus(); return; }
      }
      if (s.key) data[s.key] = value;
      clearUI(); busy = true;
      if (s.after) { await say(s.after(data)); }
      return go(s.next(data));
    }

    form.addEventListener("submit", function (e) { e.preventDefault(); answer(input.value); input.value = ""; });

    /* Keep the launcher clear of the site's sticky bottom button, and fit the chat above the phone keyboard */
    function place() {
      var off = 20;
      var c = document.querySelector(".sticky-cta");
      if (c) {
        var cs = window.getComputedStyle(c);
        if (cs.display !== "none" && cs.visibility !== "hidden" && (cs.position === "fixed" || cs.position === "sticky")) {
          off = Math.max(off, c.offsetHeight + 16);
        }
      }
      root.style.setProperty("--ella-bottom", off + "px");
    }
    function fit() {
      var vv = window.visualViewport;
      if (window.innerWidth <= 480 && panel.classList.contains("open")) {
        panel.style.height = (vv ? vv.height : window.innerHeight) + "px";
        panel.style.top = (vv ? vv.offsetTop : 0) + "px";
        panel.style.bottom = "auto";
      } else {
        panel.style.height = ""; panel.style.top = ""; panel.style.bottom = "";
      }
      place();
      scrollEnd();
    }
    window.addEventListener("resize", fit);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", fit);
      window.visualViewport.addEventListener("scroll", fit);
    }
    if (window.ResizeObserver) new ResizeObserver(scrollEnd).observe(msgs);
    input.addEventListener("focus", function () { setTimeout(fit, 150); setTimeout(fit, 450); });

    function openChat() {
      panel.classList.add("open"); teaser.classList.remove("show");
      if (!started) { started = true; go("type"); }
      fit();
    }
    function closeChat() { panel.classList.remove("open"); fit(); }
    launcher.onclick = function () { panel.classList.contains("open") ? closeChat() : openChat(); };
    $(".ella-x").onclick = closeChat;
    teaser.onclick = openChat;
    teaser.onkeydown = function (e) { if (e.key === "Enter") openChat(); };
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && panel.classList.contains("open")) closeChat(); });

    place();
    var seen = false;
    try { seen = sessionStorage.getItem("ellaTeaserSeen") === "1"; } catch (e) {}
    setTimeout(function () {
      if (!seen && !panel.classList.contains("open")) {
        teaser.classList.add("show");
        try { sessionStorage.setItem("ellaTeaserSeen", "1"); } catch (e) {}
      }
    }, 3500);
  }

  function safeInit() { try { initElla(); } catch (err) { if (window.console) console.error("Ella failed to start:", err); } }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", safeInit);
  else safeInit();
})();
/* Ella layout fixes */
(function () {
  function fixElla() {
    var s = document.createElement("style");
    s.textContent = "html,body{overflow-x:clip}#ella-root .ella-teaser{max-width:min(230px,calc(100vw - 100px))}";
    document.head.appendChild(s);

    var t = document.querySelector("#ella-root .ella-teaser");
    if (!t) return;
    new MutationObserver(function () {
      if (t.classList.contains("show")) {
        setTimeout(function () { t.classList.remove("show"); }, 8000);
      }
    }).observe(t, { attributes: true, attributeFilter: ["class"] });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fixElla);
  else fixElla();
})();
