# DFWin International website

The marketing website and product catalog for DFWin International, a supply partner to cruise lines, shipyards and hotels. Its one job is to get a buyer to request a quote.

- **Live site:** https://kevinmjones.github.io/DFWIN/ (temporary address until the final domain is connected)
- **Repository:** https://github.com/kevinmjones/DFWIN

The site is a set of plain web pages. There is no database, no login and no server to look after. Content lives in a few data files, and a tool called Eleventy turns them into the finished pages.

## Start here

| You are | Read |
| --- | --- |
| The owner, making changes with Google Antigravity | [docs/WORKING-WITH-ANTIGRAVITY.md](docs/WORKING-WITH-ANTIGRAVITY.md) |
| The owner, wanting to be found on Google and AI assistants | [docs/AI-SEARCH-VISIBILITY.md](docs/AI-SEARCH-VISIBILITY.md) |
| Anyone changing how the site looks or reads | [DESIGN.md](DESIGN.md) |
| Anyone checking what the site may claim | [PRODUCT.md](PRODUCT.md) |
| An AI agent | [AGENTS.md](AGENTS.md) |

## Quick start

1. Install [Node.js](https://nodejs.org) 22 LTS or newer, and [Git](https://git-scm.com/downloads).
2. Get the code and install:

   ```bash
   git clone https://github.com/kevinmjones/DFWIN.git
   cd DFWIN
   npm install
   ```

3. Start the preview:

   ```bash
   npm run dev
   ```

4. Open http://localhost:8080. The page reloads when you save a file. Press Ctrl+C in the terminal to stop.

| Command | What it does |
| --- | --- |
| `npm run dev` | Preview the site on your computer with live reload. |
| `npm run build` | Build the finished site into `_site/`. |
| `npm run clean` | Delete `_site/`. |

## Folder map

```
DFWIN/
├── src/                      The website source
│   ├── *.njk                 One file per page (home, catalog, quote, services, ...)
│   ├── product.njk           One template that makes a page for every product
│   ├── _data/                The content
│   │   ├── site.json         Company name, emails, offices, quote settings
│   │   ├── nav.json          Header and footer links
│   │   ├── products.json     The catalog
│   │   ├── news.json         Contracts and company news
│   │   ├── stats.json        Headline figures, each with its source
│   │   ├── customers.json    Customers named on the site
│   │   ├── testimonials.json Customer quotes (empty until one is approved)
│   │   └── sectors.json      Hospitality, Marine, Technology
│   ├── _includes/            The shared page layout, header, footer, product card
│   ├── assets/css/           site.css (shared) and pages/ (one file per page)
│   ├── assets/js/            Catalog search, quote list, quote form
│   ├── assets/img/           Photos. Product photos are in img/products/
│   └── static/               Files copied to the site as they are
├── docs/                     Guides for the owner
├── .agents/                  Rules and skills for AI agents (Antigravity)
├── .github/workflows/        Automatic publishing
├── AGENTS.md                 Instructions for AI agents
├── GEMINI.md                 Points Gemini tools to AGENTS.md and DESIGN.md
├── DESIGN.md                 Design, wording and truth rules
├── PRODUCT.md                Verified facts and open questions
├── eleventy.config.js        Build settings
├── legacy/                   The previous site, kept for reference only
└── _site/                    The built site (made by the build, never edited)
```

## How do I...

Each task has a step-by-step skill that an AI agent follows. In Antigravity, type the command, or just describe what you want in plain words. The steps are also readable by a person.

| I want to | Command | Steps |
| --- | --- | --- |
| Add a product | `/add-product` | [add-product](.agents/skills/add-product/SKILL.md) |
| Change or remove a product | `/update-product` | [update-product](.agents/skills/update-product/SKILL.md) |
| Add a contract or news item | `/add-news-item` | [add-news-item](.agents/skills/add-news-item/SKILL.md) |
| Add a customer testimonial | `/add-testimonial` | [add-testimonial](.agents/skills/add-testimonial/SKILL.md) |
| Add a new page | `/add-page` | [add-page](.agents/skills/add-page/SKILL.md) |
| Change some wording | `/edit-text` | [edit-text](.agents/skills/edit-text/SKILL.md) |
| Change an email, office or company detail | `/change-contact-details` | [change-contact-details](.agents/skills/change-contact-details/SKILL.md) |
| Receive quote requests automatically | `/connect-quote-form` | [connect-quote-form](.agents/skills/connect-quote-form/SKILL.md) |
| Preview and publish my changes | `/preview-and-deploy` | [preview-and-deploy](.agents/skills/preview-and-deploy/SKILL.md) |
| Check search and AI visibility | `/seo-check` | [seo-check](.agents/skills/seo-check/SKILL.md) |
| Design a new section in the site's style | `/dfwin-design` | [dfwin-design](.agents/skills/dfwin-design/SKILL.md) |
| Write or check copy | `/dfwin-content` | [dfwin-content](.agents/skills/dfwin-content/SKILL.md) |
| Understand how the catalog works | `/dfwin-catalog` | [dfwin-catalog](.agents/skills/dfwin-catalog/SKILL.md) |
| Test the site before publishing | `/dfwin-qa` | [dfwin-qa](.agents/skills/dfwin-qa/SKILL.md) |

## How publishing works

1. You change files and commit them with Git.
2. You push the commit to GitHub.
3. GitHub Actions runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml): it installs the tools, runs `npm run build` and publishes the result to GitHub Pages.
4. One to three minutes later the live site shows the change.

Publishing runs on a push to the `main` or `redesign-2026` branch. Watch progress at https://github.com/kevinmjones/DFWIN/actions. If a run fails, the live site keeps its previous version.

One-time setup in GitHub: Settings, then Pages, then Build and deployment, with Source set to "GitHub Actions".

## How the quote form works

Visitors add products to a quote list, which is kept in their own browser. On the quote page they fill in their details. By default the site prepares an email for them to send to the sales address. To have requests arrive on their own in a Google Sheet and the sales inbox, follow [connect-quote-form](.agents/skills/connect-quote-form/SKILL.md).

## Rules that keep the site honest

- Nothing on the site is invented. Facts come from the data files in `src/_data/`, which come from DFWin's own published news.
- No testimonial is published without the customer's written approval of the exact words.
- No certifications, specifications, prices or lead times are claimed.

The full rules are in [DESIGN.md](DESIGN.md). The verified facts and the questions still open are in [PRODUCT.md](PRODUCT.md).
