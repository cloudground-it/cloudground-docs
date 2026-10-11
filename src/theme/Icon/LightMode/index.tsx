import React, {type ReactNode} from 'react';
import type {Props} from '@theme/Icon/LightMode';
import Icon from '@site/src/components/Icon';

// Colour-mode toggle, light: the sun from our icon set.
export default function IconLightMode(props: Props): ReactNode {
  return <Icon size={20} {...props} name="sun" />;
}
