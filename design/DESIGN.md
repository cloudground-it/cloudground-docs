# CloudGround design system: "Rapporto di prova"

Source of truth: `design/index.html` (artboard v2). Every value below is in that file; when the two disagree, the file wins.

## Thesis

Every feature is shown as a test result: method, measurement, outcome. The site reads like an accredited lab's test report. It is plain and exact, never a sales page. Warm white paper, near-black ink, blue for protocol, headings accents, links and focus. Orange only for the single primary action and the outcome stamp.

Never: gradients, glass, card grids as structure, eyebrows/kickers, numbered section labels, dark hero, a display face plus mono-label formula, or mono used as costume. Mono is only for commands, figures, paths and identifiers.

## Colour tokens

| Token | Light | Dark | Role |
|---|---|---|---|
| `--paper` | `#FBFAF6` | `#131418` | page ground |
| `--paper-2` | `#F3F1EA` | `#1A1C21` | second layer: sidebars, table heads, protocol strip |
| `--paper-3` | `#E9E6DC` | `#24262D` | hover, inline code |
| `--rule` | `#D6D3C8` | `#31343C` | 1px decorative rules |
| `--rule-strong` | `#86837A` | `#72757E` | control borders, frames (≥3:1) |
| `--ink` | `#15161A` | `#F2F0EA` | headings, strong text, active nav fill |
| `--text` | `#2E3036` | `#D8D6CF` | body |
| `--muted` | `#5B5D64` | `#A6A59E` | method notes, secondary |
| `--blue` | `#2343C2` | `#93A8FF` | links, focus ring, selection, protocol |
| `--blue-tint` | `#E7EBFA` | `#1E2544` | selected row/tile, info banner |
| `--orange` | `#C8471A` | `#F07A3E` | primary button fill, stamp frame |
| `--on-orange` | `#FFFFFF` | `#131418` | text on orange |
| `--stamp` | `#B13B0C` | `#FF9360` | orange text on paper; primary hover |
| `--ok` / `--ok-tint` | `#1C7038` / `#E5F2E8` | `#63CF8A` / `#16301F` | succeeded |
| `--warn` / `--warn-tint` | `#835400` / `#F8EFD9` | `#F0B54A` / `#33280F` | attention, drift |
| `--err` / `--err-tint` | `#B3261E` / `#FBE9E6` | `#FF8073` / `#3A1D1B` | error: the only break in the rhythm |
| `--code-bg` / `--code-fg` / `--code-muted` | `#15161A` / `#F2F0EA` / `#A6A59E` | `#0B0C0E` / same / same | command boxes |

These are derived from the current site tokens (`#2F5BFF`, `#E0612B`). Both were darkened in light mode and lightened in dark mode so that text reaches AA. The artboard's specimen computes 26 pairs live from the tokens, and all of them pass in both themes. Lowest values: muted on paper-3 5.26:1, rule-strong on paper 3.63:1 (UI, ≥3), on-orange on orange 4.80:1. Re-check the table after any change.

Theme switching: `:root` holds light. Dark comes from `@media (prefers-color-scheme: dark) :root:not([data-theme="light"])` and from `[data-theme="dark"]`.

## Type

**Decision: IBM Plex Sans + IBM Plex Mono is the final pairing** (chosen by the user, colours approved too: orange `#C8471A`, with `#E0612B` only in the logo). The other two pairings were candidates and stay in the specimen's live switcher only for comparison. Pairings, switched with `html[data-font]` → `--font-sans` / `--font-mono`:

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
- **Install box** `.cmd`: ink box, mono command, `$ ` prompt not selectable, an orange "Copia" button that shows "Copiato" for 2 s. On ≤480px the button stacks under the command and the command wraps.
- **Result block** `.result`: a con/senza cache toggle (`.seg`) re-sets the figures in their fixed slots (no counting animation), then ruled `dl` rows and a method note `.method`.
- **Stamp** `.stamp`: 2px orange frame plus a 1px inner outline, uppercase 700 with tracking .08em, not rotated. The `.ref` variant is grey, for baselines.
- **Ruled tables** `.tbl`, `.cap-t`, `.sites`, `.guard-t`: 1px rules, a head row on `--paper-2`, figures right-aligned in mono. An error row takes `--err-tint` plus a message under the domain.
- **Test record** `.test`: three columns (name, Metodo, Esito), separated by rules and never boxed as cards.
- **Annotation** `.annot`: the panel excerpt on the left, notes on the right, joined by 1px blue leader lines with square ends. On mobile the notes follow below.
- **Steps** `.steps`: a CSS counter in mono blue, for a strict sequence only.
- **Buttons** `.btn`: 40px (32px for `.btn-sm`), radius 3px, 1px `--rule-strong`. `.btn-primary` is orange and appears once per screen. `.btn-ghost` is the third level. Disabled uses a dashed border and muted text.
- **Badge** `.badge`: an 8px square plus a word in its semantic colour. `.off` is a hollow square.
- **Admonition** `.adm`: a full 1px border with a tint and an icon (never a thick left bar).
- **Panel shell**: a 240px `--paper-2` sidebar (server card, nav with icons, separators, user at the bottom), a top bar (search with ⌘K, alerts, theme, help) and page padding 28/32. On mobile the sidebar becomes a burger, and table rows become stacked rows.
- **Type picker** `.type`: radio tiles in one ruled grid. Selected tiles get `--blue-tint` and a 2px inset blue frame.
- Icons: cloudground-icons (stroke 1.75, square caps, `currentColor`). Brand marks come from Simple Icons (CC0) and are drawn monochrome. Static and Reverse proxy use `file-code` and `network`.
- Logo: the cloud in `--ink`, the upper bar in `--blue`, the lower bar in `--orange`, with no tile. The incumbent ink tile still works for favicons.
- Browser surfaces: `::selection` blue/paper, `caret-color` blue, a 2px blue focus ring with offset 2, `scrollbar-color` set from the tokens, link underline offset .2em at 1px (2px on hover).

## Mapping to Docusaurus (cloudground-docs/src/css/custom.css)

Replace the `--cg-*` block with the tokens above, then point Infima at them:

```css
:root {
  --ifm-background-color: var(--paper);
  --ifm-font-color-base: var(--text);
  --ifm-heading-color: var(--ink);
  --ifm-color-primary: var(--blue);           /* generate -dark/-light steps from #2343C2 */
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
- Home (`src/components/Home`): rebuild as protocol strip → hero (headline, lede, `.cmd` with `INSTALL_COMMAND`, the result block from `BENCH_URL` numbers) → full results table → test records → annotated Guard excerpt → limits → three steps → footer.

## Mapping to Nuxt UI (cloudground/ui)

`app.config.ts`:

```ts
export default defineAppConfig({
  ui: {
    colors: { primary: 'orange', secondary: 'blue', neutral: 'paper', success: 'ok', warning: 'warn', error: 'err' },
    button: { slots: { base: 'rounded-[3px] font-medium' } },
  }
})
```

`app/assets/css/main.css` (Tailwind v4 `@theme`): define `--color-orange-*`, `--color-blue-*` and `--color-paper-*` scales whose 500/600 steps are the tokens above. Then set Nuxt UI's semantic variables per theme:

```css
:root {
  --ui-bg: var(--paper); --ui-bg-muted: var(--paper-2); --ui-bg-elevated: var(--paper-3);
  --ui-border: var(--rule); --ui-border-accented: var(--rule-strong);
  --ui-text: var(--text); --ui-text-highlighted: var(--ink); --ui-text-muted: var(--muted);
  --ui-primary: var(--orange); --ui-secondary: var(--blue);
  --ui-radius: 3px;
  --font-sans: 'IBM Plex Sans', system-ui, sans-serif; --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
}
.dark { /* dark token values */ }
```

- Primary (orange) is for one action per screen: Nuovo sito, Aggiorna ora, Continua, Apri wp-admin. Use links, focus and selection with `secondary` (blue).
- UTable: rows 12/16 px padding, the head on `--ui-bg-muted`, and error rows given an `err-tint` row class. UBadge: replace it with the square-dot `.badge` (custom variant).
- `siteTypeIcon`: keep the icon-set fallbacks and add the Simple Icons marks for wordpress, woocommerce, php and laravel, monochrome.
- Remove the `disp` wide display class and the kicker strings (`newSite.kickerForm` etc.): no eyebrows.

## Open points

- Plex is decided: self-host it and delete the other two pairings from the product (the specimen keeps them as history).
- The orange is now burnt (`#C8471A` light). If the brand `#E0612B` must appear, use it only for non-text fills (the logo bar).
- The WooCommerce mark is the official "Woo" speech-bubble mark from Simple Icons (`woo`, simple-icons@13.21.0, CC0 icon file; the mark itself remains a WooCommerce/Automattic trademark, used nominatively as a service label). Rendered monochrome, `viewBox="0 4.857 24 14.3"`, at least 32px wide.
- Header revision "v0.3.0" in the protocol strip assumes v0.3.0 is out when the redesign ships.
