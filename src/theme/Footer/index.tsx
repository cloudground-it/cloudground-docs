import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import LogoMark from '@site/src/components/LogoMark';
import {DOCS_REPO, ISSUES_URL, RELEASES_URL, REPO} from '@site/src/data/site';

type FooterLink = {to?: string; href?: string; label: ReactNode};

/**
 * The footer of every page: the mark and its line, short columns of links
 * grouped by kind, and the name drawn as large as the page allows, cut off by
 * the bottom edge. Nothing in it needs a server: questions and reports go to
 * GitHub.
 */
function Column({title, links}: {title: ReactNode; links: FooterLink[]}): ReactNode {
  return (
    <div className="cg-footer__col">
      <p className="hud cg-footer__head">{title}</p>
      <ul>
        {links.map((link, i) => (
          <li key={i}>
            {link.to ? (
              <Link to={link.to}>{link.label}</Link>
            ) : (
              <a href={link.href}>{link.label}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Footer(): ReactNode {
  return (
    <footer className="cg-footer">
      <div className="cg-footer__top">
        <div className="cg-footer__brand">
          <LogoMark size={40} inverted />
          <p className="hud">
            <Translate id="cg.footer.tagline">Hosting che si misura</Translate>
          </p>
          <p className="cg-footer__license">
            <Translate
              id="cg.footer.licenseLine"
              values={{
                license: (
                  <Link to="/docs/reference/licence">Elastic License 2.0</Link>
                ),
              }}>
              {'CloudGround è source-available con la {license}: gratis da usare sui tuoi server.'}
            </Translate>
          </p>
        </div>
        <nav
          className="cg-footer__nav"
          aria-label={translate({id: 'cg.footer.label', message: 'Piè di pagina'})}>
          <Column
            title={<Translate id="cg.footer.product">Prodotto</Translate>}
            links={[
              {to: '/#funzioni', label: <Translate id="cg.footer.features">Funzioni</Translate>},
              {to: '/#misure', label: <Translate id="cg.footer.measures">Misure</Translate>},
              {to: '/#installa', label: <Translate id="cg.footer.install">Installazione</Translate>},
            ]}
          />
          <Column
            title={<Translate id="cg.footer.resources">Risorse</Translate>}
            links={[
              {to: '/docs', label: <Translate id="cg.footer.docs">Documentazione</Translate>},
              {to: '/docs/cli', label: 'CLI'},
              {to: '/docs/api', label: 'API'},
              {href: RELEASES_URL, label: <Translate id="cg.footer.releases">Novità</Translate>},
            ]}
          />
          <Column
            title="GitHub"
            links={[
              {href: REPO, label: <Translate id="cg.footer.code">Il codice</Translate>},
              {href: ISSUES_URL, label: <Translate id="cg.footer.issues">Segnala un problema</Translate>},
              {href: DOCS_REPO, label: <Translate id="cg.footer.docsRepo">Il sito e la guida</Translate>},
            ]}
          />
          <Column
            title={<Translate id="cg.footer.legal">Legale</Translate>}
            links={[
              {to: '/docs/reference/licence', label: <Translate id="cg.footer.licence">Licenza</Translate>},
              {to: '/privacy', label: 'Privacy'},
            ]}
          />
        </nav>
      </div>
      {/* The name as a picture: neither read aloud nor measured as text, which
          at this contrast it is not meant to be. */}
      <div className="cg-footer__word disp" aria-hidden="true">
        cloudground
      </div>
    </footer>
  );
}

export default React.memo(Footer);
