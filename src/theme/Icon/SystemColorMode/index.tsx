import React, {type ReactNode} from 'react';
import type {Props} from '@theme/Icon/SystemColorMode';
import Icon from '@site/src/components/Icon';

// Colour-mode toggle, following the device: the window from our icon set.
export default function IconSystemColorMode(props: Props): ReactNode {
  return <Icon size={20} {...props} name="browser" />;
}
