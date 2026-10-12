# CloudGround design system: "Rapporto di prova"

Source of truth: `design/index.html` (artboard v2). Every value below is in that file; when the two disagree, the file wins.

## Thesis

Every feature is shown as a test result: method, measurement, outcome. The site reads like an accredited lab's test report. It is plain and exact, never a sales page. Cool white paper, near-black ink, one blue from the logo for accents, links, focus and the single primary action. Green for the outcome stamp.

Never: gradients, glass, card grids as structure, eyebrows/kickers, numbered section labels, dark hero, a display face plus mono-label formula, or mono used as costume. Mono is only for commands, figures, paths and identifiers.

## Colour tokens (palette v3, from the logo)

One electric blue from the "Messa a terra" logo (`#2F5BFF`), cool neutrals instead of the warm paper, no orange. These values supersede the colours of the artboard `design/index.html`. In the site they are the `--cg-*` variables of `src/css/custom.css`.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | `#F9FAFC` | `#0E1117` | page ground |
| `--paper-2` | `#F1F3F8` | `#151923` | sidebars, table heads, second layer |
| `--paper-3` | `#E6E9F1` | `#1E2330` | hover, inline code |
| `--rule` | `#D7DCE7` | `#2A3040` | 1px decorative rules |
| `--rule-strong` | `#7C8396` | `#6E7790` | control borders (≥3:1) |
| `--ink` | `#11141C` | `#EEF1F7` | headings, strong text, active nav fill |
| `--text` | `#2A2F3B` | `#D3D8E4` | body |
| `--muted` | `#586074` | `#9AA3B8` | secondary |
| `--brand` | `#2F5BFF` | `#2F5BFF` | the logo, app tile, large fills only |
| `--logo` | `#2F5BFF` | `#7D97FF` | the mark's stroke on paper |
| `--primary` | `#2F5BFF` | `#3D63F5` | primary button fill, active tab indicator, focus ring |
| `--primary-hover` | `#1F45E0` | `#2F52DE` | primary hover |
| `--on-primary` | `#FFFFFF` | `#FFFFFF` | text on primary |
| `--blue` | `#2549E0` | `#8AA2FF` | links, blue text, accent words, selection |
| `--blue-tint` | `#EBF0FF` | `#1A2246` | selected row/tile, info banner |
| `--blue-line` | `#C9D5FF` | `#2E3D7A` | selected-tile frame, info border |
| `--ok` / `--ok-tint` | `#18794E` / `#E3F4EA` | `#5FD39A` / `#12291E` | success, the "Superato" stamp |
| `--warn` / `--warn-tint` | `#8A5A00` / `#FBF1DB` | `#F2C063` / `#2E2510` | attention |
| `--err` / `--err-tint` | `#C8302C` / `#FDECEB` | `#FF8A80` / `#361818` | errors |
| `--code-bg` / `--code-fg` / `--code-muted` | `#0E1220` / `#E8ECF6` / `#9AA3B8` | `#090B10` / same / same | command boxes, terminal |
| `--band-bg` / `--band-fg` / `--band-muted` | `#0E1220` / `#EEF1F7` / `#9AA3B8` | `#090B10` / same / same | the home's dark band |

Derived in the site for the dark surfaces (both themes): code rule `#262D40`, code control `#6E7790` (≥3:1 on both code grounds), code hover `#1A2033` / `#151A28`, ok on code `#5FD39A`, blue on code `#8AA2FF`, highlighted code line `#1E2538`. Syntax colours (docusaurus.config.ts) all reach 4.5:1 on `#0E1220` and `#090B10`; numbers use the warn yellow `#F2C063`.

Infima's `--ifm-color-primary` is `--blue` (`#2549E0` light, `#8AA2FF` dark) with the usual darker/lighter steps.

Rules:
- Orange is retired. The outcome stamp ("Superato") uses `--ok`; the baseline stamp ("Riferimento") uses `--muted` and `--rule-strong`.
- Blue is the primary action colour, still one primary per screen.
- `--brand` (`#2F5BFF`) is for the logo and big fills; blue text on paper uses `--blue`, which has the better contrast.
- In dark mode the mark is drawn in `#7D97FF` (or white).

Contrast checked: white on primary 5.17:1 (light) and 4.88:1 (dark); `--blue` on `--paper-3` 5.56:1 and on `--blue-tint` 5.93:1; `--ok` on paper 5.18:1; `--logo` dark on paper 6.97:1; `--code-muted` on the highlighted line 6.03:1. Re-check after any change.

Theme switching: `:root` holds light. Dark comes from `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` and from `[data-theme="dark"]`.

## Type

**Decision: IBM Plex Sans + IBM Plex Mono is the final pairing** (chosen by the user; the colours are now palette v3 above). The other two pairings were candidates and stay in the specimen's live switcher only for comparison. Pairings, switched with `html[data-font]` → `--font-sans` / `--font-mono`:

1. `plex`: IBM Plex Sans + IBM Plex Mono (default; the closest to a lab report)
2. `atkinson`: Atkinson Hyperlegible Next + Atkinson Hyperlegible Mono (the most legible)
3. `public`: Public Sans + JetBrains Mono (the most neutral)

All three are on Google Fonts. Self-host the chosen one (woff2) in Docusaurus `static/fonts` and in the panel's `public/fonts`.

Scale is fixed in rem, not fluid:
- Site: home h1 2.75rem/1.12 (2rem on mobile), section h2 1.875rem, h3 1.1875rem, lede 1.1875rem, body 1rem/1.6, note 0.875rem.
- Docs: h1 2.25rem, h2 1.5rem, h3 1.125rem, prose 1.0625rem/1.7, measure ≤70ch.
- Panel: h1 1.625rem, panel title 1rem, body 0.9375rem, meta 0.8125rem.
- Result figure: mono 4rem, weight 500, in a fixed `5.2ch` right-aligned slot.

Weights: 400 body, 500 labels, 600 headings, 700 stamp only. Tracking is -0.02em on the large headings and 0 elsewhere. Use `font-variant-numeric: tabular-nums` everywhere. Ligatures are off in mono.

## Components (classes in the artboard)

- **Protocol strip** `.protocol`: a ruled `dl` (object of the test, document CG-RP, revision = release, date) under the nav, on `--paper-2`.
- **Install box** `.cmd`: ink box, mono command, `$ ` prompt not selectable, a blue (primary) "Copia" button that shows "Copiato" for 2 s. On ≤480px the button stacks under the command and the command wraps.
- **Result block** `.result`: a con/senza cache toggle (`.seg`) re-sets the figures in their fixed slots (no counting animation), then ruled `dl` rows and a method note `.method`.
- **Stamp** `.stamp`: 2px `--ok` frame plus a 1px outline, uppercase 700 with tracking .08em, not rotated. The `.ref` variant is grey, for baselines.
- **Ruled tables** `.tbl`, `.cap-t`, `.sites`, `.guard-t`: 1px rules, a head row on `--paper-2`, figures right-aligned in mono. An error row takes `--err-tint` plus a message under the domain.
- **Test record** `.test`: three columns (name, Metodo, Esito), separated by rules and never boxed as cards.
- **Annotation** `.annot`: the panel excerpt on the left, notes on the right, joined by 1px blue leader lines with square ends. On mobile the notes follow below.
- **Steps** `.steps`: a CSS counter in mono blue, for a strict sequence only.
- **Buttons** `.btn`: 40px (32px for `.btn-sm`), radius 3px, 1px `--rule-strong`. `.btn-primary` is blue (`--primary`) and appears once per screen. `.btn-ghost` is the third level. Disabled uses a dashed border and muted text.
- **Badge** `.badge`: an 8px square plus a word in its semantic colour. `.off` is a hollow square.
- **Admonition** `.adm`: a full 1px border with a tint and an icon (never a thick left bar).
- **Panel shell**: a 240px `--paper-2` sidebar (server card, nav with icons, separators, user at the bottom), a top bar (search with ⌘K, alerts, theme, help) and page padding 28/32. On mobile the sidebar becomes a burger, and table rows become stacked rows.
- **Type picker** `.type`: radio tiles in one ruled grid. Selected tiles get `--blue-tint` and a 2px inset blue frame.
- Icons: cloudground-icons (stroke 1.75, square caps, `currentColor`). Brand marks come from Simple Icons (CC0) and are drawn monochrome. Static and Reverse proxy use `file-code` and `network`.
- Logo: the mark "Messa a terra" (a cloud on the electrical ground symbol), one round stroke in `--logo`, no tile; lockup = mark + "CloudGround" in Plex Sans 600, -0.015em; on a phone the mark alone. Favicon: the filled pixel version for ≤20px. App icons: the `#2F5BFF` rounded tile with the mark in white.
- Browser surfaces: `::selection` blue/paper, `caret-color` blue, a 2px blue focus ring with offset 2, `scrollbar-color` set from the tokens, link underline offset .2em at 1px (2px on hover).

## Mapping to Docusaurus (cloudground-docs/src/css/custom.css)

Replace the `--cg-*` block with the tokens above, then point Infima at them:

```css
:root {
  --ifm-background-color: var(--paper);
  --ifm-font-color-base: var(--text);
  --ifm-heading-color: var(--ink);
  --ifm-color-primary: var(--blue);           /* #2549E0 light, #8AA2FF dark, with -dark/-light steps */
  --ifm-link-color: var(--blue);
  --ifm-font-family-base: var(--font-sans);
  --ifm-heading-font-family: var(--font-sans);
  --ifm-font-family-monospace: var(--font-mono);
  --ifm-line-height-base: 1.7;
  --ifm-global-radius: 3px;
  --ifm-pre-background: var(--code-bg);
  --ifm-code-background: var(--paper-3);
  --ifm-toc-border-color: var(--rule);
  --ifm-table-border-color: var(--rule);
  --ifm-menu-color: var(--text);
  --ifm-menu-color-background-active: var(--ink);   /* active item: ink fill, paper text */
  --ifm-navbar-background-color: var(--paper);
  --ifm-container-width-xl: 1200px;
}
html[data-theme='dark'] { /* dark token values from the table */ }
```

- Drop Archivo, Instrument Serif, the `.hud` mono labels and the accent-word titles (`heading_accent`).
- Admonitions: restyle `.theme-admonition` to a 1px border plus a tint (`--warn`/`--warn-tint`, `--blue`/`--blue-tint`), with no left bar.
- Doc header: render the frontmatter `type`, `meta.level`, `version` and `last_verified` as the `.d-meta` ruled strip. `unverified` shows "Non ancora verificata" in `--warn`.
- Home (`src/components/Home`): since 2026-10-12 the approved "home classica": the earlier framed layout (hero with the cache scope, technology ribbon, feature grid, ownership band on `--band-bg`, measurements with stamps, install terminal, closing) in these tokens. Its uppercase mono labels and italic blue accent words are a deliberate, user-approved exception to the rules above, for the home only. On the home the navbar is not sticky.

## Mapping to Nuxt UI (cloudground/ui)

`app.config.ts`:

```ts
export default defineAppConfig({
  ui: {
    colors: { primary: 'blue', secondary: 'blue', neutral: 'paper', success: 'ok', warning: 'warn', error: 'err' },
    button: { slots: { base: 'rounded-[3px] font-medium' } },
  }
})
```

`app/assets/css/main.css` (Tailwind v4 `@theme`): define `--color-blue-*` and `--color-paper-*` scales whose 500/600 steps are the tokens above. Then set Nuxt UI's semantic variables per theme:

```css
:root {
  --ui-bg: var(--paper); --ui-bg-muted: var(--paper-2); --ui-bg-elevated: var(--paper-3);
  --ui-border: var(--rule); --ui-border-accented: var(--rule-strong);
  --ui-text: var(--text); --ui-text-highlighted: var(--ink); --ui-text-muted: var(--muted);
  --ui-primary: var(--primary); --ui-secondary: var(--blue);
  --ui-radius: 3px;
  --font-sans: 'IBM Plex Sans', system-ui, sans-serif; --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
}
.dark { /* dark token values */ }
```

- Primary (`--primary`, white text) is for one action per screen: Nuovo sito, Aggiorna ora, Continua, Apri wp-admin. Links, blue text and selection use `--blue`.
- UTable: rows 12/16 px padding, the head on `--ui-bg-muted`, and error rows given an `err-tint` row class. UBadge: replace it with the square-dot `.badge` (custom variant).
- `siteTypeIcon`: keep the icon-set fallbacks and add the Simple Icons marks for wordpress, woocommerce, php and laravel, monochrome.
- Remove the `disp` wide display class and the kicker strings (`newSite.kickerForm` etc.): no eyebrows.

## Open points

- Plex is decided: self-host it and delete the other two pairings from the product (the specimen keeps them as history).
- Palette v3 (2026-10-12) retired the orange and the warm paper; the panel (Nuxt UI) still has to follow.
- The WooCommerce mark is the official "Woo" speech-bubble mark from Simple Icons (`woo`, simple-icons@13.21.0, CC0 icon file; the mark itself remains a WooCommerce/Automattic trademark, used nominatively as a service label). Rendered monochrome, `viewBox="0 4.857 24 14.3"`, at least 32px wide.
- Header revision "v0.3.0" in the protocol strip assumes v0.3.0 is out when the redesign ships.
