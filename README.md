# Day One Mortgages Website

Static GitHub Pages site for `www.dayonemortgages.co.nz`.

## Structure

- `index.html` - home page
- `home-loans.html`, `commercial-loans.html`, `insurance.html` - service pages
- `our-team.html`, `calculator.html`, `contact.html` - company and enquiry pages
- `ko/our-team.html` - Korean version of the team page
- `terms.html`, `privacy.html`, `disclosure.html` - legal and disclosure pages
- `partials/header.html`, `partials/footer.html` - shared page chrome loaded by `assets/js/site.js`
- `assets/css/site.css` - local production CSS
- `assets/js/site.js` - partial loading, navigation, testimonial slider, and contact form handling
- `assets/js/team-profiles.js` - shared English and Korean team profile content
- `assets/js/team.js` - team profile renderer for the English and Korean team pages
- `assets/js/calculator.js` - mortgage repayment calculator
- `image/` - logo, favicon source assets, and page imagery

## Architecture Notes

This is a static GitHub Pages site with no build step. Shared header and footer markup are injected with `fetch()` from `assets/js/site.js`, so preview the site through HTTP rather than opening files directly with `file://`.

The public pages intentionally use root-relative URLs such as `/contact.html` because the production site is served from the domain root.

## Team Profile Workflow

The English and Korean team pages render profile cards from `assets/js/team-profiles.js`. When profile details change:

1. Update the matching English (`en`) and Korean (`ko`) content in `assets/js/team-profiles.js`.
2. Keep shared contact details such as email and phone at the profile root so both languages stay aligned.
3. Preview both `/our-team.html` and `/ko/our-team.html` through the local server.
4. Update `sitemap.xml` `lastmod` values for both team pages.

The current Korean page copy is a draft translation and should be reviewed before launch.

## Legal Content Workflow

The current legal text lives directly in `terms.html`, `privacy.html`, and `disclosure.html`. When legal text changes:

1. Confirm the approved wording with Day One before editing.
2. Update the relevant HTML page while preserving the approved wording.
3. Only add semantic HTML structure such as headings, paragraphs, lists, and links.
4. Keep company name, address, phone, email, FSP number, and complaint details consistent across the legal pages and shared footer.
5. Re-test the page locally before publishing.

## Launch Checks

- Submit a test enquiry through the contact form and confirm the W3Forms access key routes messages to the correct Day One inbox.
- Confirm direct email and phone links work.
- Re-run a browser check for shared header/footer loading, mobile navigation, calculator interactions, and the custom 404 page.
- Update `sitemap.xml` `lastmod` values whenever public content changes.

## Local Preview

Because the site uses fetch-based partials, preview it through a local web server:

```sh
python3 scripts/serve.py 4173
```

Then open `http://localhost:4173/`.

This local server mirrors GitHub Pages behavior for missing paths by serving
`404.html` with a 404 status.
