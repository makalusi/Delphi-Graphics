# Delphi Graphics — Content Manager Guide

The site now has a built-in admin panel (Decap CMS) so the owner can add, edit,
and remove content without touching code. Changes are saved to GitHub and the
site redeploys automatically.

## What the owner can edit

Open **`https://YOUR-SITE.netlify.app/admin/`** and log in. Two sections appear:

### 1. Services & Products (`All Services`)
- Add a new service, edit an existing one, or delete one.
- Each service has: title, category, tagline, description, price, main image,
  photo gallery, key features, and related services.
- Images are uploaded straight from the browser (stored in `assets/uploads/`).
- The **URL Slug** must be lowercase with hyphens (e.g. `business-cards`) and
  unique — it becomes the service's web address
  (`service-detail.html?item=business-cards`).

### 2. Site Settings (`Contact Info & Homepage Text`)
- WhatsApp number (used by every "WhatsApp Us" button and the checkout flow)
- Phone numbers, email addresses, physical address
- Homepage headline and subtitle

After clicking **Publish**, Netlify rebuilds the site — changes go live in
about 1–2 minutes.

## One-time setup (do this once when deploying to Netlify)

1. **Push this repo to GitHub** (if not already) and create a site on
   [Netlify](https://app.netlify.com) with **Add new site → Import an existing
   project**, pointing at the GitHub repo. The build settings are already in
   `netlify.toml` (build: `npm run build:css`, publish: root).

2. **Enable Identity**: in the Netlify site dashboard go to
   **Site configuration → Identity → Enable Identity**.

3. **Restrict who can register**: under **Identity → Registration**, set it to
   **Invite only**.

4. **Enable Git Gateway**: under **Identity → Services → Git Gateway**, click
   **Enable Git Gateway**. This is what lets the CMS save edits to GitHub
   without the owner needing a GitHub account.

5. **Invite the owner**: under **Identity**, click **Invite users** and enter
   the owner's email. They'll receive an email — clicking the invite link opens
   the site where they set a password, then they land in `/admin/`.

That's it. From then on the owner just visits `/admin/`, logs in, and edits.

## Notes for developers

- Services data lives in `data/services.json` as `{ "services": [ ... ] }`
  (an array; each entry carries its own `slug`). The page scripts in
  `index.html`, `service-detail.html`, and `js/script.js` accept both this
  format and the old slug-keyed object.
- Contact info and homepage text live in `data/site.json` and are applied at
  page load by `js/site-config.js`. The HTML keeps the original values as
  fallbacks; the script finds them (by the defaults listed at the top of
  `site-config.js`) and swaps in the current values. If you ever hand-edit the
  contact details directly in the HTML, update those defaults to match.
- The CMS itself is `admin/index.html` + `admin/config.yml`. To add a new
  editable field, add it to `config.yml` and (for site settings) either tag an
  element with `data-site="field_name"` or extend `site-config.js`.
- CMS image uploads go to `assets/uploads/`.
- The CMS commits to the `master` branch (set in `admin/config.yml`).
