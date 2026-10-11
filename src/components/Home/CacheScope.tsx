import React, {useState, type ReactNode} from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import useIsBrowser from '@docusaurus/useIsBrowser';
import styles from './Scope.module.css';

// Both traces are 1200 units wide in a 600-unit screen: the animation slides
// each one by half its width and starts over, so the loop has no seam.
const WAVE_ON =
  'M0 170 L40 168 L60 150 L80 172 L120 166 L140 158 L160 170 L200 167 L230 152 L250 171 L300 166 L340 169 L360 155 L380 171 L420 167 L440 160 L460 170 L500 166 L530 151 L550 172 L600 170 L640 168 L660 150 L680 172 L720 166 L740 158 L760 170 L800 167 L830 152 L850 171 L900 166 L940 169 L960 155 L980 171 L1020 167 L1040 160 L1060 170 L1100 166 L1130 151 L1150 172 L1200 170';
const WAVE_OFF =
  'M0 120 L30 60 L50 140 L70 40 L100 110 L120 30 L150 130 L170 50 L200 100 L220 20 L250 140 L280 60 L300 120 L330 40 L350 130 L380 70 L400 110 L420 25 L450 135 L480 55 L500 115 L520 35 L550 128 L580 48 L600 120 L630 60 L650 140 L670 40 L700 110 L720 30 L750 130 L770 50 L800 100 L820 20 L850 140 L880 60 L900 120 L930 40 L950 130 L980 70 L1000 110 L1020 25 L1050 135 L1080 55 L1100 115 L1120 35 L1150 128 L1180 48 L1200 120';

/**
 * The hero's oscilloscope: a WordPress site under traffic, with the cache on
 * or off. An illustration, not a measurement, and it says so under itself.
 * Without JavaScript the switch is not drawn and the starting state (cache on)
 * is the whole of it.
 */
export default function CacheScope(): ReactNode {
  const isBrowser = useIsBrowser();
  const [on, setOn] = useState(true);
  const state = on ? 'on' : 'off';

  const stateWord = on
    ? translate({id: 'home.scope.on', message: 'accesa'})
    : translate({id: 'home.scope.off', message: 'spenta'});
  const describe = on
    ? translate({id: 'home.scope.describeOn', message: 'Con la cache il tempo di risposta resta basso e piatto'})
    : translate({id: 'home.scope.describeOff', message: 'Senza cache il tempo di risposta sale e oscilla'});

  const readings = [
    {
      key: 'cache',
      label: translate({id: 'home.scope.cache', message: 'Cache'}),
      value: on ? 'HIT' : 'MISS',
    },
    {
      key: 'php',
      label: translate({id: 'home.scope.php', message: 'PHP del sito'}),
      value: on
        ? translate({id: 'home.scope.phpOn', message: 'a riposo'})
        : translate({id: 'home.scope.phpOff', message: 'al limite'}),
    },
    {
      key: 'db',
      label: translate({id: 'home.scope.db', message: 'Database'}),
      value: on
        ? translate({id: 'home.scope.dbOn', message: 'a riposo'})
        : translate({id: 'home.scope.dbOff', message: 'occupato'}),
    },
  ];

  return (
    <div className={styles.scope} data-cache={state}>
      <div className={styles.head}>
        <p className="hud">
          <Translate id="home.scope.caption">Simulazione · un sito WordPress sotto traffico</Translate>
        </p>
        {isBrowser ? (
          <button type="button" className={`hud ${styles.toggle}`} aria-pressed={on} onClick={() => setOn(!on)}>
            Cache: {stateWord}
          </button>
        ) : (
          <span className={`hud ${styles.toggle}`}>Cache: {stateWord}</span>
        )}
      </div>
      <div className={styles.screen} role="img" aria-label={describe}>
        <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
        <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
        <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
        <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />
        <svg
          className={styles.plot}
          viewBox="0 0 600 230"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false">
          <path className={styles.grid} d="M0 46H600M0 92H600M0 138H600M0 184H600M100 0V230M200 0V230M300 0V230M400 0V230M500 0V230" />
          {on ? (
            <g className={`${styles.wave} ${styles.waveOn}`}>
              <path d={WAVE_ON} />
            </g>
          ) : (
            <g className={`${styles.wave} ${styles.waveOff}`}>
              <path d={WAVE_OFF} />
            </g>
          )}
        </svg>
        <span className={`hud ${styles.axis}`} aria-hidden="true">
          <Translate id="home.scope.axis">Tempo di risposta</Translate>
        </span>
        <span className={`hud ${styles.state}`} aria-hidden="true">
          {on ? (
            <Translate id="home.scope.stable">Stabile</Translate>
          ) : (
            <Translate id="home.scope.strained">Sotto sforzo</Translate>
          )}
        </span>
      </div>
      <dl className={styles.readings}>
        {readings.map((r) => (
          <div key={r.key} className={`${styles.reading} ${styles[r.key]}`}>
            <dt className="hud">{r.label}</dt>
            <dd>
              <span className={`disp ${styles.value}`}>{r.value}</span>
              <span className={styles.bar} aria-hidden="true" />
            </dd>
          </div>
        ))}
      </dl>
      <p className={`hud ${styles.note}`}>
        <Translate
          id="home.scope.note"
          values={{
            link: (
              <a href="#misure">
                <Translate id="home.scope.noteLink">sezione 03</Translate>
              </a>
            ),
          }}>
          {'Illustrazione, non una misura. I numeri veri sono nella {link}.'}
        </Translate>
      </p>
    </div>
  );
}
