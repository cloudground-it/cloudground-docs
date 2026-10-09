import React, {useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode} from 'react';
import clsx from 'clsx';
import NavbarItem from '@theme/NavbarItem';
import type {Props} from '@theme/NavbarItem/DropdownNavbarItem/Desktop';

function menuLinks(menu: HTMLUListElement | null): HTMLAnchorElement[] {
  return menu ? Array.from(menu.querySelectorAll<HTMLAnchorElement>('a[href]')) : [];
}

/**
 * A navbar cell that opens a menu on click (not on hover): a real button with
 * aria-expanded, Escape closes and returns focus to it, arrow keys move
 * through the items, Tab leaves the menu and closes it.
 */
export default function DropdownNavbarItemDesktop({items, position, className, onClick, ...props}: Props): ReactNode {
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onOutside = (event: MouseEvent | TouchEvent | FocusEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside);
    document.addEventListener('focusin', onOutside);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
      document.removeEventListener('focusin', onOutside);
    };
  }, []);

  const focusItem = useCallback((which: 'first' | 'last' | 'current') => {
    const links = menuLinks(menuRef.current);
    const current = links.find((a) => a.classList.contains('dropdown__link--active'));
    const target = which === 'first' ? links[0] : which === 'last' ? links[links.length - 1] : (current ?? links[0]);
    target?.focus();
  }, []);

  const onButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(e.key === 'ArrowDown' ? 'current' : 'last'));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const onMenuKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const links = menuLinks(menuRef.current);
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      links[(i + 1) % links.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      links[(i - 1 + links.length) % links.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusItem('first');
    } else if (e.key === 'End') {
      e.preventDefault();
      focusItem('last');
    }
  };

  return (
    <div
      ref={rootRef}
      className={clsx('navbar__item', 'dropdown', 'cg-dropdown', className, {
        'dropdown--right': position === 'right',
        'dropdown--show': open,
      })}>
      <button
        ref={buttonRef}
        type="button"
        className="navbar__link cg-dropdown__button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKeyDown}>
        <span className="cg-dropdown__label">{props.children ?? props.label}</span>
        <svg className="cg-dropdown__chevron" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
      <ul id={menuId} ref={menuRef} className="dropdown__menu cg-dropdown__menu" onKeyDown={onMenuKeyDown}>
        {items.map((childItemProps, i) => (
          <NavbarItem
            isDropdownItem
            activeClassName="dropdown__link--active"
            {...childItemProps}
            onClick={() => setOpen(false)}
            key={i}
          />
        ))}
      </ul>
    </div>
  );
}
