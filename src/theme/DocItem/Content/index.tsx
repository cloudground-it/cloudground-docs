import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import MDXContent from '@theme/MDXContent';
import type {Props} from '@theme/DocItem/Content';

// The title is drawn by the page header (DocItem/Layout), not here.
export default function DocItemContent({children}: Props): ReactNode {
  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
