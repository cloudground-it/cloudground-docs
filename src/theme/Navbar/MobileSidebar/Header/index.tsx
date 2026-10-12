import React, {type ReactNode} from 'react';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import IconClose from '@theme/Icon/Close';
import LogoMark from '@site/src/components/LogoMark';

/**
 * The drawer's top row repeats the bar it covers: the mark on the left, the
 * colour mode and, where the menu button was, the close button.
 */
export default function NavbarMobileSidebarHeader(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <div className="navbar-sidebar__brand">
      <Link
        to="/"
        className="cg-nav__brand"
        onClick={() => mobileSidebar.toggle()}
        aria-label={translate({id: 'cg.nav.home', message: 'CloudGround, pagina iniziale'})}>
        <LogoMark size={28} />
      </Link>
      <div className="cg-nav__end">
        <NavbarColorModeToggle />
        <button
          type="button"
          aria-label={translate({
            id: 'theme.docs.sidebar.closeSidebarButtonAriaLabel',
            message: 'Close navigation bar',
            description: 'The ARIA label for close button of mobile sidebar',
          })}
          className="clean-btn navbar-sidebar__close"
          onClick={() => mobileSidebar.toggle()}>
          <IconClose />
        </button>
      </div>
    </div>
  );
}
