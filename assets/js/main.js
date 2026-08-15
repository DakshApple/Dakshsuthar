/* ═══════════════════════════════════════════════════════════
   DAKSHSUTHAR.COM — Shared runtime
   Nav, palette, clock, reveals, mobile menu, status.
   Runs on every page.
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ──────────────────────────────
  // Path helper — figure out root relative to current page
  // (e.g., a page in /work/ needs "../" prefix for asset links)
  // ──────────────────────────────
  function root() {
    const path = window.location.pathname;
    const depth = (path.match(/\/[^/]+\//g) || []).length - 1;
    return depth > 0 ? '../'.repeat(depth) : './';
  }
  const R = root();

  // ──────────────────────────────
  // NAV scroll state
  // ──────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ──────────────────────────────
  // Highlight current page in nav
  // ──────────────────────────────
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const current = window.location.pathname;
    if (href && href !== '#' && (current.endsWith(href) || current.includes(href.replace('./', '').replace('../', '')))) {
      a.classList.add('on');
    }
  });

  // ──────────────────────────────
  // Mobile menu
  // ──────────────────────────────
  window.toggleMenu = function () {
    const m = document.getElementById('mobileMenu');
    if (m) m.classList.toggle('open');
  };

  // ──────────────────────────────
  // Reveal on scroll
  // ──────────────────────────────
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  // ──────────────────────────────
  // IST clock — updates the bottom-left status pill
  // ──────────────────────────────
  function tickClock() {
    const now = new Date();
    let t;
    try {
      const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const h = String(ist.getHours()).padStart(2, '0');
      const m = String(ist.getMinutes()).padStart(2, '0');
      t = `${h}:${m}`;
    } catch (e) { t = '--:--'; }
    const targets = ['clock', 'statusClock'];
    targets.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = id === 'statusClock' ? `${t} IST` : t;
    });
  }
  tickClock();
  setInterval(tickClock, 30000);

  // ──────────────────────────────
  // Number counters (proof stats)
  // ──────────────────────────────
  document.querySelectorAll('.proof__n[data-n]').forEach(el => {
    const target = +el.dataset.n;
    if (isNaN(target)) return;
    if (!('IntersectionObserver' in window)) { el.textContent = target; return; }
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        let n = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const t = setInterval(() => {
          n += step;
          if (n >= target) { n = target; clearInterval(t); }
          el.textContent = n;
        }, 30);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    co.observe(el);
  });

  // ──────────────────────────────
  // Manifesto rotator (homepage only)
  // ──────────────────────────────
  const quotes = [
    { html: 'Building <span class="gt">&gt;</span> talking.' },
    { html: 'Speed is a <em>competitive advantage.</em>' },
    { html: 'Ideas are cheap.<br>Distribution isn\'t.' },
    { html: 'Technology should <em>remove</em> friction.' },
    { html: 'The best products solve boring problems <em>extremely</em> well.' },
    { html: 'Don\'t build for attention.<br>Build for <em>usefulness.</em>' }
  ];
  const qEl = document.getElementById('mfQuote');
  const dotsEl = document.getElementById('mfDots');
  const idxEl = document.getElementById('mfIdx');
  if (qEl && dotsEl && idxEl) {
    let qIdx = 0;
    setInterval(() => {
      qIdx = (qIdx + 1) % quotes.length;
      qEl.style.opacity = 0;
      qEl.style.transform = 'translateY(20px)';
      setTimeout(() => {
        qEl.innerHTML = quotes[qIdx].html;
        qEl.style.opacity = 1;
        qEl.style.transform = 'translateY(0)';
        [...dotsEl.children].forEach((d, i) => d.classList.toggle('on', i === qIdx));
        idxEl.textContent = String(qIdx + 1).padStart(2, '0');
      }, 400);
    }, 4200);
  }

  // ──────────────────────────────
  // Command palette (⌘K / Ctrl+K)
  // ──────────────────────────────
  const cmd = document.getElementById('cmd');
  const cmdInput = document.getElementById('cmdInput');
  const cmdItems = cmd ? [...cmd.querySelectorAll('.cmd__item')] : [];
  let cmdSel = 0;

  function openCmd() {
    if (!cmd) return;
    cmd.classList.add('open');
    setTimeout(() => cmdInput?.focus(), 50);
    if (cmdInput) cmdInput.value = '';
    filterCmd('');
    cmdSel = 0;
    markSel();
  }
  function closeCmd() { cmd?.classList.remove('open'); }
  function markSel() {
    const vis = cmdItems.filter(i => i.style.display !== 'none');
    cmdItems.forEach(i => i.classList.remove('on'));
    if (vis[cmdSel]) vis[cmdSel].classList.add('on');
  }
  function filterCmd(q) {
    q = q.toLowerCase();
    cmdItems.forEach(i => {
      const t = i.querySelector('.cmd__name')?.textContent.toLowerCase() || '';
      i.style.display = (!q || t.includes(q)) ? '' : 'none';
    });
    cmdSel = 0;
    markSel();
  }
  function goItem(i) {
    const h = i.dataset.href || i.getAttribute('href');
    if (!h) return;
    closeCmd();
    if (h.startsWith('mailto:') || h.startsWith('http')) {
      window.location.href = h;
    } else if (h.startsWith('#')) {
      document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = h;
    }
  }
  window.openCmd = openCmd;
  window.closeCmd = closeCmd;

  if (cmdInput) cmdInput.addEventListener('input', () => filterCmd(cmdInput.value));
  cmdItems.forEach(i => i.addEventListener('click', () => goItem(i)));
  if (cmd) cmd.addEventListener('click', (e) => { if (e.target === cmd) closeCmd(); });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      cmd?.classList.contains('open') ? closeCmd() : openCmd();
      return;
    }
    if (!cmd?.classList.contains('open')) return;
    const vis = cmdItems.filter(i => i.style.display !== 'none');
    if (e.key === 'Escape') { closeCmd(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); cmdSel = (cmdSel + 1) % vis.length; markSel(); vis[cmdSel]?.scrollIntoView({ block: 'nearest' }); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); cmdSel = (cmdSel - 1 + vis.length) % vis.length; markSel(); vis[cmdSel]?.scrollIntoView({ block: 'nearest' }); }
    if (e.key === 'Enter' && vis[cmdSel]) { goItem(vis[cmdSel]); }
  });

  // ──────────────────────────────
  // Ask Daksh form
  // Question stored locally + emailed to Daksh via Web3Forms.
  // Email field is optional — if the asker gives it, Daksh can
  // reply privately; if not, it gets answered publicly if good.
  // ──────────────────────────────
  const askInput = document.getElementById('askInput');
  const askSend = document.getElementById('askSend');
  const askWrap = document.getElementById('askWrap');
  const askEmail = document.getElementById('askEmail');
  if (askSend && askInput && askWrap) {
    askSend.addEventListener('click', async () => {
      const v = askInput.value.trim();
      const eml = askEmail?.value.trim() || '';
      if (!v) { askInput.focus(); return; }

      askSend.disabled = true;
      askSend.innerHTML = 'Sending…';

      // Local backup
      try {
        const prev = JSON.parse(localStorage.getItem('daksh__questions') || '[]');
        prev.push({ q: v, e: eml, at: Date.now() });
        localStorage.setItem('daksh__questions', JSON.stringify(prev));
      } catch (e) {}

      // Send to Web3Forms
      await submitToWeb3Forms({
        subject: 'New question via Ask Daksh',
        from_name: 'Ask — dakshsuthar.com',
        email: eml || 'no-reply@dakshsuthar.com',
        message:
          `New question from dakshsuthar.com/ask\n\n` +
          `Question:\n${v}\n\n` +
          `Reply-to email: ${eml || '(not provided — public answer only)'}\n` +
          `Time: ${new Date().toISOString()}`,
        botcheck: document.querySelector('input[name="ask_botcheck"]')?.value || ''
      }, 'ask');

      askWrap.innerHTML = `
        <div class="ask__thanks">
          <h3>Got it.</h3>
          <p>I read every question. If yours makes the cut, you'll see it answered here or on Instagram — usually within the week.${eml ? ' If it needs a private reply, I\'ll email you back at <strong style="color:var(--ink)">' + eml + '</strong>.' : ''}</p>
        </div>`;
    });
  }
  window.fillAsk = function (el) {
    const i = document.getElementById('askInput');
    if (i) { i.value = el.textContent; i.focus(); }
  };

  // ══════════════════════════════════════════════════════════
  // Web3Forms integration
  // Shared submit helper — sends any payload to Web3Forms with
  // verbose logging so failures are debuggable in DevTools.
  // ══════════════════════════════════════════════════════════
  const WEB3FORMS_KEY = '653ea76b-fbc1-4ebb-a13b-58712e49ccd9';

  async function submitToWeb3Forms(payload, label) {
    const body = { access_key: WEB3FORMS_KEY, ...payload };
    console.log(`[${label}] submitting to Web3Forms…`, body);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      console.log(`[${label}] Web3Forms responded:`, res.status, data);
      if (!res.ok || data.success === false) {
        console.warn(
          `[${label}] Submission may have failed.\n` +
          `→ Check https://app.web3forms.com/dashboard\n` +
          `→ Verify your email is confirmed (Web3Forms sends a verification email on first signup)\n` +
          `→ Check spam folder for the confirmation`
        );
      }
      return { ok: res.ok && data.success !== false, data };
    } catch (err) {
      console.error(`[${label}] Network error submitting to Web3Forms:`, err);
      return { ok: false, error: err };
    }
  }

  // ──────────────────────────────
  // Waitlist form (Extuter)
  // Saves locally for the count bump AND submits to Web3Forms so
  // the email lands in Daksh's inbox. Local save is a fallback —
  // even if the network fails, the user's intent is captured.
  // ──────────────────────────────
  const waitForm = document.getElementById('waitlistForm');
  if (waitForm) {
    waitForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = waitForm.querySelector('input[type="email"]');
      const submitBtn = waitForm.querySelector('button[type="submit"]');
      const email = emailInput?.value.trim();
      if (!email || !email.includes('@')) { emailInput?.focus(); return; }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Joining…';
      }

      // Local save first — bumps the visible count regardless of network
      try {
        const list = JSON.parse(localStorage.getItem('extuter__waitlist') || '[]');
        if (!list.includes(email)) list.push(email);
        localStorage.setItem('extuter__waitlist', JSON.stringify(list));
      } catch (err) {}

      // Send to Web3Forms — this is what actually emails Daksh
      await submitToWeb3Forms({
        subject: 'New Extuter waitlist signup',
        from_name: 'Extuter — dakshsuthar.com',
        email: email,
        message:
          `New Extuter waitlist signup from dakshsuthar.com\n\n` +
          `Email: ${email}\n` +
          `Time: ${new Date().toISOString()}\n` +
          `Source: Extuter launch page`,
        botcheck: waitForm.querySelector('input[name="botcheck"]')?.value || ''
      }, 'waitlist');

      const wrap = document.getElementById('waitlistWrap');
      if (wrap) {
        wrap.innerHTML = `
          <h2>You're on the list.</h2>
          <p>I'll email you the moment Extuter is live — no marketing junk, one message.</p>
        `;
      }
    });
  }
  // Bump the visible waitlist count so it feels alive
  const countEl = document.getElementById('waitlistCount');
  if (countEl) {
    try {
      const base = 1247;
      const local = (JSON.parse(localStorage.getItem('extuter__waitlist') || '[]')).length;
      countEl.textContent = (base + local).toLocaleString();
    } catch (e) { countEl.textContent = '1,247'; }
  }

  // ──────────────────────────────
  // Extuter countdown (target = 2026-10-03)
  // ──────────────────────────────
  const cd = document.getElementById('countdown');
  if (cd) {
    const target = new Date('2026-10-03T09:00:00+05:30').getTime();
    const dEl = document.getElementById('cd-d');
    const hEl = document.getElementById('cd-h');
    const mEl = document.getElementById('cd-m');
    const sEl = document.getElementById('cd-s');
    function tickCd() {
      const now = Date.now();
      let diff = Math.max(0, target - now);
      const d = Math.floor(diff / 86_400_000); diff -= d * 86_400_000;
      const h = Math.floor(diff / 3_600_000);  diff -= h * 3_600_000;
      const m = Math.floor(diff / 60_000);     diff -= m * 60_000;
      const s = Math.floor(diff / 1000);
      if (dEl) dEl.textContent = String(d).padStart(2, '0');
      if (hEl) hEl.textContent = String(h).padStart(2, '0');
      if (mEl) mEl.textContent = String(m).padStart(2, '0');
      if (sEl) sEl.textContent = String(s).padStart(2, '0');
    }
    tickCd();
    setInterval(tickCd, 1000);
  }

})();
