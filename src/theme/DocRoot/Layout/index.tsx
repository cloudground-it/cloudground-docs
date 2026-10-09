import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import BackToTopButton from '@theme/BackToTopButton';
import DocSidebar from '@theme/DocSidebar';
import type {Props} from '@theme/DocRoot/Layout';

const noop = () => {};

/**
 * Three hairline columns inside a 1440px frame: numbered index | page | (the
 * page's own "In questa pagina" column, drawn by DocItem/Layout).
 */
export default function DocRootLayout({children}: Props): ReactNode {
  const sidebar = useDocsSidebar();
  const {pathname} = useLocation();
  return (
    <div className="cg-docs">
      <BackToTopButton />
      <div className="cg-docs__frame">
        {sidebar && (
          <aside className={clsx(ThemeClassNames.docs.docSidebarContainer, 'cg-sidebar')}>
            <div className="cg-sidebar__viewport" key={sidebar.name}>
              <DocSidebar sidebar={sidebar.items} path={pathname} onCollapse={noop} isHidden={false} />
            </div>
          </aside>
        )}
        <main className="cg-docs__main">{children}</main>
      </div>
    </div>
  );
}
