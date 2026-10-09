import React, {type ReactNode} from 'react';
import clsx from 'clsx';

type Props = {size?: number; inverted?: boolean; animated?: boolean; className?: string};

/** The tile mark: a cloud over two bars. Same drawing as static/img/logo.svg. */
export default function LogoMark({size = 28, inverted = false, animated = false, className}: Props): ReactNode {
  const tile = inverted ? '#F2F1EC' : '#0F0F12';
  const cloud = inverted ? '#0F0F12' : '#F2F1EC';
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" className={clsx('cg-mark', className)}>
      <rect width="48" height="48" rx="11" fill={tile} />
      <g transform="translate(4 3) scale(.84)">
        <path
          className={animated ? 'cg-float' : undefined}
          fill={cloud}
          d="M14 26A8 8 0 1 1 15.843 10.215A10 10 0 0 1 33.87 14.391A6 6 0 1 1 36 26Z"
        />
        <rect x="14" y="30" width="28" height="4.6" rx="1" fill="#2F5BFF" />
        <rect x="6" y="38" width="28" height="4.6" rx="1" fill="#E0612B" />
      </g>
    </svg>
  );
}
