import React, {type ReactNode} from 'react';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Translate from '@docusaurus/Translate';
import ContentVisibility from '@theme/ContentVisibility';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocItemContent from '@theme/DocItem/Content';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import TOCItems from '@theme/TOCItems';
import type {Props} from '@theme/DocItem/Layout';
import {DocHeader, DocMetaStrip} from '@site/src/components/DocHeader';
import Feedback from '@site/src/components/Feedback';

function EditLink(): ReactNode {
  const {metadata} = useDoc();
  if (!metadata.editUrl) {
    return null;
  }
  return (
    <a className="hud cg-editlink" href={metadata.editUrl} target="_blank" rel="noopener noreferrer">
      <Translate id="cg.editThisPage">Modifica questa pagina ↗</Translate>
    </a>
  );
}

function DesktopTOC(): ReactNode {
  const {toc, frontMatter} = useDoc();
  return (
    <aside className="cg-toc" aria-labelledby="cg-toc-title">
      <div className="cg-toc__sticky">
        <span id="cg-toc-title" className="hud cg-toc__title">
          <Translate id="cg.toc.title">In questa pagina</Translate>
        </span>
        <TOCItems
          toc={toc}
          minHeadingLevel={frontMatter.toc_min_heading_level}
          maxHeadingLevel={frontMatter.toc_max_heading_level}
          className="cg-toc__list"
          linkClassName="cg-toc__link"
          linkActiveClassName="cg-toc__link--active"
        />
      </div>
    </aside>
  );
}

export default function DocItemLayout({children}: Props): ReactNode {
  const {metadata, frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();
  const canRenderTOC = !frontMatter.hide_table_of_contents && toc.length > 0;
  const desktopTOC = canRenderTOC && (windowSize === 'desktop' || windowSize === 'ssr');
  return (
    <div className="cg-doc">
      <div className="cg-doc__main">
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <DocHeader />
        <DocMetaStrip />
        <article className="cg-article">
          {canRenderTOC && <DocItemTOCMobile />}
          <DocItemContent>{children}</DocItemContent>
          <DocItemPaginator />
          <div className="cg-article__foot">
            <Feedback />
            <EditLink />
          </div>
        </article>
      </div>
      {desktopTOC && <DesktopTOC />}
    </div>
  );
}
