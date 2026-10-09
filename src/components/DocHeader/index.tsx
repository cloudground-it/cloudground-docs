import React, {type ReactNode} from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {translate} from '@docusaurus/Translate';
import {useSidebarNumber} from '@site/src/utils/sidebarNumber';

/**
 * Front matter read by the page header, besides title and description:
 *
 *   heading: Installa            # big title; defaults to `title`
 *   heading_accent: CloudGround. # set in the serif italic, in blue
 *   meta:                        # optional strip under the header
 *     time: "[X] minuti"
 *     level: Base
 *     requires: Accesso root
 *     verified: "[DATA]"
 */
type HeaderFrontMatter = {
  heading?: string;
  heading_accent?: string;
  meta?: {time?: string; level?: string; requires?: string; verified?: string};
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

export function DocMetaStrip(): ReactNode {
  const {frontMatter} = useDoc();
  const meta = (frontMatter as HeaderFrontMatter).meta;
  if (!meta) {
    return null;
  }
  const cells: [string, string | undefined][] = [
    [translate({id: 'cg.meta.time', message: 'Tempo'}), meta.time],
    [translate({id: 'cg.meta.level', message: 'Livello'}), meta.level],
    [translate({id: 'cg.meta.requires', message: 'Serve'}), meta.requires],
    [translate({id: 'cg.meta.verified', message: 'Ultima verifica'}), meta.verified],
  ];
  return (
    <dl className="cg-metastrip">
      {cells
        .filter(([, value]) => value)
        .map(([label, value]) => (
          <div key={label} className="cg-metastrip__cell">
            <dt className="hud">{label}</dt>
            <dd className="disp">{value}</dd>
          </div>
        ))}
    </dl>
  );
}
