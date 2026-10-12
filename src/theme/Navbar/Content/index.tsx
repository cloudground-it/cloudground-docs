import React, {type ReactNode} from 'react';
import {useThemeConfig, ErrorCauseBoundary} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import SearchBar from '@theme/SearchBar';
import Icon from '@site/src/components/Icon';
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
 * One ruled row: the mark and the name, the section links, the search field,
 * then language, GitHub and the colour mode. On small screens the name and the
 * links give way: the mark on the left, the colour mode and the menu button on
 * the right, and inside the docs the search takes a second row.
 */
export default function NavbarContent(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useThemeConfig().navbar.items as NavbarItemConfig[];
  const left = items.filter((item) => item.position !== 'right');
  const right = items.filter((item) => item.position === 'right');
  const {pathname} = useLocation();
  const docsBase = useBaseUrl('/docs');
  const inDocs = pathname === docsBase || pathname.startsWith(`${docsBase}/`);

  return (
    <div className={`cg-nav${inDocs ? ' cg-nav--docs' : ''}`}>
      <div className="cg-nav__row">
        <Link
          to="/"
          className="cg-nav__brand"
          aria-label={translate({id: 'cg.nav.home', message: 'CloudGround, pagina iniziale'})}>
          <LogoMark size={32} />
          <span className="cg-nav__name" aria-hidden="true">
            CloudGround
          </span>
        </Link>
        <div className="cg-nav__links">
          <NavbarItems items={left} />
        </div>
        <div className="cg-nav__search">
          <Icon name="search" className="cg-nav__searchicon" />
          <SearchBar />
        </div>
        <div className="cg-nav__end">
          <div className="cg-nav__tools">
            <NavbarItems items={right} />
          </div>
          <NavbarColorModeToggle />
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
        </div>
      </div>
    </div>
  );
}
