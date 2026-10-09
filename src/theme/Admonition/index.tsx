import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames, processAdmonitionProps} from '@docusaurus/theme-common';
import {translate} from '@docusaurus/Translate';
import type {Props} from '@theme/Admonition';

// danger / warning / caution: ink bar, orange label. note / info / tip: blue bar.
const INK = new Set(['danger', 'warning', 'caution']);

function typeLabel(type: string): string {
  switch (type) {
    case 'danger':
      return translate({id: 'cg.admonition.danger', message: 'Pericolo'});
    case 'warning':
    case 'caution':
      return translate({id: 'cg.admonition.warning', message: 'Attenzione'});
    case 'tip':
      return translate({id: 'cg.admonition.tip', message: 'Suggerimento'});
    case 'info':
      return translate({id: 'cg.admonition.info', message: 'Info'});
    default:
      return translate({id: 'cg.admonition.note', message: 'Nota'});
  }
}

export default function Admonition(unprocessedProps: Props): ReactNode {
  const {type, title, children, className, id} = processAdmonitionProps(unprocessedProps);
  return (
    <aside
      id={id}
      className={clsx(
        ThemeClassNames.common.admonition,
        ThemeClassNames.common.admonitionType(type),
        'cg-adm',
        INK.has(type) ? 'cg-adm--ink' : 'cg-adm--blue',
        className,
      )}>
      <div className="cg-adm__bar">
        <span className="hud cg-adm__type">{typeLabel(type)}</span>
        {title && <span className="hud cg-adm__title">{title}</span>}
      </div>
      {children && <div className="cg-adm__body">{children}</div>}
    </aside>
  );
}
