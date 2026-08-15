/* ═══════════════════════════════════════════════════════════
   BOOKING FLOW — Topic gate + Cal.com embed
   Cal.com handles the actual calendar, timezones, and Google
   Calendar sync. We handle the topic + context filter first,
   then hand off with prefilled data.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const CAL_LINK = 'daksh-suthar-9u1moo/founder-chat';
  const CAL_NAMESPACE = 'founder-chat';

  // ──────────────────────────────
  // State
  // ──────────────────────────────
  const state = {
    step: 1,
    topic: null,
    context: '',
    calLoaded: false,
  };

  // ──────────────────────────────
  // Chip select (topic)
  // ──────────────────────────────
  document.querySelectorAll('#topicChips .chip').forEach(c => {
    c.addEventListener('click', () => {
      document.querySelectorAll('#topicChips .chip').forEach(x => x.classList.remove('on'));
      c.classList.add('on');
      state.topic = c.dataset.topic || c.textContent.trim();
      const btn = document.getElementById('step1Continue');
      if (btn) btn.disabled = false;
    });
  });

  // Disable continue until a topic is selected
  const step1Btn = document.getElementById('step1Continue');
  if (step1Btn) step1Btn.disabled = true;

  // ──────────────────────────────
  // Navigate between steps
  // ──────────────────────────────
  window.goStep = function (n) {
    // Validate step 2 (context is required to unlock calendar)
    if (n === 3 && state.step === 2) {
      const ctx = document.getElementById('contextInput');
      if (!ctx || !ctx.value.trim()) { ctx?.focus(); return; }
      state.context = ctx.value.trim();
    }

    state.step = n;
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('on'));
    const panel = document.querySelector(`.step-panel[data-panel="${n}"]`);
    if (panel) panel.classList.add('on');

    document.querySelectorAll('.steps span[data-step]').forEach((s, i) => {
      s.classList.remove('on', 'done');
      if (i + 1 < n) s.classList.add('done');
      if (i + 1 === n) s.classList.add('on');
    });

    // Load Cal.com embed when we reach step 3
    if (n === 3) {
      loadCalEmbed();
    }

    document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ──────────────────────────────
  // Load Cal.com inline embed
  // ──────────────────────────────
  function loadCalEmbed() {
    if (state.calLoaded) return;
    state.calLoaded = true;

    const wrap = document.getElementById('cal-inline');
    if (!wrap) return;

    // Prefill notes with the topic + context so it lands in the booking form
    const notes = `TOPIC: ${state.topic || '—'}\n\nCONTEXT:\n${state.context || '—'}`;

    // Cal.com embed initializer (their canonical loader script)
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal("init", CAL_NAMESPACE, { origin: "https://cal.com" });

    window.Cal.ns[CAL_NAMESPACE]("inline", {
      elementOrSelector: "#cal-inline",
      config: {
        layout: "month_view",
        notes: notes,
      },
      calLink: CAL_LINK,
    });

    // Match the dark theme to the site
    window.Cal.ns[CAL_NAMESPACE]("ui", {
      theme: "dark",
      cssVarsPerTheme: {
        dark: {
          "cal-brand": "#FAFAFA",
          "cal-text": "#FAFAFA",
          "cal-text-emphasis": "#FAFAFA",
          "cal-border": "#2A2A2A",
          "cal-border-subtle": "#1F1F1F",
          "cal-border-booker": "#2A2A2A",
          "cal-bg": "#0A0A0A",
          "cal-bg-emphasis": "#161616",
          "cal-bg-muted": "#101010",
          "cal-bg-subtle": "#161616",
        }
      },
      hideEventTypeDetails: false,
      layout: "month_view",
    });

    // Fade out the loading state once the iframe appears
    let checks = 0;
    const iv = setInterval(() => {
      checks++;
      const iframe = wrap.querySelector('iframe');
      if (iframe || checks > 40) {
        const loader = document.getElementById('cal-loader');
        if (loader) loader.style.display = 'none';
        clearInterval(iv);
      }
    }, 250);
  }

  // ──────────────────────────────
  // If someone lands directly on step 3 (via #book), pre-select "Something else"
  // so the flow still works. Otherwise chip selection is required.
  // ──────────────────────────────
  const params = new URLSearchParams(window.location.search);
  if (params.get('step') === '3' || params.get('quick') === '1') {
    state.topic = 'Founder chat';
    state.context = 'Booked directly — happy to fill in why on the call.';
    window.goStep(3);
  }

})();
