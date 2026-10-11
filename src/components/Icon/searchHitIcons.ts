/**
 * Stands in for the icons module of @easyops-cn/docusaurus-search-local
 * (theme/SearchBar/icons.js), swapped in by the `search-icons` plugin in
 * docusaurus.config.ts. The search results are HTML strings, so the icons are
 * strings too: the inner markup of file-text, link, menu, arrow-right and
 * search, copied from cloudground-icons/icons.json (MIT, see src/icons).
 */
const icon = (inner: string, size = 20) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${inner}</svg>`;

// A page title matched.
export const iconTitle = icon('<path d="M5 3h10l4 4v14H5z"/><path d="M8.5 10h7M8.5 13.5h7M8.5 17h4"/>');
// A heading matched: the result leads to its anchor.
export const iconHeading = icon('<path d="M9 8H3v8h6M15 8h6v8h-6M8 12h8"/>');
// Body text matched.
export const iconContent = icon('<path d="M4 6h16M4 12h16M4 18h16"/>');
// The "open" hint on the highlighted result.
export const iconAction = icon('<path d="M4 12h15M14 6l6 6-6 6"/>');
export const iconNoResults = icon('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5l5 5"/>', 40);

// Not icons: the tree lines that join a heading result to its page. Kept as
// the plugin draws them.
export const iconTreeInter =
  '<svg viewBox="0 0 24 54"><g stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v42M20 27H8.3"></path></g></svg>';
export const iconTreeLast =
  '<svg viewBox="0 0 24 54"><g stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v21M20 27H8.3"></path></g></svg>';
// Ask AI is off on this site; the export only has to exist.
export const iconAskAI = '';
