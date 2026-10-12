import React, {type ReactNode} from 'react';
import clsx from 'clsx';

type Props = {size?: number; className?: string};

/**
 * The mark: a cloud over two bars, without a tile. Same drawing as the lockup
 * in static/img/logo.svg; the colours come from the theme (custom.css, .cg-mark):
 * the cloud in ink, the upper bar in blue, the lower bar in orange.
 */
export default function LogoMark({size = 28, className}: Props): ReactNode {
  return (
    <svg viewBox="0 0 112.5 114.4" width={size} height={size} aria-hidden="true" className={clsx('cg-mark', className)}>
      <path
        className="cg-mark__cloud"
        d="M25 62.5C15.373 62.502 6.602 56.974 2.449 48.289C-1.705 39.604-.502 29.306 5.54 21.812C11.583 14.317 21.391 10.958 30.759 13.175C38.094 2.832 50.951-2.054 63.303.808C75.655 3.669 85.054 13.711 87.094 26.225C94.12 23.556 102.062 25.341 107.27 30.76C112.479 36.18 113.947 44.185 111.002 51.101C108.057 58.016 101.266 62.504 93.75 62.503Z"
      />
      <rect className="cg-mark__upper" x="25" y="75" width="87.5" height="14.375" rx="3.125" />
      <rect className="cg-mark__lower" x="0" y="100" width="87.5" height="14.375" rx="3.125" />
    </svg>
  );
}
