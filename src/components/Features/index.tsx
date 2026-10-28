import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Icon from '@site/src/components/Icon';
import useAnchor from '@site/src/components/Home/useAnchor';
import {BENCH_URL, DEMO_URL, RELEASE} from '@site/src/data/site';
import {MEASURES, formatRps, type MeasureKey} from '@site/src/data/bench';
import home from '@site/src/components/Home/Home.module.css';
import styles from './Features.module.css';

/**
 * The features page: everything CloudGround does, grouped by what a person
 * running a server cares about. Each group is a ruled section with a big
 * heading, a small specimen drawn from facts (the measured figures, the site
 * types, the Safe Push sequence…) and the list of its features, each one or
 * two sentences long and linked to its guide.
 *
 * Rule: every sentence here restates the product's CHANGELOG.md (v0.1.0 to
 * the release in src/data/site.ts). A feature that is not in it is not
 * written. `since` is the release that introduced it, left out for v0.1.0.
 *
 * Everything is rendered at build time; the only script is the observer that
 * marks the current group in the sticky index.
 */

type Feature = {id: string; title: string; text: string; to: string; since?: string};
type Group = {
  id: string;
  name: string;
  blurb: string;
  titleA: string;
  titleB: string;
  intro: string;
  items: Feature[];
  specimen: ReactNode;
  dark?: boolean;
};

function Accent({children}: {children: ReactNode}): ReactNode {
  return <span className={home.acc}>{children}</span>;
}

/* ---------- Specimens: one small exhibit per group, facts only ---------- */

function SpeedSpecimen(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const labels: Record<MeasureKey, string> = {
    cachedMany: translate({id: 'features.bench.cachedMany', message: 'Pagina in cache, 500 connessioni'}),
    cachedOne: translate({id: 'features.bench.cachedOne', message: 'Pagina in cache, 1 connessione'}),
    static: translate({id: 'features.bench.static', message: 'File statico da 1 KB'}),
    browsers: translate({id: 'features.bench.browsers', message: 'Traffico da browser'}),
    uncached: translate({id: 'features.bench.uncached', message: 'Senza cache: PHP e database'}),
  };
  const caption = translate({id: 'features.bench.caption', message: 'Richieste al secondo, media di tre giri'});
  return (
    <figure className={styles.specimen}>
      <figcaption className={styles.specCap}>{caption}</figcaption>
      <dl className={styles.bench}>
        {MEASURES.map((m) => (
          <div key={m.key} className={m.reference ? styles.benchRef : undefined}>
            <dt>{labels[m.key]}</dt>
            <dd>
              {formatRps(m.rps, i18n.currentLocale)}
              <small>req/s</small>
            </dd>
          </div>
        ))}
      </dl>
      <p className={styles.specNote}>
        <Translate id="features.bench.note">VPS 2 vCPU, Ubuntu 26.04, negozio WooCommerce, release v0.1.0.</Translate>{' '}
        <a href={BENCH_URL}>
          <Translate id="features.bench.data">I dati e il metodo</Translate>
        </a>
      </p>
    </figure>
  );
}

function SitesSpecimen(): ReactNode {
  const types = [
    'WordPress',
    'WooCommerce',
    'PHP',
    'Laravel',
    translate({id: 'features.types.static', message: 'Statico'}),
    'Reverse proxy',
    'Node.js',
    'Python',
  ];
  return (
    <figure className={styles.specimen}>
      <figcaption className={styles.specCap}>
        <Translate id="features.types.caption">Tipi di sito</Translate>
      </figcaption>
      <ul className={styles.types}>
        {types.map((t, i) => (
          <li key={t} className={i % 2 ? styles.typeAlt : undefined}>
            {t}
          </li>
        ))}
      </ul>
    </figure>
  );
}

function DeploysSpecimen(): ReactNode {
  const steps = [
    ['Staging', translate({id: 'features.flow.staging', message: 'la copia su cui provi le modifiche'})],
    ['Performance Guard', translate({id: 'features.flow.guard', message: 'misura staging e produzione'})],
    [
      translate({id: 'features.flow.snapshotName', message: 'Snapshot'}),
      translate({id: 'features.flow.snapshot', message: 'di produzione, verificato prima di toccarla'}),
    ],
    [
      translate({id: 'features.flow.liveName', message: 'Produzione'}),
      translate({id: 'features.flow.live', message: 'il nuovo rilascio diventa attivo'}),
    ],
  ];
  return (
    <figure className={styles.specimen}>
      <figcaption className={styles.specCap}>
        <Translate id="features.flow.caption">Un Safe Push, nell’ordine</Translate>
      </figcaption>
      <ol className={styles.flow}>
        {steps.map(([name, text]) => (
          <li key={name}>
            <strong>{name}</strong>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function DataSpecimen(): ReactNode {
  return (
    <figure className={styles.specimen}>
      <figcaption className={styles.specCap}>
        <Translate id="features.record.caption">Ogni backup</Translate>
      </figcaption>
      <dl className={styles.record}>
        <div>
          <dt>
            <Translate id="features.record.copy">Copia</Translate>
          </dt>
          <dd>
            <Translate id="features.record.copyText">cifrata, dove scegli tu</Translate>
          </dd>
        </div>
        <div>
          <dt>
            <Translate id="features.record.test">Ripristino di prova</Translate>
          </dt>
          <dd>
            <span className={home.stamp}>
              <Translate id="home.measures.passed">Superato</Translate>
            </span>
          </dd>
        </div>
        <div>
          <dt>
            <Translate id="features.record.restore">Ripristino</Translate>
          </dt>
          <dd>
            <Translate id="features.record.restoreText">un file, un database o tutto il sito</Translate>
          </dd>
        </div>
      </dl>
    </figure>
  );
}

function SecuritySpecimen(): ReactNode {
  const parts = [
    translate({id: 'features.iso.user', message: 'Utente Unix'}),
    'PHP-FPM',
    translate({id: 'features.iso.sandbox', message: 'Sandbox systemd'}),
    translate({id: 'features.iso.shm', message: '/dev/shm e IPC'}),
    translate({id: 'features.iso.db', message: 'Database e utente del database'}),
  ];
  return (
    <figure className={styles.specimen}>
      <figcaption className={styles.specCap}>
        <Translate id="features.iso.caption">Per ogni sito, separati</Translate>
      </figcaption>
      <ul className={styles.checks}>
        {parts.map((p) => (
          <li key={p}>
            <Icon name="check" size={18} />
            {p}
          </li>
        ))}
      </ul>
    </figure>
  );
}

function VisibilitySpecimen(): ReactNode {
  const rows = [
    [translate({id: 'features.facts.cookies', message: 'Cookie per le statistiche'}), '0'],
    [translate({id: 'features.facts.addresses', message: 'Indirizzi salvati'}), '0'],
    [
      translate({id: 'features.facts.history', message: 'Storico del traffico'}),
      translate({id: 'features.facts.days', message: '90 giorni'}),
    ],
    [
      translate({id: 'features.facts.uptime', message: 'Controllo uptime'}),
      translate({id: 'features.facts.minute', message: '1 al minuto'}),
    ],
  ];
  return (
    <figure className={styles.specimen}>
      <figcaption className={styles.specCap}>
        <Translate id="features.facts.caption">Sul tuo server, non altrove</Translate>
      </figcaption>
      <dl className={styles.facts}>
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

function AccessSpecimen(): ReactNode {
  const lines = ['cgctl status', 'cgctl sites list', 'cgctl backup run <site-id>', 'cgctl backup verify <backup-id>'];
  return (
    <figure className={styles.specimen}>
      <figcaption className={styles.specCap}>
        <Translate id="features.cli.caption">Dal terminale, gli stessi gesti</Translate>
      </figcaption>
      <pre className={styles.term} tabIndex={0}>
        <code>
          {lines.map((l) => (
            <span key={l}>
              <span className={styles.prompt} aria-hidden="true">
                ${' '}
              </span>
              {l}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}

/* ---------- The content ---------- */

function useGroups(): Group[] {
  return [
    {
      id: 'speed',
      name: translate({id: 'features.speed.name', message: 'Velocità'}),
      blurb: translate({id: 'features.speed.blurb', message: 'Cache, regolazione, misure'}),
      titleA: translate({id: 'features.speed.titleA', message: 'Veloce'}),
      titleB: translate({id: 'features.speed.titleB', message: 'di serie.'}),
      intro: translate({
        id: 'features.speed.intro',
        message:
          'Ogni sito ha la sua cache di pagina, su un server regolato sulla macchina. I numeri sono misurati su un VPS da 2 vCPU.',
      }),
      specimen: <SpeedSpecimen />,
      items: [
        {
          id: 'cache',
          title: translate({id: 'features.speed.cache.title', message: 'Cache di pagina'}),
          text: translate({
            id: 'features.speed.cache.text',
            message:
              'nginx serve le pagine dalla cache senza svegliare PHP, le comprime una volta e continua a servirle mentre si rinnovano.',
          }),
          to: '/docs/reference/cache-behaviour',
        },
        {
          id: 'purge',
          title: translate({id: 'features.speed.purge.title', message: 'Svuotamenti mirati'}),
          text: translate({
            id: 'features.speed.purge.text',
            message:
              'Cambi un articolo o un prezzo e il connettore WordPress svuota solo le pagine che lo mostrano. Un URL o tutto il sito, quando serve.',
          }),
          to: '/docs/data/purge-the-cache',
        },
        {
          id: 'tuning',
          title: translate({id: 'features.speed.tuning.title', message: 'Regolato sulla macchina'}),
          text: translate({
            id: 'features.speed.tuning.text',
            message:
              'PHP, OPcache e MariaDB vengono dimensionati sulla memoria e sui processori del server, con il JIT di PHP acceso.',
          }),
          to: '/docs/explanation/installation#server-choices',
        },
        {
          id: 'devmode',
          title: translate({id: 'features.speed.devmode.title', message: 'Modalità sviluppo'}),
          text: translate({
            id: 'features.speed.devmode.text',
            message: 'Mentre lavori, la cache di pagina si fa da parte per 15, 30 o 60 minuti, poi torna da sola.',
          }),
          to: '/docs/sites/development-mode',
          since: 'v0.4.0',
        },
        {
          id: 'resources',
          title: translate({id: 'features.speed.resources.title', message: 'Risorse per sito'}),
          text: translate({
            id: 'features.speed.resources.text',
            message:
              'CPU, memoria, processi e disco di ogni sito, con lo storico di 24 ore e 30 giorni e limiti che valgono senza riavvio.',
          }),
          to: '/docs/sites/resource-usage-and-limits',
          since: 'v0.2.0',
        },
      ],
    },
    {
      id: 'sites',
      name: translate({id: 'features.sites.name', message: 'Siti e app'}),
      blurb: translate({id: 'features.sites.blurb', message: 'WordPress, PHP, Node.js, Python, funzioni'}),
      titleA: translate({id: 'features.sites.titleA', message: 'Più di'}),
      titleB: 'WordPress.',
      intro: translate({
        id: 'features.sites.intro',
        message:
          'Oltre a WordPress girano PHP, Laravel, siti statici, proxy e app Node.js e Python. Ognuno con il suo utente e la sua sandbox.',
      }),
      specimen: <SitesSpecimen />,
      items: [
        {
          id: 'types',
          title: translate({id: 'features.sites.types.title', message: 'Sei tipi di sito'}),
          text: translate({
            id: 'features.sites.types.text',
            message:
              'WordPress, WooCommerce, PHP, Laravel, statico e reverse proxy, ognuno con il suo utente Unix, il suo PHP-FPM e la sua sandbox systemd.',
          }),
          to: '/docs/reference/site-types',
        },
        {
          id: 'wizard',
          title: translate({id: 'features.sites.wizard.title', message: 'Un sito in cinque passi'}),
          text: translate({
            id: 'features.sites.wizard.text',
            message:
              'Una procedura guidata crea il sito, controlla che il DNS del dominio punti al server e ti lascia un riepilogo da conservare.',
          }),
          to: '/docs/sites/create-a-site',
          since: 'v0.3.1',
        },
        {
          id: 'apps',
          title: translate({id: 'features.sites.apps.title', message: 'App Node.js e Python'}),
          text: translate({
            id: 'features.sites.apps.text',
            message:
              'Node.js 20, 22 o 24, verificato con i checksum pubblicati, o il Python del server in un ambiente virtuale per sito. L’app gira come servizio dell’utente del sito, dietro nginx.',
          }),
          to: '/docs/sites/node-and-python-sites',
          since: 'v0.8.0',
        },
        {
          id: 'functions',
          title: translate({id: 'features.sites.functions.title', message: 'Funzioni indipendenti'}),
          text: translate({
            id: 'features.sites.functions.text',
            message:
              'Codice Node.js o Python in più file, con le sue dipendenze, che non è di nessun sito. Un indirizzo comune o uno suo, token e CORS a scelta, un utente di sistema per funzione. Gira solo quando lo chiami o a orario.',
          }),
          to: '/docs/functions',
          since: 'v0.9.0',
        },
        {
          id: 'wpupdates',
          title: translate({id: 'features.sites.wpupdates.title', message: 'Aggiornamenti WordPress'}),
          text: translate({
            id: 'features.sites.wpupdates.text',
            message:
              'Dai pulsanti o a calendario, dietro uno snapshot già provato. Il sito viene misurato prima e dopo, e ripristinato da solo se l’aggiornamento lo rompe.',
          }),
          to: '/docs/sites/update-wordpress',
          since: 'v0.4.0',
        },
        {
          id: 'domains',
          title: translate({id: 'features.sites.domains.title', message: 'Domini e certificati'}),
          text: translate({
            id: 'features.sites.domains.text',
            message: 'Alias e certificati Let’s Encrypt, anche wildcard, oppure i tuoi.',
          }),
          to: '/docs/sites/domains-and-certificates',
        },
        {
          id: 'redirects',
          title: translate({id: 'features.sites.redirects.title', message: 'Reindirizzamenti'}),
          text: translate({
            id: 'features.sites.redirects.text',
            message:
              'Un nome canonico, con o senza www, e fino a 200 redirect 301 o 302, esatti o per prefisso. Vengono serviti prima della cache.',
          }),
          to: '/docs/sites/redirects',
          since: 'v0.7.0',
        },
        {
          id: 'mail',
          title: translate({id: 'features.sites.mail.title', message: 'Posta dai siti'}),
          text: translate({
            id: 'features.sites.mail.text',
            message:
              'mail() e wp_mail escono da un relay SMTP, per tutto il server o per sito, con un invio di prova e la lista di controllo SPF, DKIM e DMARC.',
          }),
          to: '/docs/sites/send-mail-from-a-site',
          since: 'v0.4.0',
        },
        {
          id: 'maintenance',
          title: translate({id: 'features.sites.maintenance.title', message: 'Pagina di manutenzione'}),
          text: translate({
            id: 'features.sites.maintenance.text',
            message:
              'I visitatori ricevono un 503 con il tuo titolo e il tuo messaggio; gli indirizzi in elenco e un link di anteprima vedono ancora il sito.',
          }),
          to: '/docs/sites/maintenance-page',
          since: 'v0.4.0',
        },
      ],
    },
    {
      id: 'deploys',
      name: translate({id: 'features.deploys.name', message: 'Rilasci'}),
      blurb: translate({id: 'features.deploys.blurb', message: 'Staging, Safe Push, Git, rollback'}),
      titleA: translate({id: 'features.deploys.titleA', message: 'Prova prima,'}),
      titleB: translate({id: 'features.deploys.titleB', message: 'pubblica poi.'}),
      intro: translate({
        id: 'features.deploys.intro',
        message:
          'Il codice vive in rilasci. Uno nuovo va in produzione solo quando è pronto, e quello di prima resta a un passo.',
      }),
      specimen: <DeploysSpecimen />,
      items: [
        {
          id: 'releases',
          title: translate({id: 'features.deploys.releases.title', message: 'Rilasci'}),
          text: translate({
            id: 'features.deploys.releases.text',
            message:
              'Ogni pubblicazione crea un rilascio a sé e lo rende attivo. Le app installano le dipendenze per rilascio, e se l’installazione fallisce resta attivo quello di prima.',
          }),
          to: '/docs/data/deploy-a-release',
        },
        {
          id: 'staging',
          title: 'Staging',
          text: translate({
            id: 'features.deploys.staging.text',
            message: 'Una copia del sito su cui provare le modifiche. Da lì non parte nessuna email.',
          }),
          to: '/docs/data/staging-and-safe-push',
        },
        {
          id: 'safepush',
          title: 'Safe Push',
          text: translate({
            id: 'features.deploys.safepush.text',
            message:
              'Porta le modifiche in produzione solo se le misure di Performance Guard reggono, dopo uno snapshot di sicurezza di produzione.',
          }),
          to: '/docs/data/staging-and-safe-push',
        },
        {
          id: 'git',
          title: translate({id: 'features.deploys.git.title', message: 'Deploy da Git'}),
          text: translate({
            id: 'features.deploys.git.text',
            message:
              'Un webhook per sito, per GitHub, GitLab, Gitea e Forgejo, costruisce un rilascio da un ramo a ogni push. Per i repository privati il pannello crea una deploy key.',
          }),
          to: '/docs/data/deploy-from-git',
          since: 'v0.5.0',
        },
        {
          id: 'rollback',
          title: 'Rollback',
          text: translate({
            id: 'features.deploys.rollback.text',
            message:
              'Torni a un rilascio precedente. Per le app Node.js e Python torna anche esattamente quello che quel rilascio aveva installato.',
          }),
          to: '/docs/data/roll-back-a-release',
        },
      ],
    },
    {
      id: 'data',
      name: translate({id: 'features.data.name', message: 'Dati'}),
      blurb: translate({id: 'features.data.blurb', message: 'Backup, ripristini, database, migrazioni'}),
      titleA: translate({id: 'features.data.titleA', message: 'Backup che'}),
      titleB: translate({id: 'features.data.titleB', message: 'si ripristinano.'}),
      intro: translate({
        id: 'features.data.intro',
        message:
          'Ogni backup viene ripristinato per prova. Puoi riprendere solo la parte che ti serve.',
      }),
      specimen: <DataSpecimen />,
      items: [
        {
          id: 'backups',
          title: translate({id: 'features.data.backups.title', message: 'Backup verificati'}),
          text: translate({
            id: 'features.data.backups.text',
            message:
              'Copie cifrate con restic, all’ora che scegli, poi ripristinate per prova.',
          }),
          to: '/docs/data/back-up-a-site',
        },
        {
          id: 'destinations',
          title: translate({id: 'features.data.destinations.title', message: 'Dove vanno'}),
          text: translate({
            id: 'features.data.destinations.text',
            message:
              'Uno storage compatibile S3, Backblaze B2, SFTP o una cartella del server. Per SFTP la chiave la crea il pannello.',
          }),
          to: '/docs/data/connect-a-backup-repository',
          since: 'v0.6.0',
        },
        {
          id: 'restore',
          title: translate({id: 'features.data.restore.title', message: 'Ripristino selettivo'}),
          text: translate({
            id: 'features.data.restore.text',
            message:
              'Tutto il sito, solo i file, alcuni database o un singolo file o cartella, sempre dietro uno snapshot di sicurezza provato.',
          }),
          to: '/docs/data/restore-a-backup',
          since: 'v0.6.0',
        },
        {
          id: 'download',
          title: translate({id: 'features.data.download.title', message: 'Scarica un backup'}),
          text: translate({
            id: 'features.data.download.text',
            message:
              'Un archivio in streaming, per gli amministratori e per gli operatori sui loro siti. Ogni download resta nel registro di audit.',
          }),
          to: '/docs/data/restore-a-backup#download',
          since: 'v0.6.0',
        },
        {
          id: 'external',
          title: translate({id: 'features.data.external.title', message: 'Database esterni'}),
          text: translate({
            id: 'features.data.external.text',
            message:
              'Registra un server MariaDB/MySQL o PostgreSQL e crea lì i database di un sito. Backup, ripristini ed esportazioni li seguono.',
          }),
          to: '/docs/data/external-database-servers',
          since: 'v0.6.0',
        },
        {
          id: 'quarry',
          title: 'Quarry',
          text: translate({
            id: 'features.data.quarry.text',
            message:
              'Lo strumento per i database su /quarry: sfoglia, modifica, cerca, importa ed esporta. Simulate esegue una scrittura in una transazione che viene sempre annullata.',
          }),
          to: '/docs/data/use-quarry',
        },
        {
          id: 'move',
          title: translate({id: 'features.data.move.title', message: 'Sposta un sito da un altro server'}),
          text: translate({
            id: 'features.data.move.text',
            message:
              'Dai l’accesso SSH o SFTP del vecchio server e guarda prima una prova a secco. Poi CloudGround copia file e database dietro uno snapshot, e la password non resta da nessuna parte.',
          }),
          to: '/docs/sites/move-a-site-from-another-host',
          since: 'v0.6.0',
        },
        {
          id: 'cleanup',
          title: translate({id: 'features.data.cleanup.title', message: 'Pulizia del database WordPress'}),
          text: translate({
            id: 'features.data.cleanup.text',
            message:
              'Una volta a settimana, se la accendi: via i transient scaduti, e ogni articolo tiene le sue ultime N revisioni.',
          }),
          to: '/docs/sites/clean-the-wordpress-database',
          since: 'v0.4.0',
        },
      ],
    },
    {
      id: 'security',
      dark: true,
      name: translate({id: 'features.security.name', message: 'Sicurezza'}),
      blurb: translate({id: 'features.security.blurb', message: 'Isolamento, firewall, scansioni, accessi'}),
      titleA: translate({id: 'features.security.titleA', message: 'Ogni sito'}),
      titleB: translate({id: 'features.security.titleB', message: 'per conto suo.'}),
      intro: translate({
        id: 'features.security.intro',
        message:
          'Un sito compromesso non vede gli altri, chi tira a indovinare le password finisce bloccato e le falle note vengono segnalate.',
      }),
      specimen: <SecuritySpecimen />,
      items: [
        {
          id: 'isolation',
          title: translate({id: 'features.security.isolation.title', message: 'Isolamento per sito'}),
          text: translate({
            id: 'features.security.isolation.text',
            message:
              'Utente di sistema, PHP-FPM e sandbox systemd propri, con /dev/shm e IPC separati. Un sito compromesso non vede i vicini.',
          }),
          to: '/docs/explanation/site-isolation',
        },
        {
          id: 'firewall',
          title: 'Firewall',
          text: translate({
            id: 'features.security.firewall.text',
            message:
              'Il pannello ti mostra le regole prima di accenderlo e lascia aperte la vera porta SSH, le porte web e la sua.',
          }),
          to: '/docs/access/firewall',
          since: 'v0.2.0',
        },
        {
          id: 'blocklist',
          title: translate({id: 'features.security.blocklist.title', message: 'Lista di blocco'}),
          text: translate({
            id: 'features.security.blocklist.text',
            message:
              'Chi continua a sbagliare l’accesso al pannello, a SSH, a wp-login o a xmlrpc viene bloccato al firewall per un po’. Gli indirizzi ammessi restano fuori.',
          }),
          to: '/docs/access/block-addresses',
          since: 'v0.3.0',
        },
        {
          id: 'refuse',
          title: translate({id: 'features.security.refuse.title', message: 'Blocchi per sito'}),
          text: translate({
            id: 'features.security.refuse.text',
            message: 'Rifiuta i visitatori di un sito per indirizzo o rete, user agent o paese.',
          }),
          to: '/docs/access/refuse-visitors',
          since: 'v0.3.0',
        },
        {
          id: 'hardening',
          title: translate({id: 'features.security.hardening.title', message: 'WordPress più solido'}),
          text: translate({
            id: 'features.security.hardening.text',
            message:
              'Rafforzamenti in un clic, ognuno a sé e reversibile, e l’accesso a due fattori per gli account WordPress.',
          }),
          to: '/docs/access/harden-wordpress',
          since: 'v0.3.0',
        },
        {
          id: 'vulns',
          title: translate({id: 'features.security.vulns.title', message: 'Vulnerabilità note'}),
          text: translate({
            id: 'features.security.vulns.text',
            message:
              'Core, plugin e temi WordPress confrontati con un database pubblico: vedi le versioni con falle note e quella che le corregge.',
          }),
          to: '/docs/access/wordpress-vulnerabilities',
          since: 'v0.3.0',
        },
        {
          id: 'malware',
          title: translate({id: 'features.security.malware.title', message: 'Scansione malware'}),
          text: translate({
            id: 'features.security.malware.text',
            message:
              'Se la accendi, ClamAV controlla i file di un sito a orario o quando vuoi, mette in quarantena quelli segnalati e manda un avviso.',
          }),
          to: '/docs/access/malware-scan',
          since: 'v0.3.0',
        },
        {
          id: 'passkeys',
          title: translate({id: 'features.security.passkeys.title', message: 'Passkey e codici di recupero'}),
          text: translate({
            id: 'features.security.passkeys.text',
            message:
              'Entri con impronta, volto o PIN. Dieci codici monouso per quando perdi il telefono, e la verifica in due passaggi obbligatoria se lo decidi.',
          }),
          to: '/docs/access/passkeys',
          since: 'v0.5.0',
        },
        {
          id: 'roles',
          title: translate({id: 'features.security.roles.title', message: 'Ruoli'}),
          text: translate({
            id: 'features.security.roles.text',
            message: 'Amministratore, operatore sui siti che gli assegni, sola lettura.',
          }),
          to: '/docs/access/users-and-roles',
        },
        {
          id: 'audit',
          title: translate({id: 'features.security.audit.title', message: 'Registro di audit'}),
          text: translate({
            id: 'features.security.audit.text',
            message: 'Le modifiche finiscono nel registro di audit, compreso ogni download di log e di backup.',
          }),
          to: '/docs/reference/roles-and-permissions',
        },
        {
          id: 'protect',
          title: translate({id: 'features.security.protect.title', message: 'Percorsi con password'}),
          text: translate({
            id: 'features.security.protect.text',
            message: 'Metti nome utente e password davanti a qualsiasi percorso di un sito.',
          }),
          to: '/docs/access/protected-paths',
          since: 'v0.2.0',
        },
        {
          id: 'ubuntu',
          title: translate({id: 'features.security.ubuntu.title', message: 'Aggiornamenti di Ubuntu'}),
          text: translate({
            id: 'features.security.ubuntu.text',
            message:
              'I pacchetti in sospeso, quelli di sicurezza per primi, installati tutti o solo quelli di sicurezza. E un avviso quando serve un riavvio.',
          }),
          to: '/docs/server/ubuntu-updates',
          since: 'v0.4.0',
        },
      ],
    },
    {
      id: 'visibility',
      name: translate({id: 'features.visibility.name', message: 'Visibilità'}),
      blurb: translate({id: 'features.visibility.blurb', message: 'Traffico, log, uptime, avvisi'}),
      titleA: translate({id: 'features.visibility.titleA', message: 'Sai cosa'}),
      titleB: translate({id: 'features.visibility.titleB', message: 'succede.'}),
      intro: translate({
        id: 'features.visibility.intro',
        message:
          'Traffico, log e stato dei siti restano sul tuo server. Se qualcosa si rompe, il pannello ti avvisa.',
      }),
      specimen: <VisibilitySpecimen />,
      items: [
        {
          id: 'traffic',
          title: translate({id: 'features.visibility.traffic.title', message: 'Statistiche di traffico'}),
          text: translate({
            id: 'features.visibility.traffic.text',
            message:
              'Richieste, visite, visitatori, bot, codici di stato e cache hit, letti dai log del sito sul server. Niente cookie e nessun indirizzo salvato.',
          }),
          to: '/docs/sites/traffic-statistics',
          since: 'v0.7.0',
        },
        {
          id: 'logs',
          title: translate({id: 'features.visibility.logs.title', message: 'Log e download'}),
          text: translate({
            id: 'features.visibility.logs.text',
            message:
              'I log del server e dei siti nel pannello. Scarica quelli completi di un sito, ruotati compresi, dal pannello o con cgctl logs.',
          }),
          to: '/docs/server/logs',
          since: 'v0.7.0',
        },
        {
          id: 'uptime',
          title: 'Uptime',
          text: translate({
            id: 'features.visibility.uptime.text',
            message: 'Se lo accendi, il server controlla il sito ogni minuto e ti avvisa dopo due errori di fila.',
          }),
          to: '/docs/sites/uptime-monitoring',
          since: 'v0.2.0',
        },
        {
          id: 'alerts',
          title: translate({id: 'features.visibility.alerts.title', message: 'Avvisi per email e webhook'}),
          text: translate({
            id: 'features.visibility.alerts.text',
            message:
              'Siti oltre la soglia, siti che non rispondono, file sospetti: l’avviso arriva per email o a un webhook, con le operazioni descritte a parole.',
          }),
          to: '/docs/server/alerts-and-notifications',
        },
        {
          id: 'cloudflare',
          title: translate({id: 'features.visibility.cloudflare.title', message: 'Dietro Cloudflare'}),
          text: translate({
            id: 'features.visibility.cloudflare.text',
            message:
              'Il pannello vede l’indirizzo vero del visitatore, la lista di blocco vale ancora e svuotare la cache svuota anche quella di Cloudflare.',
          }),
          to: '/docs/sites/behind-cloudflare',
          since: 'v0.7.0',
        },
      ],
    },
    {
      id: 'access',
      name: translate({id: 'features.access.name', message: 'Accesso e automazione'}),
      blurb: translate({id: 'features.access.blurb', message: 'cgctl, API, assistenti AI'}),
      titleA: translate({id: 'features.access.titleA', message: 'Anche'}),
      titleB: translate({id: 'features.access.titleB', message: 'senza browser.'}),
      intro: translate({
        id: 'features.access.intro',
        message:
          'Tutto quello che fai nel pannello lo fai anche da terminale o via API. Un assistente AI può farlo solo dopo che lo hai acceso tu.',
      }),
      specimen: <AccessSpecimen />,
      items: [
        {
          id: 'cgctl',
          title: 'cgctl',
          text: translate({
            id: 'features.access.cgctl.text',
            message:
              'La riga di comando del pannello: siti, backup, rilasci, log, blocchi e altro, sul server o da un altro computer.',
          }),
          to: '/docs/cli',
        },
        {
          id: 'tokens',
          title: translate({id: 'features.access.tokens.title', message: 'Token API'}),
          text: translate({
            id: 'features.access.tokens.text',
            message: 'Un token per ogni script. Revocalo quando non serve più.',
          }),
          to: '/docs/access/api-tokens-and-cgctl',
        },
        {
          id: 'api',
          title: translate({id: 'features.access.api.title', message: 'API HTTP'}),
          text: translate({
            id: 'features.access.api.text',
            message: 'L’API HTTP con cui parla cgctl, documentata per chi scrive i propri strumenti.',
          }),
          to: '/docs/api',
        },
        {
          id: 'mcp',
          title: translate({id: 'features.access.mcp.title', message: 'Server MCP per assistenti AI'}),
          text: translate({
            id: 'features.access.mcp.text',
            message:
              'Spento finché non lo accendi. Poi Claude, ChatGPT e altri client MCP gestiscono il server con OAuth: ogni connessione si approva con password e secondo fattore, e le azioni distruttive aspettano una conferma nel pannello.',
          }),
          to: '/docs/access/ai-assistants',
          since: 'v0.5.0',
        },
        {
          id: 'sftp',
          title: translate({id: 'features.access.sftp.title', message: 'SFTP e shell del sito'}),
          text: translate({
            id: 'features.access.sftp.text',
            message: 'Account SFTP per sito, anche solo con chiavi SSH, e una shell che lavora come l’utente del sito.',
          }),
          to: '/docs/access/sftp-and-ssh-keys',
        },
        {
          id: 'update',
          title: translate({id: 'features.access.update.title', message: 'Aggiornamenti di CloudGround'}),
          text: translate({
            id: 'features.access.update.text',
            message:
              'Release firmate, dal pannello o con cgctl update. Se la nuova versione non parte, il pannello torna da solo a quella di prima.',
          }),
          to: '/docs/server/update-cloudground',
        },
      ],
    },
  ];
}

/* ---------- Layout ---------- */

function Hero({groups}: {groups: Group[]}): ReactNode {
  return (
    <header className={clsx(home.frame, styles.hero)}>
      <div className={styles.heroText}>
        <h1 className={styles.h1}>
          <Translate id="features.hero.title1">Tutto quello</Translate>
          <br />
          <Translate id="features.hero.title2">che</Translate>{' '}
          <Accent>
            <Translate id="features.hero.titleAccent">fa.</Translate>
          </Accent>
        </h1>
        <p className={styles.lede}>
          <Translate id="features.hero.lede">
            Un pannello per un server Ubuntu, in sette aree. Ogni funzione ha due righe e il link alla sua guida.
          </Translate>
        </p>
        <div className={home.actions}>
          <a href={DEMO_URL} className={clsx(home.btn, home.btnPrimary)}>
            <Translate id="features.hero.demo">Prova la demo</Translate>
            <Icon name="arrow-right" size={18} />
          </a>
          <Link to="/#installa" className={home.btn}>
            <Translate id="features.hero.install">Installa</Translate>
          </Link>
        </div>
        <p className={styles.heroNote}>
          <Translate id="features.hero.demoNote">
            La demo gira nel tuo browser su dati di esempio. Niente lascia la pagina.
          </Translate>
        </p>
        <ul className={home.facts}>
          <li>
            <Translate id="features.hero.release" values={{release: RELEASE}}>
              {'Aggiornata alla release {release}'}
            </Translate>
          </li>
          <li>
            <Translate id="features.hero.languages">Interfaccia in cinque lingue</Translate>
          </li>
        </ul>
      </div>
      <nav className={styles.index} aria-label={translate({id: 'features.index.label', message: 'Le sette aree'})}>
        <ol>
          {groups.map((g) => (
            <li key={g.id}>
              <a href={`#${g.id}`}>
                <span className={styles.indexName}>{g.name}</span>
                <span className={styles.indexBlurb}>{g.blurb}</span>
                <span className={styles.indexCount}>{g.items.length}</span>
                <Icon name="arrow-right" size={18} className={styles.indexArrow} />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </header>
  );
}

/** The groups in a sticky row; the one on screen is marked. */
function SubNav({groups, active}: {groups: Group[]; active: string | null}): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = ref.current;
    const link = active ? row?.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
    if (!row || !link) {
      return;
    }
    // Keep the current link in view on a phone without moving the page.
    const left = link.offsetLeft - (row.clientWidth - link.offsetWidth) / 2;
    row.scrollTo({left, behavior: 'smooth'});
  }, [active]);
  return (
    <nav
      className={styles.subnav}
      aria-label={translate({id: 'features.subnav.label', message: 'Aree delle funzionalità'})}>
      <div className={clsx(home.frame, styles.subnavRow)} ref={ref}>
        {groups.map((g) => (
          <a key={g.id} href={`#${g.id}`} aria-current={active === g.id ? 'true' : undefined}>
            {g.name}
          </a>
        ))}
      </div>
    </nav>
  );
}

function GroupSection({group}: {group: Group}): ReactNode {
  const id = useAnchor(group.id);
  const guide = translate({id: 'features.guide', message: 'Guida'});
  const since = (v: string) => translate({id: 'features.since', message: 'dalla {version}'}, {version: v});
  return (
    <section id={id} className={clsx(styles.section, group.dark && styles.dark)} aria-labelledby={`${id}-title`}>
      <div className={clsx(home.frame, styles.group)}>
        <div className={styles.groupHead}>
          <div className={styles.groupSticky}>
            <h2 className={styles.h2} id={`${group.id}-title`}>
              {group.titleA} <Accent>{group.titleB}</Accent>
            </h2>
            <p className={styles.groupIntro}>{group.intro}</p>
            {group.specimen}
          </div>
        </div>
        <ul className={styles.items}>
          {group.items.map((f) => (
            <li key={f.id} className={styles.item} id={`${group.id}-${f.id}`}>
              <div className={styles.itemTop}>
                <h3>
                  <Link to={f.to} className={styles.itemLink}>
                    {f.title}
                  </Link>
                </h3>
                {f.since && <span className={styles.since}>{since(f.since)}</span>}
              </div>
              <p>{f.text}</p>
              <span className={styles.itemGuide} aria-hidden="true">
                {guide}
                <Icon name="arrow-right" size={16} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Closing(): ReactNode {
  return (
    <section className={clsx(home.frame, styles.closing)} aria-labelledby="features-closing-title">
      <h2 className={styles.closingTitle} id="features-closing-title">
        <Translate id="features.closing.title1">Guardalo</Translate>
        <br />
        <Accent>
          <Translate id="features.closing.titleAccent">da vicino.</Translate>
        </Accent>
      </h2>
      <div className={styles.closingSide}>
        <p className={styles.closingText}>
          <Translate id="features.closing.text">
            La demo è il pannello vero con dati di esempio. L’installazione è un comando.
          </Translate>
        </p>
        <div className={home.actions}>
          <a href={DEMO_URL} className={clsx(home.btn, home.btnPrimary, home.btnBig)}>
            <Translate id="features.closing.demo">Apri la demo</Translate>
            <Icon name="arrow-right" size={18} />
          </a>
          <Link to="/#installa" className={clsx(home.btn, home.btnBig)}>
            <Translate id="features.closing.install">Il comando di installazione</Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Features(): ReactNode {
  const groups = useGroups();
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = groups.map((g) => document.getElementById(g.id)).filter((el): el is HTMLElement => el !== null);
    // A group is current while it crosses a thin band just under the index.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      {rootMargin: '-30% 0px -65% 0px'},
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
    // The groups never change while the page is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main className={clsx(home.home, styles.page)}>
      <Hero groups={groups} />
      <SubNav groups={groups} active={active} />
      {groups.map((g) => (
        <GroupSection key={g.id} group={g} />
      ))}
      <Closing />
    </main>
  );
}
