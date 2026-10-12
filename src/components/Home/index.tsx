import React, {useCallback, useEffect, useRef, useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useAnchor from './useAnchor';
import Icon, {type IconName} from '@site/src/components/Icon';
import {BENCH_METHOD_URL, BENCH_URL, INSTALL_COMMAND, RELEASE, RELEASE_URL} from '@site/src/data/site';
import styles from './Home.module.css';

/**
 * The home as a test report ("Rapporto di prova", design/DESIGN.md): the
 * protocol strip, the install command, one measured result with its outcome,
 * every measurement of the release, the safety tests, the limits of the test
 * and the install procedure. Every figure is a mean from bench/phase-10-fresh.md
 * in the product repository (section "The release candidate on the purged
 * box", the v0.1.0 tree, three runs per scenario). Never type a number here
 * that is not in that file.
 */

type Locale = string;

function useNumber(): (n: number) => string {
  const {i18n} = useDocusaurusContext();
  return (n: number) =>
    new Intl.NumberFormat(i18n.currentLocale as Locale, {
      maximumFractionDigits: n < 100 ? 2 : 0,
      // Italian leaves four-digit numbers ungrouped by default; the column
      // reads better when 9.710 and 15.478 look alike.
      useGrouping: 'always',
    } as unknown as Intl.NumberFormatOptions).format(n);
}

async function copyText(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const {default: copy} = await import('copy-text-to-clipboard');
  copy(text);
}

/** The install command on ink, with an orange Copy that says Copiato for 2 s. */
function Command(): ReactNode {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | undefined>(undefined);
  const onClick = useCallback(() => {
    void copyText(INSTALL_COMMAND).then(() => {
      setCopied(true);
      window.clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => setCopied(false), 2000);
    });
  }, []);
  useEffect(() => () => window.clearTimeout(timeout.current), []);
  return (
    <div className={styles.cmd}>
      <code>
        <span className={styles.pr} aria-hidden="true">
          ${' '}
        </span>
        {INSTALL_COMMAND}
      </code>
      <button
        type="button"
        className={styles.copy}
        onClick={onClick}
        aria-label={translate({id: 'home.install.copyLabel', message: 'Copia il comando di installazione'})}>
        <Icon name={copied ? 'check' : 'copy'} size={18} />
        <span aria-live="polite">
          {copied
            ? translate({id: 'theme.CodeBlock.copied', message: 'Copiato'})
            : translate({id: 'theme.CodeBlock.copy', message: 'Copia'})}
        </span>
      </button>
    </div>
  );
}

function Protocol(): ReactNode {
  const {siteConfig, i18n} = useDocusaurusContext();
  const built = String(siteConfig.customFields?.buildDate ?? '');
  const date = built
    ? new Intl.DateTimeFormat(i18n.currentLocale, {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}).format(
        new Date(`${built}T00:00:00Z`),
      )
    : '';
  return (
    <div className={styles.protocol}>
      <div className={styles.wrap}>
      <dl>
        <div>
          <dt>
            <Translate id="home.protocol.object">Oggetto della prova</Translate>
          </dt>
          <dd>
            <Translate id="home.protocol.objectValue">Un server Ubuntu con CloudGround</Translate>
          </dd>
        </div>
        <div>
          <dt>
            <Translate id="home.protocol.document">Documento</Translate>
          </dt>
          <dd className={styles.num}>CG-RP</dd>
        </div>
        <div>
          <dt>
            <Translate id="home.protocol.revision">Revisione</Translate>
          </dt>
          <dd className={styles.num}>
            <a href={RELEASE_URL}>{RELEASE}</a>
          </dd>
        </div>
        <div>
          <dt>
            <Translate id="home.protocol.date">Data</Translate>
          </dt>
          <dd>{date}</dd>
        </div>
      </dl>
      </div>
    </div>
  );
}

type Mode = 'con' | 'senza';

function Result(): ReactNode {
  const [mode, setMode] = useState<Mode>('con');
  const number = useNumber();
  const on = mode === 'con';
  return (
    <section className={styles.result} aria-labelledby="risultato-title">
      <div className={styles.resultHead}>
        <h2 id="risultato-title">
          <Translate id="home.result.title">Pagina del negozio WooCommerce</Translate>
        </h2>
        <div
          className={styles.seg}
          role="group"
          aria-label={translate({id: 'home.result.condition', message: 'Condizione della prova'})}>
          <button type="button" aria-pressed={on} onClick={() => setMode('con')}>
            <Translate id="home.result.with">Con cache</Translate>
          </button>
          <button type="button" aria-pressed={!on} onClick={() => setMode('senza')}>
            <Translate id="home.result.without">Senza cache</Translate>
          </button>
        </div>
      </div>
      <div className={styles.resultBody}>
        <div>
          <p className={styles.figLine} aria-live="polite">
            <span className={styles.fig}>{number(on ? 9710 : 6.82)}</span>
            <span className={styles.figUnit}>
              <Translate id="home.result.unit">richieste al secondo, media di 3 run</Translate>
            </span>
          </p>
          <dl className={styles.rows}>
            <dt>
              <Translate id="home.result.connections">Connessioni contemporanee</Translate>
            </dt>
            <dd>
              <span className={styles.num}>{on ? 500 : 10}</span>
            </dd>
            <dt>
              <Translate id="home.result.who">Chi risponde</Translate>
            </dt>
            <dd>
              {on
                ? translate({id: 'home.result.whoCache', message: 'cache di pagina nginx'})
                : translate({id: 'home.result.whoPhp', message: 'PHP e database, a ogni richiesta'})}
            </dd>
            <dt>
              <Translate id="home.result.errors">Errori</Translate>
            </dt>
            <dd>
              <Translate id="home.result.errorsValue" values={{n: <span className={styles.num}>0</span>}}>
                {'{n} in 3 run'}
              </Translate>
            </dd>
          </dl>
        </div>
        <p className={on ? styles.stamp : `${styles.stamp} ${styles.stampRef}`}>
          <b>
            {on
              ? translate({id: 'home.result.passed', message: 'Superato'})
              : translate({id: 'home.result.reference', message: 'Riferimento'})}
          </b>
          <span>
            {on
              ? translate({id: 'home.result.criterion', message: 'criterio: zero errori'})
              : translate({id: 'home.result.referenceNote', message: 'la stessa pagina senza cache'})}
          </span>
        </p>
      </div>
      <div className={styles.method}>
        <p aria-live="polite">
          {on
            ? translate({
                id: 'home.result.methodWith',
                message:
                  'Metodo: wrk, 500 connessioni per 3 run, si riporta la media. Release v0.1.0 su un VPS da 2 vCPU con Ubuntu 26.04.',
              })
            : translate({
                id: 'home.result.methodWithout',
                message:
                  'Metodo: wrk, 10 connessioni per 3 run, si riporta la media. Ogni richiesta passa da PHP e dal database. Stessa macchina, stessa pagina.',
              })}
        </p>
        <p>
          <a href={BENCH_METHOD_URL}>
            <Translate id="home.result.methodLink">Metodo e dati grezzi nella cartella bench/ del repository</Translate>
          </a>
        </p>
      </div>
    </section>
  );
}

function Hero(): ReactNode {
  return (
    <div className={styles.hero}>
      <div>
        <h1 className={styles.h1}>
          <Translate id="home.hero.title">Il pannello per un server Ubuntu che misura i suoi siti</Translate>
        </h1>
        <p className={styles.lede}>
          <Translate id="home.hero.lede">
            Un comando installa CloudGround. Ogni sito nasce in cache, dimensionato sulla macchina, isolato dagli altri e
            con i backup fuori dal server. Le misure sono pubblicate, con il metodo.
          </Translate>
        </p>
        <div className={styles.install}>
          <p className={styles.installLabel}>
            <Translate id="home.install.label">Su un server nuovo, come root:</Translate>
          </p>
          <Command />
          <p className={styles.req}>
            <Translate id="home.install.requirements">
              Ubuntu 24.04 o 26.04 LTS, amd64, almeno 1 GB di RAM, porte 80 e 443 libere.
            </Translate>
          </p>
        </div>
        <p className={styles.heroLinks}>
          <Link className={styles.linkArrow} to="/docs/tutorials/install">
            <Translate id="home.hero.guide">Guida all’installazione</Translate>
            <Icon name="arrow-right" size={18} />
          </Link>
          <Link to="/docs/server/verify-the-installer">
            <Translate id="home.hero.verify">Verifica l’installer prima di lanciarlo</Translate>
          </Link>
        </p>
      </div>
      <Result />
    </div>
  );
}

function SectionHead({id, title, intro}: {id: string; title: ReactNode; intro: ReactNode}): ReactNode {
  return (
    <div className={styles.secHead}>
      <h2 id={`${id}-title`}>{title}</h2>
      <p>{intro}</p>
    </div>
  );
}

/** Means of bench/phase-10-fresh.md. Change them only together with that file. */
const MEASURES = [
  {key: 'cachedMany', rps: 9710},
  {key: 'cachedOne', rps: 6347},
  {key: 'static', rps: 15478},
  {key: 'browsers', rps: 9641},
  {key: 'uncached', rps: 6.82},
] as const;

function Measures(): ReactNode {
  const id = useAnchor('misure');
  const number = useNumber();
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
  const caption = translate({id: 'home.measures.caption', message: 'Richieste al secondo per scenario'});
  return (
    <section id={id} className={styles.sec} aria-labelledby={`${id}-title`}>
      <SectionHead
        id={id}
        title={<Translate id="home.measures.title">Tutte le misure della release v0.1.0</Translate>}
        intro={
          <Translate id="home.measures.intro">
            Cinque scenari sulla stessa macchina. I numeri sono quelli del file di benchmark pubblicato: niente
            arrotondamenti a favore.
          </Translate>
        }
      />
      <div className={styles.tblWrap} role="region" aria-label={caption} tabIndex={0}>
        <table className={styles.tbl}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              <th scope="col">
                <Translate id="home.measures.scenario">Scenario</Translate>
              </th>
              <th scope="col" className={styles.cond}>
                <Translate id="home.measures.conditions">Condizioni</Translate>
              </th>
              <th scope="col" className={styles.r}>
                <Translate id="home.measures.rps">Richieste al secondo</Translate>
              </th>
              <th scope="col" className={styles.r}>
                <Translate id="home.measures.errors">Errori</Translate>
              </th>
            </tr>
          </thead>
          <tbody>
            {MEASURES.map((m) => (
              <tr key={m.key}>
                <th scope="row">
                  {labels[m.key][0]}
                  <small>{labels[m.key][1]}</small>
                </th>
                <td className={styles.cond}>{labels[m.key][1]}</td>
                <td className={`${styles.r} ${styles.num}`}>{number(m.rps)}</td>
                <td className={`${styles.r} ${styles.num}`}>0</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.tblNote}>
        <Translate
          id="home.measures.note"
          values={{
            data: (
              <a href={BENCH_URL}>
                <Translate id="home.measures.data">i dati</Translate>
              </a>
            ),
            method: (
              <a href={BENCH_METHOD_URL}>
                <Translate id="home.measures.method">il metodo</Translate>
              </a>
            ),
          }}>
          {
            'VPS da 2 vCPU, Ubuntu 26.04, pagina negozio WooCommerce, wrk sullo stesso server, 3 run per scenario, media; misura dell’11 ottobre 2026. Le misure valgono per quella macchina: sul tuo server si rifanno con lo stesso metodo. Pubblici {data} e {method}.'
          }
        </Translate>
      </p>
    </section>
  );
}

type Test = {name: string; when: string; method: string; outcome: string; icon: IconName};

function Annotation(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const it = i18n.currentLocale === 'it';
  // An illustration of the panel's Guard table, labelled as such on the page.
  const rows: {page: string; pairs: number; median: string; interval: string; ok: boolean}[] = [
    {page: '/', pairs: 60, median: '−0,6 ms', interval: '−1,9 … +0,7', ok: true},
    {page: it ? '/negozio/' : '/shop/', pairs: 60, median: '+0,4 ms', interval: '−0,8 … +1,5', ok: true},
    {page: it ? '/carrello/' : '/cart/', pairs: 60, median: '+38 ms', interval: '+31 … +45', ok: false},
  ];
  const dot = (s: string) => (it ? s : s.replace(/,/g, '.'));
  const ok = translate({id: 'home.guard.ok', message: 'OK'});
  const blocked = translate({id: 'home.guard.blocked', message: 'bloccato'});
  return (
    <figure
      className={styles.annot}
      aria-label={translate({
        id: 'home.guard.label',
        message: 'Esempio di rapporto del Guard nel pannello, con note',
      })}>
      <div className={styles.annotBox} />
      <figcaption className={styles.annotCap}>
        <b>
          <Translate id="home.guard.caption">Rapporto del Guard, nel pannello</Translate>
        </b>
        <span>
          <Translate id="home.guard.sample">Esempio, dati illustrativi</Translate>
        </span>
      </figcaption>
      <div className={`${styles.mRow} ${styles.mHead}`} style={{gridRow: 2}}>
        <span>
          <Translate id="home.guard.page">Pagina</Translate>
        </span>
        <span className={styles.r}>
          <Translate id="home.guard.pairs">Coppie</Translate>
        </span>
        <span>
          <Translate id="home.guard.median">Mediana</Translate>
          <span className={styles.mk}>1</span>
        </span>
        <span>
          <Translate id="home.guard.interval">Intervallo 95%</Translate>
        </span>
        <span>
          <Translate id="home.guard.verdict">Verdetto</Translate>
          <span className={styles.mk}>2</span>
        </span>
      </div>
      <p className={styles.note} style={{gridRow: 2}}>
        <span className={styles.mk}>1</span>
        <Translate
          id="home.guard.note1"
          values={{b: <b>{translate({id: 'home.guard.note1.b', message: 'Mediana'})}</b>}}>
          {'{b} della differenza di tempo server tra staging e produzione, con il suo intervallo al 95%.'}
        </Translate>
      </p>
      {rows.map((row, i) => (
        <div key={row.page} className={`${styles.mRow}${row.ok ? '' : ` ${styles.bad}`}`} style={{gridRow: 3 + i}}>
          <span className={styles.mono}>{row.page}</span>
          <span className={`${styles.num} ${styles.r}`}>{row.pairs}</span>
          <span className={styles.num}>{dot(row.median)}</span>
          <span className={styles.num}>{dot(row.interval)}</span>
          <span className={`${styles.badge} ${row.ok ? styles.badgeOk : styles.badgeErr}`}>{row.ok ? ok : blocked}</span>
        </div>
      ))}
      <p className={styles.note} style={{gridRow: 5}}>
        <span className={styles.mk}>2</span>
        <Translate
          id="home.guard.note2"
          values={{b: <b>{translate({id: 'home.guard.note2.b', message: 'Il verdetto'})}</b>}}>
          {'{b} per pagina. Una pagina più lenta con certezza ferma il rilascio: è l’unica riga che rompe la tabella.'}
        </Translate>
      </p>
      <p className={styles.mFoot} style={{gridRow: 6}}>
        <Icon name="x-circle" size={18} />
        <span>
          <Translate id="home.guard.stopped">
            Rilascio fermato: /carrello/ è più lenta della produzione. La produzione non è stata toccata.
          </Translate>
        </span>
      </p>
      <p className={`${styles.note} ${styles.noteTop}`} style={{gridRow: 6}}>
        <Translate
          id="home.guard.note3"
          values={{b: <b>{translate({id: 'home.guard.note3.b', message: 'La produzione resta com’è'})}</b>}}>
          {'{b}, e il rollback è un solo comando se serve tornare indietro dopo una pubblicazione.'}
        </Translate>
      </p>
    </figure>
  );
}

function Tests(): ReactNode {
  const id = useAnchor('prove');
  const tests: Test[] = [
    {
      name: 'Performance Guard',
      when: translate({id: 'home.tests.guard.when', message: 'Prima di ogni Safe Push dallo staging'}),
      method: translate({
        id: 'home.tests.guard.method',
        message:
          'Coppie di richieste alle stesse pagine di staging e produzione, tempo misurato sul server. Si calcolano la mediana della differenza e il suo intervallo al 95%.',
      }),
      outcome: translate({
        id: 'home.tests.guard.outcome',
        message:
          'Un rilascio più lento della produzione non viene pubblicato. Verdetti: OK, attenzione, bloccato, non concludente.',
      }),
      icon: 'shield-check',
    },
    {
      name: translate({id: 'home.tests.restore.name', message: 'Ripristino di prova'}),
      when: translate({id: 'home.tests.restore.when', message: 'Dopo ogni backup restic'}),
      method: translate({
        id: 'home.tests.restore.method',
        message:
          'Ogni snapshot, cifrato e deduplicato fuori dal server, viene ripristinato a parte e controllato. Il tempo di ripristino è misurato, non stimato.',
      }),
      outcome: translate({
        id: 'home.tests.restore.outcome',
        message:
          'Un backup conta solo dopo che il ripristino di prova è riuscito. L’ultimo verificato non viene mai rimosso.',
      }),
      icon: 'restore',
    },
    {
      name: translate({id: 'home.tests.isolation.name', message: 'Isolamento'}),
      when: translate({id: 'home.tests.isolation.when', message: 'Per ogni sito, alla creazione'}),
      method: translate({
        id: 'home.tests.isolation.method',
        message:
          'Un utente Unix, un master PHP-FPM, una sandbox systemd e un account del database per sito. SFTP chiuso nella cartella del sito.',
      }),
      outcome: translate({
        id: 'home.tests.isolation.outcome',
        message: 'Un sito compromesso non vede i file né il database degli altri.',
      }),
      icon: 'lock',
    },
    {
      name: translate({id: 'home.tests.drift.name', message: 'Deriva della configurazione'}),
      when: translate({id: 'home.tests.drift.when', message: 'Sui file che il pannello gestisce'}),
      method: translate({
        id: 'home.tests.drift.method',
        message: 'Il pannello confronta i file gestiti con quelli che ha scritto. Se qualcuno li cambia a mano, lo segnala.',
      }),
      outcome: translate({
        id: 'home.tests.drift.outcome',
        message: 'Non sovrascrive nulla da solo: scegli tu se ripristinare o mantenere la modifica.',
      }),
      icon: 'diff',
    },
  ];
  const methodWord = translate({id: 'home.tests.method', message: 'Metodo'});
  const outcomeWord = translate({id: 'home.tests.outcome', message: 'Esito'});
  return (
    <section id={id} className={styles.sec} aria-labelledby={`${id}-title`}>
      <SectionHead
        id={id}
        title={<Translate id="home.tests.title">Prove di sicurezza</Translate>}
        intro={
          <Translate id="home.tests.intro">
            Ogni garanzia del pannello ha un controllo che la verifica. Per ognuna: come si prova, e cosa succede quando
            la prova non passa.
          </Translate>
        }
      />
      <div className={styles.tests}>
        {tests.map((t) => (
          <div key={t.name} className={styles.test}>
            <div>
              <h3>{t.name}</h3>
              <p className={styles.when}>{t.when}</p>
            </div>
            <div>
              <p className={styles.testK}>{methodWord}</p>
              <p className={styles.testV}>{t.method}</p>
            </div>
            <div>
              <p className={styles.testK}>{outcomeWord}</p>
              <p className={styles.outcome}>
                <Icon name={t.icon} size={20} />
                <span>{t.outcome}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <Annotation />
    </section>
  );
}

function Limits(): ReactNode {
  const id = useAnchor('limiti');
  const items = [
    {
      title: translate({id: 'home.limits.release.title', message: 'Pre-release'}),
      text: translate(
        {
          id: 'home.limits.release.text',
          message: 'L’ultima release è la {version}. Le interfacce possono cambiare prima della 1.0.',
        },
        {version: RELEASE},
      ),
    },
    {
      title: translate({id: 'home.limits.audit.title', message: 'Nessun audit esterno'}),
      text: translate({
        id: 'home.limits.audit.text',
        message: 'Il codice ha avuto una revisione di sicurezza interna. Nessuna società esterna l’ha ancora controllato.',
      }),
    },
    {
      title: translate({id: 'home.limits.machine.title', message: 'Una macchina sola'}),
      text: translate({
        id: 'home.limits.machine.text',
        message: 'Le misure valgono per un VPS da 2 vCPU. Il metodo è pubblico: rifallo sul tuo server.',
      }),
    },
    {
      title: translate({id: 'home.limits.licence.title', message: 'Codice consultabile, non open source'}),
      text: translate({
        id: 'home.limits.licence.text',
        message:
          'Licenza Elastic License 2.0. Leggi ogni riga che gira come root sul tuo server; nessun account presso di noi, nessun canone per server.',
      }),
    },
  ];
  return (
    <section id={id} className={styles.sec} aria-labelledby={`${id}-title`}>
      <SectionHead
        id={id}
        title={<Translate id="home.limits.title">Limiti di questa prova</Translate>}
        intro={<Translate id="home.limits.intro">Un rapporto di prova dice anche cosa non copre.</Translate>}
      />
      <div className={styles.limits}>
        {items.map((item) => (
          <div key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Procedure(): ReactNode {
  const id = useAnchor('installa');
  return (
    <section id={id} className={styles.sec} aria-labelledby={`${id}-title`}>
      <SectionHead
        id={id}
        title={<Translate id="home.procedure.title">Procedura di installazione</Translate>}
        intro={
          <Translate id="home.procedure.intro">
            Tre passi, nell’ordine. L’installer controlla il server prima di toccare qualcosa.
          </Translate>
        }
      />
      <ol className={styles.steps}>
        <li>
          <h3>
            <Translate id="home.procedure.1.title">Prepara un server nuovo</Translate>
          </h3>
          <div>
            <p>
              <Translate id="home.procedure.1.text">
                Ubuntu 24.04 o 26.04 LTS appena creato, amd64, almeno 1 GB di RAM e 10 GB di disco liberi, accesso root
                via SSH. L’installer prende in mano nginx, PHP, MariaDB e SSH: usa un server dedicato.
              </Translate>
            </p>
          </div>
        </li>
        <li>
          <h3>
            <Translate id="home.procedure.2.title">Lancia il comando</Translate>
          </h3>
          <div>
            <Command />
            <p>
              <Translate id="home.procedure.2.text">
                Se trova problemi (sistema, memoria, disco, porte occupate) li elenca tutti insieme e si ferma senza
                toccare nulla. Lo script verifica lo SHA-256 della release e il manifesto firmato.
              </Translate>
            </p>
          </div>
        </li>
        <li>
          <h3>
            <Translate id="home.procedure.3.title">Apri il link di setup</Translate>
          </h3>
          <div>
            <p>
              <Translate
                id="home.procedure.3.text"
                values={{url: <code className={styles.mono}>{'https://<ip>:8443/setup/…'}</code>}}>
                {'Alla fine stampa un indirizzo {url} valido 24 ore, che funziona una volta. Crei l’amministratore, poi il primo sito.'}
              </Translate>
            </p>
            <p>
              <Link className={styles.linkArrow} to="/docs/tutorials/install">
                <Translate id="home.procedure.guide">La guida completa all’installazione</Translate>
                <Icon name="arrow-right" size={18} />
              </Link>
            </p>
          </div>
        </li>
      </ol>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <main id="top" className={styles.home}>
      <Protocol />
      <div className={styles.wrap}>
        <Hero />
        <Measures />
        <Tests />
        <Limits />
        <Procedure />
      </div>
    </main>
  );
}
