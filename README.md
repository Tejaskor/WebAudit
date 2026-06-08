# Website Audit Tool

A comprehensive website audit tool that analyzes sites across 10 modules — heuristics, UX, UI, performance, SEO, content, technical, CRO, security, and competitor benchmarking — with AI-powered analysis and professional PDF/HTML report export.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API keys

Copy the example env file and add your keys:

```bash
cp .env.example .env
```

Edit `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...    # Required — powers AI heuristic analysis
PAGESPEED_API_KEY=               # Optional — enables Core Web Vitals data
PORT=3000                        # Optional — default 3000
```

### 3. Run

```bash
npm start
```

The app opens automatically in your default browser at `http://localhost:3000`.

## Deployment

> **Note on GitHub Pages:** This app **cannot** run on GitHub Pages. GitHub Pages
> only serves static files, but this is a Node.js + Express server that launches
> headless Chrome (Puppeteer) to audit sites and generate PDFs. It must be hosted
> on a platform that runs Node + Chrome. Use one of the options below.

The repo ships with a `Dockerfile` that installs Google Chrome, so Puppeteer works
out of the box on any container host.

### Option A — Render (recommended, free tier)

A `render.yaml` blueprint is included.

```bash
# 1. Push your code to GitHub
git add .
git commit -m "Add deployment config"
git push origin main

# 2. In the Render dashboard: New + → Blueprint → select this repo.
#    Render reads render.yaml and builds the Dockerfile automatically.
# 3. Add your PAGESPEED_API_KEY (optional) in the service's Environment tab.
```

Your app will be live at `https://<service-name>.onrender.com`.

### Option B — Railway

```bash
npm i -g @railway/cli
railway login
railway init
railway up        # builds the Dockerfile and deploys
```

### Option C — Fly.io

```bash
curl -L https://fly.io/install.sh | sh
fly launch --dockerfile Dockerfile   # accept the detected Dockerfile
fly deploy
```

### Required environment variables (set in the host dashboard)

| Variable | Required | Notes |
|----------|----------|-------|
| `NODE_ENV` | yes | Set to `production` (disables local browser auto-open) |
| `PUPPETEER_EXECUTABLE_PATH` | yes (Docker) | `/usr/bin/google-chrome-stable` — set by the Dockerfile |
| `PAGESPEED_API_KEY` | optional | Enables Core Web Vitals data |
| `PORT` | no | Provided automatically by the host |

### Troubleshooting

| Symptom | Cause / Fix |
|---------|-------------|
| `Failed to launch the browser process` | Chrome missing. Ensure you deploy via the included `Dockerfile` (Render: runtime `docker`). Confirm `PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable`. |
| `No usable sandbox!` | Already handled — launches use `--no-sandbox`. |
| Audits time out / crash with low memory | Puppeteer needs RAM. Render free tier (512 MB) works for single audits; upgrade the plan for heavy/concurrent use. The `--disable-dev-shm-usage` flag is already set. |
| Build downloads Chromium twice / slow build | `PUPPETEER_SKIP_DOWNLOAD=true` (set in Dockerfile) prevents the duplicate download. |
| App exits immediately on host | Host didn't pass `NODE_ENV=production`; the dev `xdg-open` call would fail. It's now guarded, but set `NODE_ENV=production` anyway. |
| 502 right after deploy | First request cold-starts Chrome; wait ~30s. Render free tier also sleeps when idle. |

### Verification checklist

1. Build succeeds (`docker build -t webaudit .` locally, or host build log is green).
2. Service URL returns the landing page (HTTP 200).
3. `POST /api/audit` with `{}` returns `400 {"error":"URL is required"}`.
4. Run a real audit against a public URL — live SSE progress appears.
5. PDF / HTML / screenshot export downloads successfully.

## Audit Modules

| Module | What it checks |
|--------|---------------|
| **Nielsen's Heuristics** | AI + rule-based evaluation against all 10 Nielsen Norman heuristics |
| **UX** | Navigation, CTAs, mobile viewport, accessibility (alt text, ARIA, keyboard nav) |
| **UI / Visual Design** | Typography, color palette, contrast (WCAG), heading hierarchy, image quality |
| **Performance** | Load time, TTFB, resource counts, lazy loading, PageSpeed Insights (optional) |
| **SEO** | Meta tags, OG tags, heading structure, sitemap, robots.txt, broken links, structured data |
| **Content** | Word count, Flesch-Kincaid readability, CTA language, content density |
| **Technical** | Broken links, HTTPS redirects, redirect chains, schema markup, charset, favicon |
| **CRO** | CTA analysis, form usability, trust signals, funnel clarity |
| **Security** | HTTPS/SSL, security headers (CSP, HSTS, X-Frame-Options), mixed content, outdated libraries |
| **Competitor** | Side-by-side comparison of performance, SEO, and security scores |

## Features

- Real-time progress indicators via Server-Sent Events
- Overall score (0-100) with weighted module scores
- Severity badges (Critical / Warning / Good) per finding
- Collapsible report sections
- Executive summary with top 5 priority fixes
- Export as styled PDF or standalone HTML
- Optional competitor benchmarking (up to 2 URLs)

## Tech Stack

- **Backend**: Node.js + Express
- **Scraping**: Puppeteer (headless Chrome) + Cheerio
- **AI Analysis**: Anthropic Claude API
- **Performance**: Google PageSpeed Insights API (optional)
- **PDF Export**: Puppeteer PDF rendering
- **Frontend**: Vanilla HTML/CSS/JS
