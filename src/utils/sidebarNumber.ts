import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import type {PropSidebarItem} from '@docusaurus/plugin-content-docs';

export type SidebarNumber = {
  /** Two-digit group number, e.g. "01". */
  group: string;
  /** Label of the top-level group the page belongs to. */
  groupLabel: string;
  /** Position of the page, e.g. "1.2"; "1" for a group's own index page. */
  position: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

function hrefOf(item: PropSidebarItem): string | undefined {
  if (item.type === 'link' || item.type === 'category') {
    return item.href;
  }
  return undefined;
}

/**
 * Number of a page within the current sidebar, matching the numbered groups
 * the sidebar draws: the n-th top-level group is "0n", its m-th page "n.m".
 */
export function useSidebarNumber(permalink: string | undefined): SidebarNumber | null {
  const sidebar = useDocsSidebar();
  if (!sidebar || !permalink) {
    return null;
  }
  const items = sidebar.items.filter((item) => item.type !== 'html');
  for (let i = 0; i < items.length; i += 1) {
    const top = items[i]!;
    const group = pad(i + 1);
    const groupLabel = top.type === 'category' || top.type === 'link' ? top.label : '';
    if (hrefOf(top) === permalink) {
      return {group, groupLabel, position: String(i + 1)};
    }
    if (top.type === 'category') {
      const children = top.items.filter((item) => item.type !== 'html');
      for (let j = 0; j < children.length; j += 1) {
        if (hrefOf(children[j]!) === permalink) {
          return {group, groupLabel, position: `${i + 1}.${j + 1}`};
        }
      }
    }
  }
  return null;
}
