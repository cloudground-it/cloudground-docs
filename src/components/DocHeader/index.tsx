import React, {type ReactNode} from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {translate} from '@docusaurus/Translate';
import {useSidebarNumber} from '@site/src/utils/sidebarNumber';

/**
 * Front matter read by the page header, besides title and description
 * (the full template is in STANDARD.md §2):
 *
 *   heading: Installa            # big title; defaults to `title`
 *   heading_accent: CloudGround. # set in the serif italic, in blue
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

export function DocHeader(): ReactNode {
  const {metadata, frontMatter} = useDoc();
  const fm = frontMatter as typeof frontMatter & HeaderFrontMatter;
  const num = useSidebarNumber(metadata.permalink);
  const heading = fm.heading ?? metadata.title;
  return (
    <header className="cg-pagehead">
      {num && (
        <span className="hud cg-pagehead__crumb cg-in1">
          {num.group} / {num.groupLabel}
          {num.position.includes('.') ? ` · ${num.position}` : ''}
        </span>
      )}
      <h1 className="disp cg-pagehead__title cg-in2">
        {heading}
        {fm.heading_accent && (
          <>
            {' '}
            <span className="ser cg-accent">{fm.heading_accent}</span>
          </>
        )}
      </h1>
      {metadata.description && <p className="cg-pagehead__lead cg-in3">{metadata.description}</p>}
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
  const cells: [string, string | undefined, boolean?][] = [
    [translate({id: 'cg.meta.type', message: 'Tipo'}), typeLabel(fm.type)],
    [translate({id: 'cg.meta.time', message: 'Tempo'}), meta.time],
    [translate({id: 'cg.meta.level', message: 'Livello'}), meta.level],
    [translate({id: 'cg.meta.requires', message: 'Serve'}), requires],
    [translate({id: 'cg.meta.version', message: 'Versione'}), fm.version],
    [
      translate({id: 'cg.meta.verified', message: 'Ultima verifica'}),
      unverified ? translate({id: 'cg.meta.unverified', message: 'Non verificata'}) : lv,
      unverified,
    ],
  ];
  return (
    <dl className="cg-metastrip">
      {cells
        .filter(([, value]) => value)
        .map(([label, value, warn]) => (
          <div key={label} className={`cg-metastrip__cell${warn ? ' cg-metastrip__cell--unverified' : ''}`}>
            <dt className="hud">{label}</dt>
            <dd className="disp">{value}</dd>
          </div>
        ))}
    </dl>
  );
}
