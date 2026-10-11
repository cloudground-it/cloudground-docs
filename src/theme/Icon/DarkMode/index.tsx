import React, {type ReactNode} from 'react';
import type {Props} from '@theme/Icon/DarkMode';
import Icon from '@site/src/components/Icon';

// Colour-mode toggle, dark: the moon from our icon set.
export default function IconDarkMode(props: Props): ReactNode {
  return <Icon size={20} {...props} name="moon" />;
}
