import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useDoc, useSidebarBreadcrumbs} from '@docusaurus/plugin-content-docs/client';
import {translate} from '@docusaurus/Translate';

/**
 * Front matter read by the page header, besides title and description
 * (the full template is in STANDARD.md §2):
 *
 *   heading: Installa            # big title; defaults to `title`
 *   heading_accent: CloudGround. # the title's last words, in italic blue
 *   type: how-to                 # tutorial | how-to | reference | explanation | index
 *   prerequisites: [...]         # shown as "Serve"
 *   version: unreleased
 *   last_verified: unverified    # or YYYY-MM-DD
 *   meta:                        # optional extra cells
 *     time: "10 minuti"
 *     level: Base
 */
type HeaderFrontMatter = {
  heading?: string;
  heading_accent?: string;
  type?: string;
  prerequisites?: string[];
  version?: string;
  last_verified?: string | Date;
  meta?: {time?: string; level?: string; requires?: string};
};

/** Documentazione / group / page, from the sidebar the page belongs to. */
function Crumbs(): ReactNode {
  const crumbs = useSidebarBreadcrumbs() ?? [];
  const {metadata} = useDoc();
  const trail = crumbs.filter((item) => item.type !== 'category' || item.label);
  return (
    <nav className="cg-crumbs" aria-label={translate({id: 'theme.docs.breadcrumbs.navAriaLabel', message: 'Breadcrumbs'})}>
      <ol>
        <li>
          <Link to="/docs">{translate({id: 'cg.crumbs.docs', message: 'Documentazione'})}</Link>
        </li>
        {trail.slice(0, -1).map((item, i) => (
          <li key={i}>
            <span className="cg-crumbs__sep" aria-hidden="true">/</span>
            {item.href ? <Link to={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          </li>
        ))}
        {metadata.permalink !== '/docs' && trail.length > 0 && (
          <li aria-current="page">
            <span className="cg-crumbs__sep" aria-hidden="true">/</span>
            <span>{trail[trail.length - 1]!.label}</span>
          </li>
        )}
      </ol>
    </nav>
  );
}

export function DocHeader(): ReactNode {
  const {metadata, frontMatter} = useDoc();
  const fm = frontMatter as typeof frontMatter & HeaderFrontMatter;
  const heading = fm.heading ?? metadata.title;
  return (
    <header className="cg-pagehead">
      <Crumbs />
      <h1 className="cg-pagehead__title">
        {heading}
        {fm.heading_accent && (
          <>
            {' '}
            <span className="cg-pagehead__accent">{fm.heading_accent}</span>
          </>
        )}
      </h1>
      {metadata.description && <p className="cg-pagehead__lead">{metadata.description}</p>}
    </header>
  );
}

function typeLabel(type: string | undefined): string | undefined {
  switch (type) {
    case 'tutorial':
      return translate({id: 'cg.type.tutorial', message: 'Tutorial'});
    case 'how-to':
      return translate({id: 'cg.type.howto', message: 'Guida pratica'});
    case 'reference':
      return translate({id: 'cg.type.reference', message: 'Riferimento'});
    case 'explanation':
      return translate({id: 'cg.type.explanation', message: 'Spiegazione'});
    default:
      return undefined;
  }
}

export function DocMetaStrip(): ReactNode {
  const {frontMatter} = useDoc();
  const fm = frontMatter as HeaderFrontMatter;
  if (fm.type === 'index' || !fm.type) {
    return null;
  }
  const meta = fm.meta ?? {};
  const lv = fm.last_verified instanceof Date ? fm.last_verified.toISOString().slice(0, 10) : fm.last_verified;
  const unverified = !lv || lv === 'unverified';
  const requires = fm.prerequisites?.length ? fm.prerequisites.join(' · ') : meta.requires;
  // The short facts on one ruled line, what the page needs on its own below.
  const cells: [string, string | undefined, ('warn' | 'ok' | 'wide')?][] = [
    [translate({id: 'cg.meta.type', message: 'Tipo'}), typeLabel(fm.type)],
    [translate({id: 'cg.meta.time', message: 'Tempo'}), meta.time],
    [translate({id: 'cg.meta.level', message: 'Livello'}), meta.level],
    [translate({id: 'cg.meta.version', message: 'Versione'}), fm.version],
    [
      translate({id: 'cg.meta.verified', message: 'Ultima verifica'}),
      unverified ? translate({id: 'cg.meta.unverified', message: 'Non verificata'}) : lv,
      unverified ? 'warn' : 'ok',
    ],
    [translate({id: 'cg.meta.requires', message: 'Serve'}), requires, 'wide'],
  ];
  return (
    <dl className="cg-metastrip">
      {cells
        .filter(([, value]) => value)
        .map(([label, value, flag]) => (
          <div
            key={label}
            className={`cg-metastrip__cell${flag === 'warn' ? ' cg-metastrip__cell--unverified' : ''}${
              flag === 'ok' ? ' cg-metastrip__cell--verified' : ''
            }${
              flag === 'wide' ? ' cg-metastrip__cell--wide' : ''
            }`}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
    </dl>
  );
}
