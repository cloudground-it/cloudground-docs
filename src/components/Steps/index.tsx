import React, {type ReactNode} from 'react';

/** A numbered list of steps on hairlines; each row inverts on hover. */
export function Steps({children}: {children: ReactNode}): ReactNode {
  return <ol className="cg-steps">{children}</ol>;
}

export function Step({title, children}: {title: string; children?: ReactNode}): ReactNode {
  return (
    <li className="cg-inv cg-step">
      <span className="hud cg-n cg-step__num" aria-hidden="true" />
      <span className="cg-step__body">
        <span className="disp cg-step__title">{title}</span>
        {children && <span className="cg-m cg-step__text">{children}</span>}
      </span>
    </li>
  );
}
