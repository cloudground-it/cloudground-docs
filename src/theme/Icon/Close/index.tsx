import React, {type ReactNode} from 'react';
import type {Props} from '@theme/Icon/Close';
import Icon from '@site/src/components/Icon';

// The drawer's close button. The theme passes a stroke width and colour meant
// for its own drawing: ours keeps its 1.75 stroke and the text colour.
export default function IconClose({strokeWidth: _strokeWidth, color: _color, ...props}: Props): ReactNode {
  return <Icon size={22} {...props} name="x" />;
}
