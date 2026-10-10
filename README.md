# CloudGround documentation

The user documentation for [CloudGround](https://github.com/cloudground-it/cloudground): how
to install it, run sites on it and look after the server. It is published as the docs site of
the project.

## Structure

The pages follow [STANDARD.md](./STANDARD.md): each page is one of four types, and the sidebar
keeps the types apart.

| Folder | Group | Type |
| --- | --- | --- |
| `docs/tutorials/` | install CloudGround, the first site | tutorial |
| `docs/sites/` | create sites, settings, domains and certificates, routing, scheduled tasks | how-to |
| `docs/data/` | cache, staging and Safe Push, backups and restore tests, releases, databases, DB Studio | how-to |
| `docs/access/` | SFTP and SSH keys, the site shell, users and roles, two-step verification, API tokens, firewall | how-to |
| `docs/server/` | panel domain, services, logs, alerts and notifications, updates | how-to |
| `docs/reference/` | site types, site settings, roles and permissions, cache behaviour, paths and ports | reference |
| `docs/explanation/` | architecture, installer, request path, site lifecycle, isolation, Safe Push, backups, releases | explanation |
| `docs/cli/`, `docs/api/` | `cgctl` and the HTTP API, in their own sidebars | reference |

## Writing rules

[STANDARD.md](./STANDARD.md) is the rule book: page types, the front matter template, style,
verifiability and diagrams. In short: describe what the product does, measured on a server; no
third-party product names or comparisons; written from scratch; Italian and English page by page.
`npm run check` enforces what a script can check, and CI runs it before every build.

## Run it

Docusaurus 3, Italian by default and English under `/en/`. Node 20 or later.

```sh
npm ci
npm start              # Italian, live reload on http://localhost:3000
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

## Design

The theme implements `design/reference/docs.dc.html`. Fonts are self-hosted from
`static/fonts/` (Archivo, Instrument Serif, Geist Mono — SIL Open Font License, texts alongside).
Search is local (built at build time); there is no analytics and no external service.

## Status

Initialised on 2026-10-09. The pages were rewritten from the product's code and specifications in
Phase 9 of the CloudGround rewrite plan; every page stays `unverified` until it has been checked on
a test server.
