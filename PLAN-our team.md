# Bilingual Our Team Pages Plan

## Summary
Create separate English and Korean Our Team pages, with `/our-team.html` as the English page and `/ko/our-team.html` as the Korean page. Use one shared profile data source so Ben’s profile and any future team profiles can be updated in one place while rendering the correct language on each page.

## Key Changes
- Add a shared profile data file, e.g. `assets/js/team-profiles.js`, exposing structured English and Korean content for each profile: name, alternate name, role, bio paragraphs, email, phone, and optional initials/photo fields.
- Refactor `our-team.html` so the profile card is rendered from the shared data source using a page-level language marker such as `<main data-team-page data-lang="en">`.
- Add `ko/our-team.html` with `lang="ko"`, Korean title/description/OG metadata, canonical URL `https://www.dayonemortgages.co.nz/ko/our-team.html`, and the same layout structure using `data-lang="ko"`.
- Add a small renderer, either inside `assets/js/site.js` or a new `assets/js/team.js`, that reads the language marker, renders all profiles into the `.team-grid`, and leaves contact links as `mailto:` and `tel:`.
- Add an English/Korean page switch on both Our Team pages only:
  - English page links to `/ko/our-team.html`.
  - Korean page links to `/our-team.html`.
  - Include `hreflang="en"`, `hreflang="ko"`, and `hreflang="x-default"` links in both pages.
- Keep global header/footer unchanged for now. The Korean page can use the existing English shared chrome, with only the Our Team page content translated.
- Update `sitemap.xml` to include `/ko/our-team.html` with current `lastmod`.
- Update `README.md` or `PLAN.md` with the new profile update workflow: edit profile text in the shared profile data file, then test both Our Team pages.

## Implementation Notes
- Use root-relative URLs throughout because the site is hosted at the domain root.
- Preserve the existing visual classes: `page-hero`, `section`, `team-grid`, `card`, `person-card`, `plain-list`, `section alt`, and `cta-band`.
- The English page should keep the current duties/CTA sections unless new copy is supplied.
- The Korean page should translate page hero, profile labels, duties section, disclosure link text, and CTA text into Korean.
- If translation copy is not supplied, create clear Korean draft copy based on the existing English meaning and mark it in the plan/update notes for human review before launch.

## Test Plan
- Run `git diff --check`.
- Validate `sitemap.xml` with `xmllint --noout sitemap.xml`.
- Serve locally over HTTP, not `file://`, because partials are fetched at runtime.
- Check `/our-team.html` and `/ko/our-team.html`:
  - Profile cards render in the correct language.
  - Email and phone links work.
  - Language switch links to the matching alternate page.
  - Header/footer still load.
  - Mobile layout does not overflow with Korean text.
- Confirm SEO metadata:
  - Correct `lang`, `canonical`, `og:url`, `title`, and `description`.
  - Correct reciprocal `hreflang` links.

## Assumptions
- “Out Team” means the existing `Our Team` page.
- Use `/ko/our-team.html` as the Korean URL.
- Keep Korean support scoped to the Our Team page for this change.
- Use a shared JavaScript profile data file so future profile updates happen once for both languages.
