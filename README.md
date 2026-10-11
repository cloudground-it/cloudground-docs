<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/media/banner-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset=".github/media/banner-light.svg">
    <img alt="CloudGround" src=".github/media/banner-light.svg" width="100%">
  </picture>
</p>

# cloudground.it — the website and the documentation

The single public website of [CloudGround](https://github.com/cloudground-it/cloudground), published
on GitHub Pages at **https://cloudground.it**:

| Address | What | Source |
| --- | --- | --- |
| `/` (`/en/`) | the home: what CloudGround is, its measurements, the install command | `src/pages/index.tsx`, `src/components/Home/` |
| `/docs` (`/en/docs`) | the user documentation: install it, run sites on it, look after the server | `docs/`, `i18n/en/docusaurus-plugin-content-docs/` |
| `/privacy` (`/en/privacy`) | what the site collects (nothing) | `src/pages/privacy.mdx`, `i18n/en/docusaurus-plugin-content-pages/` |

The installer (`get.cloudground.it`) is not here: the product repository's own Pages serve it.

## The home

React components and CSS modules in `src/components/Home/`, ported from the approved design
(`design/reference/home.dc.html` of the former WordPress project). Italian copy in the components,
English in `i18n/en/code.json` (keys `home.*`, `cg.*`; `npm run write-translations -- --locale en`
adds new keys). The rules it keeps:

- **Every number is measured.** The table under *Misure* quotes the means in
  `bench/phase-10-fresh.md` of the product repository (section *The release candidate on the
  purged box*); `src/data/site.ts` links it. A number that is not in a benchmark record is not
  written. No other panel or host is named or compared.
- **No JavaScript needed for the content**: the cache switch and the copy button are the only
  controls, and without JavaScript they are not drawn. Motion stops with `prefers-reduced-motion`.
- **No external requests**: fonts, search and images are served by the site; no analytics, no
  forms. `/privacy` says so, and changes in the same commit as anything that changes it.
- Light and dark from the tokens in `src/css/custom.css`; 16px gutters on a phone.

The social card is `static/img/og.png` (1200×630), drawn from `scripts/og-image.html`.

## Structure

The pages follow [STANDARD.md](./STANDARD.md): each page is one of four types, and the sidebar
keeps the types apart.

| Folder | Group | Type |
| --- | --- | --- |
| `docs/tutorials/` | install CloudGround, the first site | tutorial |
| `docs/sites/` | create sites, settings, domains and certificates, routing, scheduled tasks | how-to |
| `docs/data/` | cache, staging and Safe Push, backups and restore tests, releases, databases, Quarry | how-to |
| `docs/access/` | SFTP and SSH keys, the site shell, users and roles, two-step verification, API tokens, firewall | how-to |
| `docs/server/` | panel domain, services, logs, alerts and notifications, updates, verifying the installer, uninstall | how-to |
| `docs/reference/` | site types, site settings, roles and permissions, cache behaviour, paths and ports | reference |
| `docs/explanation/` | architecture, installer, request path, site lifecycle, isolation, Safe Push, backups, releases | explanation |
| `docs/cli/`, `docs/api/` | `cgctl` and the HTTP API, in their own sidebars | reference |

## Writing rules

[STANDARD.md](./STANDARD.md) is the rule book: page types, the front matter template, style,
verifiability and diagrams. In short: describe what the product does, measured on a server; no
third-party product names or comparisons; written from scratch; Italian and English page by page.
`npm run check` enforces what a script can check, and CI runs it before every build.

## Run it

Docusaurus 3, Italian by default and English under `/en/`; the guide under `/docs`. Node 20 or
later.

```sh
npm ci
npm start              # Italian, live reload on http://localhost:3000 (guide at /docs)
npm run start:en       # English (one locale at a time in dev mode)
npm run build          # both locales into build/
npm run serve          # serve build/ to check it as it will be published
npm run typecheck
npm run check          # STANDARD.md rules; add -- --strict to refuse unverified pages
```

English pages live under `i18n/en/docusaurus-plugin-content-docs/current/`, with the same paths
as `docs/`; interface strings are in `i18n/<locale>/code.json`.

## Writing a page

Start from the front matter template in [STANDARD.md](./STANDARD.md) §2. The theme reads, besides
`title` and `description`:

```yaml
heading: Installa               # big title (defaults to title)
heading_accent: CloudGround.    # serif italic accent, in blue
type: how-to                    # shown in the header strip
prerequisites: [Accesso root]   # shown as "Serve"
version: unreleased
last_verified: unverified       # shown as "Non verificata" until a date is set
meta: {time: '10 minuti', level: Base}   # optional extra cells
```

Available in every page without an import: `<Tabs>`/`<TabItem>`, `<Steps>`/`<Step title>`,
`<Cards>`/`<Card to label title>`. Diagrams: a ` ```mermaid ` block, with no colours of its own (the theme sets them). Admonitions: `:::warning[Title]` and `:::danger` draw an ink
bar, `:::note`, `:::info` and `:::tip` a blue one. Code blocks have line numbers
(`noLineNumbers` turns them off); `prompt` in the meta draws a root `#` before each command and
leaves comments out of Copy.

## Publishing

`.github/workflows/build.yml` checks and builds every push and pull request; a push to `main` also
deploys `build/` to GitHub Pages (source: GitHub Actions). `static/CNAME` holds `cloudground.it`;
`static/.nojekyll` keeps Pages from running Jekyll. DNS for the apex: `A` records to
185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153, `AAAA` records to
2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153, and
`www` as a `CNAME` to `cloudground-it.github.io`.

## Design

The docs theme implements `design/reference/docs.dc.html`; the home, navbar, status strip and
footer follow the website's home design, so the two read as one site. Fonts are self-hosted from
`static/fonts/` (Archivo, Instrument Serif, Geist Mono — SIL Open Font License, texts alongside).
Search is local (built at build time); there is no analytics and no external service.

## Status

Initialised on 2026-10-09. The pages were rewritten from the product's code and specifications in
Phase 9 of the CloudGround rewrite plan; every page stays `unverified` until it has been checked on
a test server.

## Support

CloudGround is built and maintained by one person. If it saves you time, you can support it on
[GitHub Sponsors](https://github.com/sponsors/manuto276).
