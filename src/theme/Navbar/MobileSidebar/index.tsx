import React, {type ReactNode, useEffect} from 'react';
import {useLockBodyScroll, useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebarLayout from '@theme/Navbar/MobileSidebar/Layout';
import NavbarMobileSidebarHeader from '@theme/Navbar/MobileSidebar/Header';
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu';
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** The drawer's focusable elements a visitor can reach now (not in the inert panel). */
function focusables(drawer: HTMLElement): HTMLElement[] {
  return Array.from(drawer.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.closest('[inert]') && el.getClientRects().length > 0,
  );
}

/**
 * Docusaurus's drawer (its state, its two panels, the body scroll lock), plus
 * what a dialog needs: focus moves in and stays in, Esc closes, and focus
 * goes back to the menu button.
 */
export default function NavbarMobileSidebar(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  useLockBodyScroll(mobileSidebar.shown);

  const {shown, toggle} = mobileSidebar;
  useEffect(() => {
    if (!shown) {
      return undefined;
    }
    const drawer = document.querySelector<HTMLElement>('.navbar-sidebar');
    if (!drawer) {
      return undefined;
    }
    const opener = document.activeElement as HTMLElement | null;
    // After the frame that makes the drawer visible: hidden elements take no focus.
    const frame = requestAnimationFrame(() =>
      drawer.querySelector<HTMLElement>('.navbar-sidebar__close')?.focus({preventScroll: true}),
    );
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        toggle();
        return;
      }
      if (event.key !== 'Tab') {
        return;
      }
      const items = focusables(drawer);
      if (items.length === 0) {
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const active = document.activeElement as HTMLElement | null;
      if (!active || !drawer.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKey);
      // Back to the menu button, unless a link already moved focus elsewhere.
      const active = document.activeElement;
      if (!active || active === document.body || drawer.contains(active)) {
        (opener && opener.isConnected ? opener : document.querySelector<HTMLElement>('.navbar__toggle'))?.focus({
          preventScroll: true,
        });
      }
    };
  }, [shown, toggle]);

  if (!mobileSidebar.shouldRender) {
    return null;
  }
  return (
    <NavbarMobileSidebarLayout
      header={<NavbarMobileSidebarHeader />}
      primaryMenu={<NavbarMobileSidebarPrimaryMenu />}
      secondaryMenu={<NavbarMobileSidebarSecondaryMenu />}
    />
  );
}
