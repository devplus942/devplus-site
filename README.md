# DevPlus+ Website

A static, multi-page marketing website for **DevPlus+** — "Building Innovative Digital Solutions."
Plain HTML/CSS/JS, no build tools or frameworks required at runtime, so it works on GitHub Pages out of the box.

## What's included

- 12 pages: Home, About, Services, Portfolio, Pricing, FAQ, Blog, Careers, Contact, Privacy, Terms, 404
- Dark/light theme toggle, mobile nav, scroll-reveal animations, loading screen, scroll-progress bar
- Command palette (press `Ctrl/Cmd + K`), cookie consent banner, back-to-top button, WhatsApp float button
- Working contact form validation and newsletter form (front-end only — see "Connecting the contact form" below)
- SEO: meta tags, Open Graph, Twitter Cards, JSON-LD structured data, `robots.txt`, `sitemap.xml`
- Responsive down to mobile, keyboard-focus states, `prefers-reduced-motion` respected

## Folder structure

```
devplus-site/
├── index.html, about.html, services.html, ...   ← final pages (open these)
├── css/styles.css
├── js/main.js
├── assets/logo.png
├── robots.txt
├── sitemap.xml
├── src/                                          ← source partials (only needed if you edit content)
│   ├── partials/head.html, header.html, footer.html
│   └── pages/*.html                              ← page content + SEO metadata
└── build.py                                      ← rebuilds the pages in step 1 from src/
```

You only need the top-level `.html` files, `css/`, `js/`, `assets/`, `robots.txt`, and `sitemap.xml` to host the site.
The `src/` folder and `build.py` are there so you (or Claude) can edit content later without duplicating the header/footer on every page — edit a file in `src/pages/`, then run `python3 build.py` to regenerate the top-level `.html` files.

## Deploy to GitHub Pages

1. Create a new GitHub repository, e.g. `devplus-site`.
2. Push everything in this folder to the repo:
   ```bash
   cd devplus-site
   git init
   git add .
   git commit -m "Initial DevPlus+ website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/devplus-site.git
   git push -u origin main
   ```
3. On GitHub: go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
5. Save. GitHub will publish your site at:
   `https://devplus942.github.io/devplus-site/`

It can take 1–2 minutes for the first deploy to go live.

### Before you publish (recommended)

- **Update the site URL**: replace every `YOUR-USERNAME.github.io/devplus-site` placeholder in `src/pages/*.html` (the `"url"` fields and the `SITE_URL` variable at the top of `build.py`), then re-run `python3 build.py`. This affects canonical URLs, Open Graph tags, and the sitemap.
- **Real contact details**: swap the placeholder phone/WhatsApp number and email in `src/partials/footer.html` and `src/pages/contact.html`.
- **Custom domain (optional)**: add a `CNAME` file with your domain name at the repo root, and point your domain's DNS to GitHub Pages.

## Connecting the contact form

The contact and newsletter forms currently validate input and show a success state, but don't send email anywhere — GitHub Pages only serves static files, so there's no backend to receive form submissions. To make it functional, pick one:

- **[Formspree](https://formspree.io)** or **[Web3Forms](https://web3forms.com)** — free, no backend needed. Point the form's `action` at the endpoint they give you.
- **EmailJS** — send email directly from the browser using your own email account. Add the EmailJS script and swap the `setTimeout` in `js/main.js` (`contactForm` function) for an `emailjs.send()` call.

## Local preview

Just open `index.html` in a browser, or run a tiny local server for cleaner relative-path behavior:

```bash
cd devplus-site
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Editing content later

1. Edit the relevant file in `src/pages/` (page copy) or `src/partials/` (shared header/footer).
2. Run `python3 build.py` from the project root.
3. Commit and push — GitHub Pages redeploys automatically.
