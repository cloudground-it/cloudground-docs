import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import LogoMark from '@site/src/components/LogoMark';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {DOCS_REPO, ISSUES_URL, RELEASE, RELEASE_URL, REPO, featuresPath} from '@site/src/data/site';

type FooterLink = {to?: string; href?: string; label: ReactNode};

/**
 * The footer of every page, on the second paper: the mark and the licence
 * line, then short columns of links grouped by kind. Nothing in it needs a
 * server: questions and reports go to GitHub.
 */
function Column({title, links}: {title: ReactNode; links: FooterLink[]}): ReactNode {
  return (
    <div className="cg-footer__col">
      <h2 className="cg-footer__head">{title}</h2>
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
  const {i18n} = useDocusaurusContext();
  return (
    <footer className="cg-footer">
      <div className="cg-footer__top">
        <div className="cg-footer__brand">
          <Link to="/" className="cg-footer__logo">
            <LogoMark size={32} />
            <span>CloudGround</span>
          </Link>
          <p className="cg-footer__tagline">
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
              {to: featuresPath(i18n.currentLocale), label: <Translate id="cg.footer.allFeatures">Funzionalità</Translate>},
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
              {
                href: RELEASE_URL,
                label: (
                  <Translate id="cg.footer.release" values={{version: RELEASE}}>
                    {'Release {version}'}
                  </Translate>
                ),
              },
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
    </footer>
  );
}

export default React.memo(Footer);
