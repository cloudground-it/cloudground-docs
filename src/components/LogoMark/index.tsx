import React, {type ReactNode} from 'react';
import clsx from 'clsx';

type Props = {size?: number; className?: string};

/** The mark's single stroke, on a 64-unit grid (brand file mark.svg). */
export const MARK_PATH =
  'M20.5 28.5 H43.5 A7 7 0 1 0 41.62 14.76 A10 10 0 0 0 22.16 15.72 A6.5 6.5 0 1 0 20.5 28.5 Z M32 28.5 V38 M12 38 H52 M20 47.5 H44 M28 57 H36';

/**
 * The mark "Messa a terra": a cloud on the electrical ground symbol, one
 * round stroke in currentColor. The colour comes from the theme
 * (custom.css, .cg-mark: --cg-logo, #2F5BFF light and #7D97FF dark).
 */
export default function LogoMark({size = 28, className}: Props): ReactNode {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden="true" className={clsx('cg-mark', className)}>
      <path
        d={MARK_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
