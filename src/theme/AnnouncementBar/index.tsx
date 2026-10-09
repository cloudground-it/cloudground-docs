import React, {type ReactNode} from 'react';
import Translate from '@docusaurus/Translate';

/**
 * The HUD strip above the navbar. It replaces the announcement bar slot, so it
 * scrolls away while the navbar stays.
 */
export default function AnnouncementBar(): ReactNode {
  return (
    <div className="cg-hudstrip" role="note">
      <div className="cg-hudstrip__inner hud">
        <span>
          <Translate id="cg.hud.docs">Documentazione</Translate>
        </span>
        <span>
          <Translate id="cg.hud.version">Versione [VERSIONE]</Translate>
        </span>
        <span>
          <Translate id="cg.hud.verified">Verificata su Ubuntu 24.04 · 26.04</Translate>
        </span>
        <a className="cg-hudstrip__home" href="https://cloudground.it">
          ← cloudground.it
        </a>
      </div>
    </div>
  );
}
