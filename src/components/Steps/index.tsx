import React, {type ReactNode} from 'react';

/** A strict sequence: ruled rows, the number in blue mono (CSS counter). */
export function Steps({children}: {children: ReactNode}): ReactNode {
  return <ol className="cg-steps">{children}</ol>;
}

export function Step({title, children}: {title: string; children?: ReactNode}): ReactNode {
  return (
    <li className="cg-step">
      <span className="cg-step__num" aria-hidden="true" />
      <span className="cg-step__body">
        <span className="cg-step__title">{title}</span>
        {children && <span className="cg-step__text">{children}</span>}
      </span>
    </li>
  );
}
