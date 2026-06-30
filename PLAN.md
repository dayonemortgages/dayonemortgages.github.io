# Day One Mortgages - Website Working Plan

Hosting: GitHub Pages with custom domain `www.dayonemortgages.co.nz` configured in [CNAME](CNAME).

## 1. Current Architecture

The site is a static multi-page GitHub Pages site with no build step. It uses plain HTML, one shared CSS file, and vanilla JavaScript.

```
/index.html              Home
/home-loans.html
/commercial-loans.html
/insurance.html
/our-team.html
/calculator.html
/contact.html
/terms.html
/privacy.html
/disclosure.html
/assets/css/site.css     shared styles
/assets/js/site.js       partial loader, navigation, animations, testimonials, contact form
/assets/js/calculator.js
/image/                  logo, favicon images, hero image
/partials/header.html
/partials/footer.html
/404.html
/robots.txt
/sitemap.xml
/.nojekyll
```

Because shared page chrome is fetched at runtime, local previews must use an HTTP server. Direct `file://` previews will not load the shared header or footer.

## 2. Current Content Baseline

- Brand: Day One Mortgages & Insurance.
- Legal entity: Dayone Consulting Limited.
- FSP number: FSP1010095.
- Licence: Class 2 Financial Advice Provider licence, effective from 3 March 2022.
- Address: E4, 14-22 Triton Drive, Albany, Auckland 0632.
- Phone: 022 356 4348.
- Email: <Ben@dayonemortgages.co.nz>.
- Main services: home loans, investment property loans, construction loans, commercial loans, personal loans, and personal risk insurance.

Keep these details consistent across `index.html`, `privacy.html`, `disclosure.html`, `contact.html`, and `partials/footer.html`.

## 3. Active Follow-Up Work

1. Verify the W3Forms access key on `contact.html` by submitting a production-like test enquiry and confirming delivery to the correct Day One inbox.
2. Replace theme-based testimonial copy with approved client testimonials, or remove the slider until testimonials are supplied.
3. Add real team bio copy and any approved adviser/team photos.
4. Run mobile and desktop browser QA for navigation, fetched partials, calculator tabs, form states, and 404 handling.
5. Run Lighthouse or equivalent checks for accessibility, SEO, performance, and best practices.
6. Update `sitemap.xml` `lastmod` values after every public content change.

## 4. Optional Later Enhancements

- Bilingual pages under `/zh/` and `/ko/`.
- Market update or blog section.
- Newsletter signup.
- More calculators, such as borrowing power or lump-sum repayment scenarios.
- Analytics, with privacy wording reviewed before launch.
