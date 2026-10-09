# CloudGround documentation

The user documentation for [CloudGround](https://github.com/cloudground-it/cloudground): how
to install it, run sites on it and look after the server. It is published as the docs site of
the project.

## Structure

| Section | What it covers |
| --- | --- |
| `docs/getting-started/` | requirements, one-command install, first sign-in, panel domain and certificate |
| `docs/sites/` | creating sites (WordPress, WooCommerce, PHP, Laravel, static, reverse proxy), domains and aliases, SSL, staging, deploys, files, SFTP and SSH keys, cron, databases |
| `docs/performance/` | the page cache, PHP tuning, object cache, what the defaults are and how they were measured |
| `docs/backups/` | off-site repositories (S3, R2, SFTP…), schedules and retention, verified restores |
| `docs/security/` | isolation between sites, users and roles, two-factor sign-in, the firewall, updates |
| `docs/administration/` | services, logs, alerts and notifications, upgrades, moving to another server |
| `docs/cli/` | `cgctl`, generated from the code |
| `docs/api/` | the HTTP API, generated from the code |
| `docs/troubleshooting/` | known problems and how to read the logs |

## Writing rules

1. **Describe what the product does, measured on a server.** Every command, path, port and
   screenshot comes from a real install of the version the page names.
2. **No third-party product names** (other panels or hosts) and no comparisons with them.
3. **Written from scratch.** Nothing is copied from another project's documentation.
4. Italian and English, with the same page in both languages.

## Run it

Docusaurus 3, Italian by default and English under `/en/`. Node 20 or later.

```sh
npm ci
npm start              # Italian, live reload on http://localhost:3000
npm run start:en       # English (one locale at a time in dev mode)
npm run build          # both locales into build/
npm run serve          # serve build/ to check it as it will be published
npm run typecheck
```

English pages live under `i18n/en/docusaurus-plugin-content-docs/current/`, with the same paths
as `docs/`; interface strings are in `i18n/<locale>/code.json`.

## Writing a page

Front matter drives the page header:

```yaml
title: Installazione            # sidebar and <title>
heading: Installa               # big title (defaults to title)
heading_accent: CloudGround.    # serif italic accent, in blue
description: One or two lines.  # the lead under the title
meta:                           # optional strip: time, level, requirements, last verified
  time: '[X] minuti'
  level: Base
  requires: Accesso root
  verified: '[DATA]'
```

Available in every page without an import: `<Tabs>`/`<TabItem>`, `<Steps>`/`<Step title>`,
`<Cards>`/`<Card to label title>`. Admonitions: `:::warning[Title]` and `:::danger` draw an ink
bar, `:::note`, `:::info` and `:::tip` a blue one. Code blocks have line numbers
(`noLineNumbers` turns them off); `prompt` in the meta draws a root `#` before each command and
leaves comments out of Copy.

## Design

The theme implements `design/reference/docs.dc.html`. Fonts are self-hosted from
`static/fonts/` (Archivo, Instrument Serif, Geist Mono — SIL Open Font License, texts alongside).
Search is local (built at build time); there is no analytics and no external service.

## Status

Initialised on 2026-10-09. The site generator is in place with two example pages per language;
the content comes with Phase 9 of the CloudGround rewrite plan.
