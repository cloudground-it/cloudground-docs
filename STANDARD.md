# Documentation standard

This file sets the rules every page of the CloudGround documentation follows. It was written
before the pages, and a page that breaks a rule is a bug in the page. `npm run check` enforces
the rules a script can check; review enforces the rest.

## 1. Four kinds of page

Every page is exactly one of four types. A page that tries to be two is split in two.

| Type | `type:` | Answers | Reader's state | Shape |
| --- | --- | --- | --- | --- |
| Tutorial | `tutorial` | "Show me, from zero." | learning, has time | numbered steps that always succeed, one path, no choices |
| How-to guide | `how-to` | "How do I do X?" | working, has a goal | the shortest sequence of actions that reaches the goal, with the variations that matter |
| Reference | `reference` | "What exactly is X?" | looking something up | tables and lists, complete and dry, ordered like the product |
| Explanation | `explanation` | "Why does it work this way?" | thinking, away from the keyboard | prose and diagrams, the mechanism and its trade-offs |

Section landing pages use `type: index`: they introduce a section and link its pages, and they
hold no content of their own.

The sidebar keeps the types apart. Its groups are, in order: **Tutorials**, the **How-to
guides** (split by subject: sites, data, access and security, server), **Reference** and
**Explanation**; the CLI and the API have their own reference sidebars. Each group folder has an
`index.md` and a `_category_.json`; a page goes in the group of its type, never elsewhere.

| Folder | Group | Type of its pages |
| --- | --- | --- |
| `tutorials/` | Tutorials | `tutorial` |
| `sites/` | How-to · sites | `how-to` |
| `data/` | How-to · data (cache, staging, backups, deployments, databases) | `how-to` |
| `access/` | How-to · access and security | `how-to` |
| `server/` | How-to · server | `how-to` |
| `reference/` | Reference | `reference` |
| `explanation/` | Explanation | `explanation` |
| `cli/`, `api/` | own sidebars | `reference` |

Rules that follow from the types:

- A how-to does not explain the mechanism; it links the explanation page. An explanation does
  not list steps; it links the how-to.
- A tutorial never offers a choice ("if you prefer…"); it picks one path and walks it.
- A reference page lists every value, including the ones nobody uses, in the order the product
  shows them.

## 2. Page template

Front matter, in this order:

```yaml
---
title: Restore a backup                 # sidebar and <title>: a short noun phrase or imperative
description: One or two sentences: what the reader gets from the page.
type: how-to                            # tutorial | how-to | reference | explanation | index
prerequisites:                          # what must be true before starting; [] when nothing
  - A site with at least one backup
  - An operator or administrator account
version: unreleased                     # the CloudGround release the page describes
last_verified: unverified               # YYYY-MM-DD of the last check on a real install, or unverified
---
```

Optional keys used by the theme: `slug`, `sidebar_position`, `heading`, `heading_accent` (the serif
accent word of the big title), `meta.time`, `meta.level`. The header strip shows the type, the
version, the prerequisites and the verification date from the keys above.

The body:

1. **One idea per page.** If the description needs "and", the page is probably two pages.
2. Open with the outcome, not with background: one short paragraph, then the content.
3. Headings carry an explicit anchor in English, the same in both languages
   (`## Crea il sito {#create-the-site}`), so links and translations line up.
4. End with a **next step**: a last section `## Prossimo passo {#next}` / `## Next step {#next}`
   with one link (two at most) to where the reader naturally goes next. Index pages are exempt.

## 3. Style

- **Active voice, second person, present tense.** "The agent writes the vhost", not "the vhost is
  written". Italian uses *tu*.
- **Short sentences.** One instruction per sentence; one step per list item. No marketing.
- **The interface's words.** Name buttons, tabs and fields exactly as the panel shows them, in
  the page's language, and use the terms of the product glossary (`ui/i18n/GLOSSARY.md` in the
  product repo): *ripristino di prova* / *restore test*, *svuotare la cache* / *purge the cache*,
  *attività* / *task*, *amministratore / operatore / sola lettura*. Product names stay as they
  are: CloudGround, Safe Push, Performance Guard, Velocity Engine, DB Studio, cgctl.
- **No third-party product names** in comparisons, and no comparisons with other panels or
  hosts. Name third-party software only where the reader must type or recognise it (WordPress,
  Laravel, nginx, PHP-FPM, MariaDB, Redis, restic, Let's Encrypt).
- **Italian and English, aligned page by page.** Every page exists in both languages at the same
  path (`docs/<path>` in Italian, `i18n/en/docusaurus-plugin-content-docs/current/<path>` in
  English), with the same type, sections, anchors, commands, diagrams and verification date. A
  change to one language is a change to both, in the same commit.
- Code blocks name their language; commands run as root use the `prompt` meta. Placeholders are
  `<angle-brackets>` and are explained right after the block.
- Admonitions are rare: `:::danger` for data loss, `:::warning` for a trap, `:::note` for a fact
  the reader would otherwise miss.

## 4. Verifiability

Every command, path, port, field name, default and screenshot comes from a real installation of
the version the page names. Until a page has been checked that way it says so:

- `last_verified: unverified` while a page is written from the product's code and specifications
  (the `SPEC.md` files, the API route table, the installer), not yet run on a server;
- `last_verified: YYYY-MM-DD` once the integrator has run every command on the page, on a test
  server installed with the release in `version:`, and seen the stated result.

Facts come from the product's source of truth, in this order: the behaviour of a real install;
the package `SPEC.md` files; the code. Never from older documentation. When the product changes a
behaviour a page describes, the page goes back to `unverified` in the same change.

The theme shows "non verificata" / "unverified" in the header strip of such a page.

## 5. Diagrams

Use a Mermaid diagram wherever a picture explains faster than prose: architecture, flows,
lifecycles, state machines, permission matrices. Diagrams are code blocks with the `mermaid`
language, rendered by `@docusaurus/theme-mermaid` with the site's colours in both light and dark
mode (see `src/css/custom.css`, section *Mermaid*). Rules:

- one diagram, one question; label every arrow with what travels on it;
- node labels in the page's language, identifiers (`panel-api`, `/run/…`) as they are;
- the same diagram, translated, in both languages;
- no colours or styles inside the diagram source: the theme owns them.

## 6. The check

`npm run check` (`scripts/check-docs.mjs`) runs in CI before the build and fails when:

- a page has no `title`, `description`, `type`, or `last_verified`, or a value outside the allowed
  set (`last_verified` is a `YYYY-MM-DD` date or `unverified`); non-index pages also need
  `version` and `prerequisites`;
- a page sits in a group folder of another type;
- a non-index page has no `{#next}` section;
- a page exists in one language and not the other, or the two differ in `type` or
  `last_verified`;
- an internal link (Markdown link or a `<Card to>`) points to a page or file that does not exist.

`npm run check -- --strict` also fails on `unverified` pages; use it before a release. The
Docusaurus build itself refuses broken links and anchors (`onBrokenLinks: 'throw'`).
