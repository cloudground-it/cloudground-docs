import React, {type ReactNode} from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import Icon from '@site/src/components/Icon';
import {RELEASE, RELEASE_URL} from '@site/src/data/site';

/**
 * The status strip above the navbar, on every page: the project's state in one
 * line. It takes the announcement bar's slot, so it scrolls away while the
 * navbar stays.
 */
export default function AnnouncementBar(): ReactNode {
  return (
    <aside
      className="cg-hudstrip"
      aria-label={translate({id: 'cg.status.label', message: 'Stato del progetto'})}>
      <ul className="cg-hudstrip__inner hud">
        <li className="cg-hudstrip__live">
          <span className="cg-led" aria-hidden="true" />
          <a href={RELEASE_URL} className="cg-ghlink">
            <Icon name="github" size={14} />
            <Translate id="cg.status.release" values={{version: RELEASE}}>
              {'Release {version} disponibile'}
            </Translate>
          </a>
        </li>
        <li>Ubuntu 24.04 · 26.04</li>
        <li>
          <Translate id="cg.status.license">Licenza Elastic 2.0</Translate>
        </li>
        <li className="cg-hudstrip__end">
          <Translate id="cg.status.price">Nessun abbonamento</Translate>
        </li>
      </ul>
    </aside>
  );
}
