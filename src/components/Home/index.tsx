import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import CacheScope from './CacheScope';
import Terminal from './Terminal';
import useAnchor from './useAnchor';
import {BENCH_METHOD_URL, BENCH_URL, REPO} from '@site/src/data/site';
import styles from './Home.module.css';

/**
 * The home page, ported from the approved design
 * (cloudground-website/design/reference/home.dc.html). Every section is plain
 * markup rendered at build time: the two controls (the cache switch and the
 * copy button) are the only parts that need JavaScript, and without it they
 * are simply not drawn.
 */

function Accent({children, tone = 'blue'}: {children: ReactNode; tone?: 'blue' | 'orange'}): ReactNode {
  return <span className={`ser ${tone === 'blue' ? styles.blue : styles.orange}`}>{children}</span>;
}

function Hero(): ReactNode {
  return (
    <header className={`${styles.frame} ${styles.hero}`}>
      <div className={styles.heroText}>
        <span className={`hud ${styles.kicker}`}>
          <Translate id="home.hero.kicker">001 / Pannello di hosting sui tuoi server</Translate>
        </span>
        <h1 className={`disp ${styles.h1}`}>
          <Translate id="home.hero.title1">Hosting</Translate>
          <br />
          <Translate
            id="home.hero.title2"
            values={{
              accent: (
                <Accent>
                  <Translate id="home.hero.titleAccent">misura.</Translate>
                </Accent>
              ),
            }}>
            {'che si {accent}'}
          </Translate>
        </h1>
        <p className={styles.lede}>
          <Translate id="home.hero.lede">
            Un comando installa il pannello sul tuo server. Ogni sito nasce con la sua cache, il suo PHP, il suo
            certificato e backup che vengono ripristinati per prova dopo ogni copia.
          </Translate>
        </p>
        <div className={styles.actions}>
          <a href="#installa" className={`${styles.btn} ${styles.btnInk}`}>
            <Translate id="home.hero.install">Installa in un comando</Translate>
            <span className="hud" aria-hidden="true">
              →
            </span>
          </a>
          <Link to="/docs" className={`${styles.btn} ${styles.btnLine}`}>
            <Translate id="home.hero.docs">Leggi la guida</Translate>
          </Link>
        </div>
        <span className={`hud ${styles.faint}`}>
          <Translate id="home.hero.facts">Gratis · Codice consultabile · Sui tuoi server</Translate>
        </span>
      </div>
      <div className={styles.heroScope}>
        <CacheScope />
      </div>
    </header>
  );
}

const TECH: {name: string; serif?: 'blue' | 'orange'}[] = [
  {name: 'nginx'},
  {name: 'PHP 8.5', serif: 'blue'},
  {name: 'MariaDB'},
  {name: 'APCu', serif: 'orange'},
  {name: 'restic'},
  {name: 'Let’s Encrypt', serif: 'blue'},
  {name: 'WooCommerce'},
  {name: 'WordPress', serif: 'orange'},
  {name: 'Laravel'},
  {name: 'systemd', serif: 'blue'},
];

function Marquee(): ReactNode {
  const row = (hidden: boolean) => (
    <ul className={styles.marqueeRow} aria-hidden={hidden || undefined}>
      {TECH.map((t) => (
        <li key={t.name} className={t.serif ? `ser ${styles.marqueeSerif} ${styles[t.serif]}` : `disp ${styles.marqueeDisp}`}>
          {t.name}
        </li>
      ))}
    </ul>
  );
  return (
    <section className={styles.marquee} aria-label={translate({id: 'home.tech.label', message: 'Tecnologie'})}>
      <div className={styles.marqueeTrack}>
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}

function SectionHead({
  kicker,
  title,
  intro,
  id,
}: {
  kicker: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  id: string;
}): ReactNode {
  return (
    <div className={styles.sectionHead}>
      <div className={styles.sectionTitle}>
        <span className={`hud ${styles.kicker}`}>{kicker}</span>
        <h2 className={`disp ${styles.h2}`} id={`${id}-title`}>
          {title}
        </h2>
      </div>
      {intro && <p className={styles.intro}>{intro}</p>}
    </div>
  );
}

function Features(): ReactNode {
  const id = useAnchor('funzioni');
  const features = [
    {
      tag: translate({id: 'home.features.1.tag', message: 'Velocità'}),
      title: translate({id: 'home.features.1.title', message: 'Cache di pagina mirata'}),
      text: translate({
        id: 'home.features.1.text',
        message:
          'nginx serve le pagine senza toccare PHP. Quando cambi un articolo o un prezzo, si svuotano solo le pagine che lo mostrano.',
      }),
    },
    {
      tag: translate({id: 'home.features.2.tag', message: 'Isolamento'}),
      title: translate({id: 'home.features.2.title', message: 'Un PHP per ogni sito'}),
      text: translate({
        id: 'home.features.2.text',
        message: 'Utente di sistema, PHP e database separati. Un sito compromesso non vede gli altri.',
      }),
    },
    {
      tag: translate({id: 'home.features.3.tag', message: 'Backup'}),
      title: translate({id: 'home.features.3.title', message: 'Ripristino già provato'}),
      text: translate({
        id: 'home.features.3.text',
        message: 'Ogni copia va cifrata dove scegli tu e viene ripristinata per prova subito dopo.',
      }),
    },
    {
      tag: translate({id: 'home.features.4.tag', message: 'Staging'}),
      title: translate({id: 'home.features.4.title', message: 'Prova prima, misura poi'}),
      text: translate({
        id: 'home.features.4.text',
        message: 'Una copia protetta da password. Un rilascio più lento della produzione viene fermato.',
      }),
    },
    {
      tag: 'HTTPS',
      title: translate({id: 'home.features.5.title', message: 'Certificati che si rinnovano'}),
      text: translate({id: 'home.features.5.text', message: 'Let’s Encrypt, wildcard compresi, o i tuoi certificati.'}),
    },
    {
      tag: 'File',
      title: translate({id: 'home.features.6.title', message: 'Un editor vero nel browser'}),
      text: translate({
        id: 'home.features.6.text',
        message: 'Riconosce il linguaggio, carica trascinando, lascia scaricare i binari.',
      }),
    },
    {
      tag: 'Database',
      title: translate({id: 'home.features.7.title', message: 'Il database, dentro il pannello'}),
      text: translate({
        id: 'home.features.7.text',
        message: 'Tabelle, dati e SQL con i permessi del solo sito, senza strumenti esterni.',
      }),
    },
    {
      tag: translate({id: 'home.features.8.tag', message: 'Accesso'}),
      title: translate({id: 'home.features.8.title', message: 'Ruoli e due fattori'}),
      text: translate({
        id: 'home.features.8.text',
        message: 'Amministratori, operatori sui loro siti, sola lettura. 2FA obbligatoria se vuoi.',
      }),
    },
  ];
  return (
    <section id={id} className={`${styles.frame} ${styles.section}`} aria-labelledby={`${id}-title`}>
      <SectionHead
        id={id}
        kicker={<Translate id="home.features.kicker">01 / Funzioni</Translate>}
        title={
          <Translate
            id="home.features.title"
            values={{
              accent: (
                <Accent>
                  <Translate id="home.features.titleAccent">tutorial</Translate>
                </Accent>
              ),
            }}>
            {'Il controllo che un {accent} non ti dà.'}
          </Translate>
        }
        intro={
          <Translate id="home.features.intro">
            Otto cose che di solito si configurano a mano, una sera alla volta. Qui sono accese dal primo sito.
          </Translate>
        }
      />
      <ul className={styles.cards}>
        {features.map((f, i) => (
          <li key={i} className={styles.card}>
            <div className={styles.cardTop}>
              <span className={`hud ${styles.muted}`}>{f.tag}</span>
              <span className={`hud ${styles.num}`}>{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3 className={`disp ${styles.h3}`}>{f.title}</h3>
            <p className={styles.muted}>{f.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Ownership(): ReactNode {
  const id = useAnchor('proprieta');
  const items = [
    {
      title: translate({id: 'home.own.a.title', message: 'Codice consultabile'}),
      text: translate({
        id: 'home.own.a.text',
        message: 'Leggi ogni riga che gira come root sul tuo server. Modificala, se serve.',
      }),
    },
    {
      title: translate({id: 'home.own.b.title', message: 'Tuo per sempre'}),
      text: translate({
        id: 'home.own.b.text',
        message:
          'Nessuna licenza da rinnovare, nessun costo per server. Se il progetto si fermasse, il pannello continuerebbe a funzionare.',
      }),
    },
    {
      title: translate({id: 'home.own.c.title', message: 'Nessun intermediario'}),
      text: translate({
        id: 'home.own.c.text',
        message: 'Nessun account presso di noi, nessun servizio in mezzo. I backup vanno dove scegli tu.',
      }),
    },
  ];
  return (
    <section id={id} className={styles.dark} aria-labelledby={`${id}-title`}>
      <div className={`${styles.frame} ${styles.darkFrame}`}>
        <div className={styles.darkHead}>
          <span className={`hud ${styles.darkMuted}`}>
            <Translate id="home.own.kicker">02 / Proprietà</Translate>
          </span>
          <h2 className={`disp ${styles.h2Big}`} id={`${id}-title`}>
            <Translate
              id="home.own.title"
              values={{
                accent: (
                  <Accent tone="orange">
                    <Translate id="home.own.titleAccent">affittare</Translate>
                  </Accent>
                ),
              }}>
              {'Smetti di {accent} il tuo server.'}
            </Translate>
          </h2>
        </div>
        <ul className={styles.darkGrid}>
          {items.map((item, i) => (
            <li key={i} className={styles.darkCell}>
              <span className={`hud ${styles.orange}`}>{'ABC'[i]}</span>
              <h3 className={`disp ${styles.h3Big}`}>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * The numbers are the means of bench/phase-10-fresh.md, section "The release
 * candidate on the purged box" (v0.1.0, three runs each). Change them only
 * together with that file.
 */
const MEASURES = [
  {key: 'cachedMany', rps: 9710},
  {key: 'cachedOne', rps: 6347},
  {key: 'static', rps: 15478},
  {key: 'browsers', rps: 9641},
  {key: 'uncached', rps: 6.82},
] as const;

function Measures(): ReactNode {
  const id = useAnchor('misure');
  const {i18n} = useDocusaurusContext();
  const number = (n: number) =>
    new Intl.NumberFormat(i18n.currentLocale, {
      maximumFractionDigits: n < 100 ? 1 : 0,
      // Italian leaves four-digit numbers ungrouped by default; the column
      // reads better when 9.710 and 15.478 look alike.
      useGrouping: 'always',
    } as unknown as Intl.NumberFormatOptions).format(n);
  const labels: Record<(typeof MEASURES)[number]['key'], [string, string]> = {
    cachedMany: [
      translate({id: 'home.measures.cached', message: 'Pagina in cache'}),
      translate({id: 'home.measures.cachedMany.note', message: '500 connessioni'}),
    ],
    cachedOne: [
      translate({id: 'home.measures.cached', message: 'Pagina in cache'}),
      translate({id: 'home.measures.cachedOne.note', message: '1 connessione'}),
    ],
    static: [
      translate({id: 'home.measures.static', message: 'File statico'}),
      translate({id: 'home.measures.static.note', message: '1 KB, 200 connessioni'}),
    ],
    browsers: [
      translate({id: 'home.measures.browsers', message: 'Traffico da browser'}),
      translate({id: 'home.measures.browsers.note', message: 'header e link misti, 200 connessioni'}),
    ],
    uncached: [
      translate({id: 'home.measures.uncached', message: 'Senza cache'}),
      translate({id: 'home.measures.uncached.note', message: 'PHP + database, 10 connessioni'}),
    ],
  };
  const caption = translate({id: 'home.measures.caption', message: 'Risultati delle misure, per scenario'});
  return (
    <section id={id} className={`${styles.frame} ${styles.section}`} aria-labelledby={`${id}-title`}>
      <SectionHead
        id={id}
        kicker={<Translate id="home.measures.kicker">03 / Misure</Translate>}
        title={
          <Translate
            id="home.measures.title"
            values={{
              accent: (
                <Accent tone="orange">
                  <Translate id="home.measures.titleAccent">promesso.</Translate>
                </Accent>
              ),
            }}>
            {'Misurato, non {accent}'}
          </Translate>
        }
        intro={
          <Translate id="home.measures.intro">
            La release v0.1.0 su un piccolo VPS, sotto wrk: tre giri per scenario, qui la media. Il metodo e ogni
            singolo giro sono pubblici.
          </Translate>
        }
      />
      <div className={styles.tableScroll} role="region" aria-label={caption} tabIndex={0}>
        <table className={styles.table}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              <th scope="col" className="hud">
                <Translate id="home.measures.scenario">Scenario</Translate>
              </th>
              <th scope="col" className="hud">
                <Translate id="home.measures.rps">Richieste / s</Translate>
              </th>
              <th scope="col" className="hud">
                <Translate id="home.measures.errors">Errori</Translate>
              </th>
            </tr>
          </thead>
          <tbody>
            {MEASURES.map((m) => (
              <tr key={m.key}>
                <th scope="row">
                  <span className={`disp ${styles.scenario}`}>{labels[m.key][0]}</span>{' '}
                  <span className={`hud ${styles.muted} ${styles.scenarioNote}`}>{labels[m.key][1]}</span>
                </th>
                <td className={`disp ${styles.figure}`}>{number(m.rps)}</td>
                <td className={`hud ${styles.muted} ${styles.errors}`}>0</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className={`hud ${styles.notes}`}>
        <li>
          <Translate id="home.measures.server">Server: VPS 2 vCPU · Ubuntu 26.04</Translate>
        </li>
        <li>
          <Translate id="home.measures.site">Sito: WooCommerce, pagina del negozio</Translate>
        </li>
        <li>
          <Translate id="home.measures.load">Carico: wrk sullo stesso server</Translate>
        </li>
        <li>
          <Translate id="home.measures.date">Misura: 11 ottobre 2026</Translate>
        </li>
        <li>
          <a href={BENCH_URL}>
            <Translate id="home.measures.data">I dati ↗</Translate>
          </a>
        </li>
        <li>
          <a href={BENCH_METHOD_URL}>
            <Translate id="home.measures.method">Il metodo ↗</Translate>
          </a>
        </li>
      </ul>
    </section>
  );
}

function Install(): ReactNode {
  const id = useAnchor('installa');
  const steps = [
    translate({id: 'home.install.step1', message: 'Un server Ubuntu 24.04 o 26.04 appena creato, accesso root.'}),
    translate({id: 'home.install.step2', message: 'Il comando qui accanto. Controlla il server prima di toccare qualcosa.'}),
    translate({id: 'home.install.step3', message: 'Apri il link monouso, crea l’amministratore, crea il primo sito.'}),
  ];
  return (
    <section id={id} className={styles.installBand} aria-labelledby={`${id}-title`}>
      <div className={`${styles.frame} ${styles.install}`}>
        <div className={styles.installText}>
          <span className={`hud ${styles.kicker}`}>
            <Translate id="home.install.kicker">04 / Installazione</Translate>
          </span>
          <h2 className={`disp ${styles.h2Install}`} id={`${id}-title`}>
            <Translate
              id="home.install.title"
              values={{
                accent: (
                  <Accent>
                    <Translate id="home.install.titleAccent">Davvero.</Translate>
                  </Accent>
                ),
              }}>
              {'Un comando. {accent}'}
            </Translate>
          </h2>
          <ol className={styles.steps}>
            {steps.map((s, i) => (
              <li key={i}>
                <span className={`hud ${styles.orange}`} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
          <Link to="/docs/tutorials/install" className={styles.more}>
            <Translate id="home.install.guide">La guida all’installazione</Translate>
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
        <div className={styles.installTerm}>
          <Terminal />
          <p className={`hud ${styles.faint}`}>
            <Translate id="home.install.note">Uscita abbreviata. Il log completo resta in /var/log/cloudground-install.log.</Translate>
          </p>
        </div>
      </div>
    </section>
  );
}

function Closing(): ReactNode {
  return (
    <section className={styles.closingBand} aria-labelledby="accendi-title">
      <div className={`${styles.frame} ${styles.closing}`}>
        <span className={`hud ${styles.kicker}`}>
          <Translate id="home.closing.kicker">Gratis · Nessun abbonamento</Translate>
        </span>
        <h2 className={`disp ${styles.h2Huge}`} id="accendi-title">
          <Translate id="home.closing.title1">Accendi il</Translate>
          <br />
          <Translate
            id="home.closing.title2"
            values={{
              accent: (
                <Accent>
                  <Translate id="home.closing.titleAccent">server.</Translate>
                </Accent>
              ),
            }}>
            {'tuo {accent}'}
          </Translate>
        </h2>
        <div className={styles.actions}>
          <a href="#installa" className={`${styles.btn} ${styles.btnInk} ${styles.btnBig}`}>
            <Translate id="home.closing.install">Installa CloudGround</Translate>
            <span className="hud" aria-hidden="true">
              →
            </span>
          </a>
          <a href={REPO} className={`${styles.btn} ${styles.btnLine} ${styles.btnBig}`}>
            <Translate id="home.closing.github">Il codice su GitHub</Translate>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <main id="top" className={styles.home}>
      <Hero />
      <Marquee />
      <Features />
      <Ownership />
      <Measures />
      <Install />
      <Closing />
    </main>
  );
}
