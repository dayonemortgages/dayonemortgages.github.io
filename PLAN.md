# Day One Mortgages — Website Build Plan

Reference site: <https://www.supercitymortgages.co.nz/>
Hosting: GitHub Pages (free tier) with custom domain `www.dayonemortgages.co.nz` (already configured via [CNAME](CNAME)).

---

## 1. Current State

- [src/index.html](src/index.html) is a Tailwind + Lucide single-page prototype branded "Dayone Mortgages". Sections present: Header, Hero, Services, About, Team, Calculator, Testimonials, Contact, Footer. Copy still contains placeholders ("Clarity Financial", placeholder images, generic team bios, generic email).
- [CNAME](CNAME) → `www.dayonemortgages.co.nz`.
- [data/Disclosure list.txt](data/Disclosure%20list.txt) (mirrored in `Disclosure list.docx`) contains real legal/business content:
  - Website Terms of Use
  - Privacy Policy
  - Disclosure / Important Information (FSP1010095, Class 2 FAP licence, lender panel, products, fees, complaints).
- [image/logo.png](image/logo.png) is the only brand asset.
- Reference site is a multi-page WordPress site with: Home Loans, Commercial Loans, Insurance, Our Team, Calculator, Market Update, Contact, Terms, Privacy, plus bilingual (中文 / 한국어) variants, testimonials carousel, "Why Choose" pillars, and a footer contact block.

## 2. Target Architecture (GitHub Pages friendly)

Static multi-page site, no build step required. Pure HTML + Tailwind + vanilla JS so Pages serves it directly. Move `src/index.html` to the **repo root** so URLs are clean.

```
/index.html              Home
/home-loans.html
/commercial-loans.html
/insurance.html
/our-team.html
/calculator.html
/terms.html              ← from data/Disclosure list.txt §Website Terms of Use
/privacy.html            ← from §Privacy Policy
/disclosure.html         ← from §Important Information
/contact.html            (or anchor on home)
/assets/css/site.css     shared styles
/assets/js/site.js       shared nav + animations
/assets/js/calculator.js
/image/                  logos, hero, team photos
/partials/header.html    (if using fetch-based partials)
/partials/footer.html
/CNAME                   keep
/404.html                custom not-found
/robots.txt
/sitemap.xml
.nojekyll                serve files starting with `_` verbatim
```

Optional (phase 2): bilingual `/zh/`, `/ko/` folders matching the reference site's language toggle.

## 3. Content Source of Truth

Extract real copy from [data/Disclosure list.txt](data/Disclosure%20list.txt):

- Brand: **Day One Mortgages & Insurance** (legal: Dayone Consulting Limited, FSP1010095, Class 2 FAP since 3 March 2022).
- Address: E4, 14-22 Triton Drive, Albany, Auckland 0632.
- Phone: 022 356 4348. Email: <Ben@dayonemortgages.co.nz>.
- Lender panel (ANZ, ASB, BNZ, Westpac, Kiwibank, Co-operative Bank, SBS, Heartland, Pepper, Avanti, Liberty, Bluestone, Basecorp, CFML, ASAP, Southern Cross Partners, Prospa, Pallas, Funding Partners, First Mortgage Trust, Finbase, Plus, Vincent, Cressida, DBR, Bank of China, CCB, ICBC) — drives the Home Loans page.
- Product list (Home / Investment / Construction / Commercial / Personal Loans, Personal Risk Insurance) — drives Services.

Replace every placeholder in current `index.html` with the above.

---

## 4. Step-by-Step Plan

### Step 1 — Repo / hosting setup
1. Move `src/index.html` → `/index.html` so GitHub Pages serves from the default branch root.
2. GitHub → **Settings → Pages** → Source = `main` / root. Verify DNS for `www.` (CNAME) and apex (A/ALIAS) point to GitHub Pages. Enable **Enforce HTTPS**.
3. Add `.nojekyll` at root.

### Step 2 — Shared layout
4. Define brand palette + typography once via inline `tailwind.config` script.
5. Extract `<header>` (with mobile menu) and `<footer>` into reusable partials. Options:
   - **Recommended:** small `site.js` that injects `partials/header.html` and `partials/footer.html` via `fetch()` — keeps DRY without a build step.
   - Alternative A: duplicate markup per page (simpler, more maintenance).
   - Alternative B: enable Jekyll on Pages and use `_includes` (Pages supports it natively).
6. Footer must include: Albany address, phone, email, social links, links to Terms / Privacy / Disclosure, FSP number, copyright.

### Step 3 — Page-by-page build
7. **Home (`index.html`)** — mirror reference layout:
   - Hero with primary CTA "Apply for pre-approval".
   - 3 service teaser cards (Home Loans, Commercial Loans, Insurance) linking to dedicated pages.
   - "Why choose Day One" 3-pillar block.
   - Testimonials carousel (vanilla JS slider).
   - Market update / news teaser (optional, defer if no content).
   - Contact CTA band.
8. **Home Loans page** — pre-approval, refinancing, first-home, investment, construction. Include "Lenders we work with" grid from the disclosure doc.
9. **Commercial Loans page** — development & business loans copy.
10. **Insurance page** — personal risk insurance, "Free insurance review" CTA.
11. **Our Team page** — bios (placeholder until photos/bios provided).
12. **Calculator page** — move existing calculator out of home into its own page; keep JS in `assets/js/calculator.js`. Room to add a borrowing-power calculator later.
13. **Terms / Privacy / Disclosure pages** — convert the three sections of `data/Disclosure list.txt` to semantic HTML (`<h1>`, `<h2>`, `<ul>`) verbatim. Document the conversion process in README so future edits to the source doc flow back.
14. **Contact** — section on Home + a small standalone page. Static-site form options:
    - `mailto:` link (simplest; what we have today).
    - **Formspree** / Web3Forms free tier (recommended once volume grows). Add honeypot field for spam.

### Step 4 — UX / design polish
15. Replace inline SVG logo in header with `image/logo.png`.
16. Replace placeholder images with real ones in `/image/` (hero, office, team headshots). Until provided, use neutral SVG illustrations instead of `placehold.co`.
17. Active-link highlighting in `site.js`; ensure mobile nav works on every page.
18. Keep existing IntersectionObserver fade-in animation.

### Step 5 — Performance, SEO, compliance
19. Replace Tailwind **CDN** with a compiled `assets/css/tailwind.css` produced by a GitHub Action (`tailwindcss -i in.css -o assets/css/tailwind.css --minify`) so the live site doesn't depend on the CDN script.
20. Add per-page `<title>`, `<meta name="description">`, Open Graph + Twitter cards, `canonical` URLs, JSON-LD `FinancialService` schema (name, address, phone, FSP number, areaServed: NZ).
21. Add `/sitemap.xml` and `/robots.txt`.
22. Generate favicon set from `image/logo.png`.
23. Accessibility pass: alt text, color contrast, focus rings, `aria-expanded` on mobile menu toggle, skip-to-content link.
24. If using analytics (e.g., GA4 or Plausible), add a small cookie notice referencing the Privacy Policy.

### Step 6 — QA & launch
25. Local test: `npx serve .` or VS Code Live Server.
26. Cross-browser + mobile check; Lighthouse ≥ 90 for Perf / SEO / Best Practices / A11y.
27. Validate links, mailto, calculator math edge cases.
28. Commit → push `main` → verify `https://www.dayonemortgages.co.nz` serves with HTTPS.
29. Submit sitemap to Google Search Console.

### Step 7 — Post-launch (optional, phased)
30. Bilingual pages (`/zh/`, `/ko/`) + language switcher.
31. Market Update / blog (plain HTML pages or switch to Jekyll for `_layouts` + `_posts`).
32. Newsletter signup via Mailchimp / Buttondown embed.
33. Migrate contact form from `mailto:` to a hosted form endpoint when volume justifies it.

---

## 5. Open Decisions

1. Move `index.html` to repo root, or keep `/src/` and configure Pages to serve from there?
2. Plain duplicated headers/footers, **fetch-based partials**, or **Jekyll `_includes`**?
3. Contact form: stick with `mailto:` for v1, or set up Formspree now?
4. OK to convert `data/Disclosure list.txt` verbatim into Terms / Privacy / Disclosure pages (no wording changes)?
5. Any real assets available now (team photos, bios, hero image, testimonials), or use neutral placeholders marked `TODO`?
