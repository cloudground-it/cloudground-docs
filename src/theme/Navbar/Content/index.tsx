import React, {type ReactNode} from 'react';
import {useThemeConfig, ErrorCauseBoundary} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import SearchBar from '@theme/SearchBar';
import LogoMark from '@site/src/components/LogoMark';

function NavbarItems({items}: {items: NavbarItemConfig[]}): ReactNode {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(`A navbar item failed to render:\n${JSON.stringify(item, null, 2)}`, {cause: error})
          }>
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

/**
 * Segmented navbar: mark + "docs" tag | search field | section links.
 * Each segment is separated by a hairline, as in the design.
 */
export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useThemeConfig().navbar.items as NavbarItemConfig[];
  const left = items.filter((item) => item.position !== 'right');
  const right = items.filter((item) => item.position === 'right');

  return (
    <div className="cg-nav">
      <div className="cg-nav__brandcell">
        {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
        <Link to="/" className="cg-nav__brand" aria-label="CloudGround docs">
          <LogoMark size={28} animated />
          <span className="disp cg-nav__name">cloudground</span>
          <span className="hud cg-tag">docs</span>
        </Link>
      </div>
      <div className="cg-nav__search">
        <SearchBar />
      </div>
      <div className="cg-nav__links">
        <NavbarItems items={left} />
        <NavbarItems items={right} />
        <NavbarColorModeToggle className="cg-nav__mode" />
      </div>
    </div>
  );
}
