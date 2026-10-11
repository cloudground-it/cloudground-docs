import React, {type ReactNode} from 'react';
import type {Props} from '@theme/Icon/Menu';
import Icon from '@site/src/components/Icon';

// The navbar's drawer button on small screens.
export default function IconMenu(props: Props): ReactNode {
  return <Icon size={24} {...props} name="menu" />;
}
