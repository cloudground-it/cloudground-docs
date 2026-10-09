import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';

/** A grid of hairline cells; linked cells invert on hover. */
export function Cards({children}: {children: ReactNode}): ReactNode {
  return <div className="cg-cards">{children}</div>;
}

type CardProps = {to?: string; label?: string; title: string; children?: ReactNode};

export function Card({to, label, title, children}: CardProps): ReactNode {
  const body = (
    <>
      {label && <span className="hud cg-n">{label}</span>}
      <span className="disp cg-card__title">{title}</span>
      {children && <span className="cg-m cg-card__text">{children}</span>}
    </>
  );
  return to ? (
    <Link to={to} className="cg-inv cg-card">
      {body}
    </Link>
  ) : (
    <div className="cg-card cg-card--static">{body}</div>
  );
}
