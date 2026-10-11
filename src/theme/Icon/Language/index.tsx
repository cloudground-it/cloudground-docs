import React, {type ReactNode} from 'react';
import type {Props} from '@theme/Icon/Language';
import Icon from '@site/src/components/Icon';

// The language selector (hidden by custom.css where the label says it).
export default function IconLanguage(props: Props): ReactNode {
  return <Icon size={18} {...props} name="language" />;
}
