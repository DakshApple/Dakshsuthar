# Deploying dakshsuthar.com

Three ways to go live. Pick one. All three are free for a personal site.

---

## Option 1 — Vercel (recommended, 60 seconds)

**Best if:** you want the fastest deploy and easiest custom domain.

1. Push the `site/` folder to a GitHub repo (or any Git host Vercel supports).
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. **Framework preset:** Other.
4. **Root directory:** `site` (if the folder isn't at the repo root).
5. **Build command:** leave empty.
6. **Output directory:** leave empty (Vercel serves the root by default).
7. Click Deploy.

You'll get a `dakshsuthar-*.vercel.app` URL immediately.

**Custom domain (dakshsuthar.com):**
- In Vercel project → Settings → Domains → Add `dakshsuthar.com` and `www.dakshsuthar.com`.
- Vercel gives you DNS records to add at your registrar (GoDaddy, Namecheap, Cloudflare, wherever the domain is).
- Add an A record for `@` pointing to Vercel's IP, and a CNAME for `www` pointing to `cname.vercel-dns.com`.
- Wait 5-30 minutes for DNS to propagate. Done.

---

## Option 2 — Netlify

**Best if:** you like drag-and-drop or want Netlify Forms later.

**Fastest way — drag &amp; drop:**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the entire `site/` folder onto the drop zone.
3. Live in ~10 seconds.

**Git-connected way:**
1. Push `site/` to GitHub.
2. Netlify → Add new site → Import from Git.
3. **Base directory:** `site` (if not at repo root).
4. **Build command:** leave empty.
5. **Publish directory:** `.` (or `site` if not set as base).
6. Deploy.

Custom domain works the same way as Vercel — Netlify walks you through the DNS steps.

---

## Option 3 — GitHub Pages

**Best if:** you want everything to live inside one GitHub repo, no third party.

1. Create a repo (public), push the contents of `site/` to it (not the `site/` folder itself — the files should be at the repo root).
2. Repo → Settings → Pages.
3. **Source:** Deploy from a branch.
4. **Branch:** `main` → `/ (root)` → Save.
5. Wait 1-2 minutes. Site goes live at `https://<username>.github.io/<repo>/`.

**Custom domain:**
- Add a file called `CNAME` at the root containing just `dakshsuthar.com` (no protocol, no path).
- At your DNS registrar, add A records pointing to GitHub Pages' IPs and a CNAME for `www` → `<username>.github.io`.
- Back in repo Settings → Pages, enter the custom domain and check &ldquo;Enforce HTTPS&rdquo; once the certificate is provisioned.

---

## Before you go live — checklist

- [ ] Cal.com booking works end-to-end: pick topic → write context → see calendar → book a test slot into a personal email. Confirm the topic + context show up in the booking notes.
- [ ] The `waitlistForm` (Extuter) and `askSend` (Ask Daksh) forms save to localStorage as expected. If you want real email capture, wire these to a backend (Formspree, Netlify Forms, or a Google Apps Script webhook) — the current version just saves locally for demo purposes.
- [ ] Update `now.html` &ldquo;Last updated&rdquo; date whenever you change it.
- [ ] Replace the placeholder journal cards with real entries as they go live.
- [ ] Test on mobile — this site was built mobile-first but check on the exact devices you care about.
- [ ] Update the meta title and description tags per page — currently good defaults, but tighten as needed.

---

## Making the forms actually send email

Right now, the Ask and Waitlist forms save to `localStorage` only — they demo the UX but don't reach you. To wire them up:

**Easiest — Formspree:**
1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month).
2. Create a form, get an endpoint like `https://formspree.io/f/xxxxxxx`.
3. In `assets/js/main.js`, find the `waitForm.addEventListener('submit', ...)` block and add a `fetch(endpoint, {method:'POST', body: JSON.stringify({email})})` call.
4. Same for the Ask form.

**Better — Netlify Forms:**
- If you deployed to Netlify, just add `netlify` and `name="waitlist"` attributes to the form tags. Zero config, submissions show up in the Netlify dashboard.

**Best for scale — your own webhook:**
- Google Apps Script deployed as a web app → free, unlimited, sends to your Gmail directly. Ping me if you want the snippet.

---

## Updating the site after launch

- Edit a file, commit, push — Vercel/Netlify auto-deploy in ~20 seconds.
- For GitHub Pages, it's 1-2 minutes.
- No build step means no build failures. Just make sure paths in new pages point to the right relative depth (`assets/...` from root, `../assets/...` from `/work/` or `/journal/`).

---

Built to be edited by hand. Not built to be Frankensteined into a framework. Keep it simple.
