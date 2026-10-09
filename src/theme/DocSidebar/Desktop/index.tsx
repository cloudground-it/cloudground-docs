import React, {type ReactNode} from 'react';
import Content from '@theme/DocSidebar/Desktop/Content';
import type {Props} from '@theme/DocSidebar/Desktop';

// No logo and no collapse button: the sidebar is always open on desktop.
function DocSidebarDesktop({path, sidebar}: Props): ReactNode {
  return (
    <div className="cg-sidebar__inner">
      <Content path={path} sidebar={sidebar} />
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
