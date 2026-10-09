import React, {type ReactNode} from 'react';
import Translate from '@docusaurus/Translate';

function Footer(): ReactNode {
  return (
    <footer className="cg-footer">
      <div className="cg-footer__row hud">
        <span>CloudGround docs</span>
        <span>
          <Translate id="cg.footer.license">Testi con licenza [LICENZA DOCS]</Translate>
        </span>
        <a className="cg-footer__home" href="https://cloudground.it">
          cloudground.it ↗
        </a>
      </div>
      <div className="cg-footer__word disp" aria-hidden="true">
        documenta.
      </div>
    </footer>
  );
}

export default React.memo(Footer);
