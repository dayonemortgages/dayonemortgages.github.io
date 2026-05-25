# Day One Mortgages Website

Static GitHub Pages site for `www.dayonemortgages.co.nz`.

## Structure

- `index.html` - home page
- `home-loans.html`, `commercial-loans.html`, `insurance.html` - service pages
- `our-team.html`, `calculator.html`, `contact.html` - company and enquiry pages
- `terms.html`, `privacy.html`, `disclosure.html` - legal pages converted from `data/Disclosure list.txt`
- `partials/header.html`, `partials/footer.html` - shared page chrome loaded by `assets/js/site.js`
- `assets/css/site.css` - local production CSS
- `assets/js/calculator.js` - mortgage repayment calculator

## Legal Content Workflow

`data/Disclosure list.txt` is the source of truth for terms, privacy, and disclosure wording. When legal text changes:

1. Update `data/Disclosure list.txt`.
2. Copy the relevant section into `terms.html`, `privacy.html`, or `disclosure.html`.
3. Preserve wording and only add semantic HTML structure such as headings, paragraphs, lists, and links.
4. Re-test the page locally before publishing.

## Local Preview

Because the site uses fetch-based partials, preview it through a local web server:

```sh
python3 scripts/serve.py 4173
```

Then open `http://localhost:4173/`.

This local server mirrors GitHub Pages behavior for missing paths by serving
`404.html` with a 404 status.
