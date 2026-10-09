import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import type {Props} from '@theme/DocPaginator';
import {useSidebarNumber} from '@site/src/utils/sidebarNumber';

type Nav = NonNullable<Props['previous']>;

function Cell({nav, isNext}: {nav: Nav; isNext: boolean}): ReactNode {
  const num = useSidebarNumber(nav.permalink);
  const word = isNext
    ? translate({id: 'cg.paginator.next', message: 'Successiva'})
    : translate({id: 'cg.paginator.previous', message: 'Precedente'});
  const sub = isNext
    ? `${num ? `${num.position} · ` : ''}${word} →`
    : `← ${word}${num ? ` · ${num.position}` : ''}`;
  return (
    <Link to={nav.permalink} className={`cg-inv cg-pager__cell${isNext ? ' cg-pager__cell--next' : ''}`} rel={isNext ? 'next' : 'prev'}>
      <span className="hud cg-m">{sub}</span>
      <span className="disp cg-pager__title">{nav.title}</span>
    </Link>
  );
}

export default function DocPaginator({previous, next, className}: Props): ReactNode {
  if (!previous && !next) {
    return null;
  }
  return (
    <nav
      className={`cg-pager ${className ?? ''}`}
      aria-label={translate({id: 'theme.docs.paginator.navAriaLabel', message: 'Docs pages'})}>
      {previous ? <Cell nav={previous} isNext={false} /> : <span className="cg-pager__empty" />}
      {next ? <Cell nav={next} isNext /> : <span className="cg-pager__empty" />}
    </nav>
  );
}
