import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames, processAdmonitionProps} from '@docusaurus/theme-common';
import {translate} from '@docusaurus/Translate';
import type {Props} from '@theme/Admonition';
import Icon, {type IconName} from '@site/src/components/Icon';

// A full 1px frame on a tint, an icon and the title: danger in the error
// colour, warning / caution in amber, note / info / tip in blue.
function tone(type: string): {kind: 'err' | 'warn' | 'info'; icon: IconName} {
  switch (type) {
    case 'danger':
      return {kind: 'err', icon: 'alert-circle'};
    case 'warning':
    case 'caution':
      return {kind: 'warn', icon: 'alert-triangle'};
    case 'tip':
      return {kind: 'info', icon: 'check-circle'};
    default:
      return {kind: 'info', icon: 'info'};
  }
}

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
  const {kind, icon} = tone(type);
  return (
    <aside
      id={id}
      className={clsx(
        ThemeClassNames.common.admonition,
        ThemeClassNames.common.admonitionType(type),
        'cg-adm',
        `cg-adm--${kind}`,
        className,
      )}>
      <p className="cg-adm__head">
        <Icon name={icon} size={20} />
        <span className="cg-adm__type">{typeLabel(type)}</span>
        {title && <span className="cg-adm__title">{title}</span>}
      </p>
      {children && <div className="cg-adm__body">{children}</div>}
    </aside>
  );
}
