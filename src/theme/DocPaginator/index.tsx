import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import type {Props} from '@theme/DocPaginator';
import Icon from '@site/src/components/Icon';

type Nav = NonNullable<Props['previous']>;

function Cell({nav, isNext}: {nav: Nav; isNext: boolean}): ReactNode {
  const word = isNext
    ? translate({id: 'cg.paginator.next', message: 'Successiva'})
    : translate({id: 'cg.paginator.previous', message: 'Precedente'});
  return (
    <Link to={nav.permalink} className={`cg-pager__cell${isNext ? ' cg-pager__cell--next' : ''}`} rel={isNext ? 'next' : 'prev'}>
      <small className="cg-pager__sub">
        {!isNext && <Icon name="arrow-left" size={14} />}
        {word}
        {isNext && <Icon name="arrow-right" size={14} />}
      </small>
      <span className="cg-pager__title">{nav.title}</span>
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
