import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';

/** Ruled rows of links in two columns: a title, a line of text. No boxes. */
export function Cards({children}: {children: ReactNode}): ReactNode {
  return <div className="cg-cards">{children}</div>;
}

type CardProps = {to?: string; label?: string; title: string; children?: ReactNode};

export function Card({to, label, title, children}: CardProps): ReactNode {
  const body = (
    <>
      {label && <span className="cg-card__label">{label}</span>}
      <span className="cg-card__title">{title}</span>
      {children && <span className="cg-card__text">{children}</span>}
    </>
  );
  return to ? (
    <Link to={to} className="cg-card">
      {body}
    </Link>
  ) : (
    <div className="cg-card cg-card--static">{body}</div>
  );
}
