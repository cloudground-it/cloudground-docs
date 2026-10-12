import React, {useEffect, useRef, useState, type ReactNode} from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {INSTALL_COMMAND} from '@site/src/data/site';
import styles from './Terminal.module.css';

/**
 * The installer's terminal: the command, a button that copies it, and an
 * abbreviated picture of what the installer prints. The button copies the
 * <code>'s own text, so it can never copy something other than what the
 * reader sees. Without JavaScript the button is not drawn, the output is
 * shown at once and the command can be selected like any text.
 */
export default function Terminal(): ReactNode {
  const isBrowser = useIsBrowser();
  const code = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [play, setPlay] = useState(false);

  // The output plays once, the first time the terminal is half in view.
  useEffect(() => {
    const el = body.current;
    if (!el || !('IntersectionObserver' in window)) {
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPlay(true);
          io.disconnect();
        }
      },
      {threshold: 0.5},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    const text = code.current?.textContent ?? INSTALL_COMMAND;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // No clipboard (an insecure context, a refused permission): select
      // the command instead, so Ctrl+C does the rest.
      if (code.current) {
        const range = document.createRange();
        range.selectNodeContents(code.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  };

  const output = [
    translate({id: 'home.terminal.line1', message: '[ok] server controllato: Ubuntu, memoria, disco, porte'}),
    translate({id: 'home.terminal.line2', message: '[ok] firma della release verificata'}),
    translate({id: 'home.terminal.line3', message: '[ok] nginx · PHP-FPM · MariaDB · restic installati'}),
    translate({id: 'home.terminal.line4', message: '[ok] pannello attivo su https://<ip>:8443'}),
  ];
  const last = translate({id: 'home.terminal.line5', message: '→ crea l’amministratore: https://<ip>:8443/setup/…'});

  return (
    <div className={styles.term}>
      <div className={styles.bar}>
        <span>server</span>
        <span>bash</span>
        {isBrowser && (
          <button type="button" className={styles.copy} onClick={copy}>
            {copied ? (
              <Translate id="home.terminal.copied">Copiato</Translate>
            ) : (
              <Translate id="home.terminal.copy">Copia</Translate>
            )}
            <span className="sr-only">
              {' '}
              <Translate id="home.terminal.copyWhat">il comando</Translate>
            </span>
          </button>
        )}
        <span className="sr-only" role="status">
          {copied ? translate({id: 'home.terminal.copiedStatus', message: 'Comando copiato'}) : ''}
        </span>
      </div>
      <div ref={body} className={`${styles.body}${play ? ` ${styles.play}` : ''}`}>
        <p className={styles.cmd}>
          <span className={styles.prompt} aria-hidden="true">
            ${' '}
          </span>
          <code ref={code}>{INSTALL_COMMAND}</code>
        </p>
        {output.map((line, i) => (
          <p key={i} className={styles.ok} style={{animationDelay: `${0.3 + i * 0.7}s`}}>
            {line.startsWith('[ok]') ? (
              <>
                <b>[ok]</b>
                {line.slice(4)}
              </>
            ) : (
              line
            )}
          </p>
        ))}
        <p className={styles.last} style={{animationDelay: `${0.3 + output.length * 0.7}s`}}>
          {last}
        </p>
      </div>
    </div>
  );
}
