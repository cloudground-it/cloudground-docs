import React, {type ReactNode} from 'react';
import {translate} from '@docusaurus/Translate';
import type {Props} from '@theme/Icon/ExternalLink';
import Icon from '@site/src/components/Icon';

// After a link that leaves the site (where custom.css does not hide it).
export default function IconExternalLink({width = 13, height = 13}: Props): ReactNode {
  return (
    <Icon
      name="external-link"
      width={width}
      height={height}
      className="cg-icon--external"
      aria-hidden={undefined}
      role="img"
      aria-label={translate({
        id: 'theme.IconExternalLink.ariaLabel',
        message: '(opens in new tab)',
        description: 'The ARIA label for the external link icon',
      })}
    />
  );
}
