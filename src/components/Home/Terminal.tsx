import React, {useRef, useState, type ReactNode} from 'react';
import Translate, {translate} from '@docusaurus/Translate';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {INSTALL_COMMAND} from '@site/src/data/site';
import styles from './Terminal.module.css';

/**
 * The installer's terminal: the command, a button that copies it, and an
 * abbreviated picture of what the installer prints. The button copies the
 * <code>'s own text, so it can never copy something other than what the
 * reader sees. Without JavaScript the button is not drawn and the command can
 * be selected like any text.
 */
export default function Terminal(): ReactNode {
  const isBrowser = useIsBrowser();
  const code = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = code.current?.textContent ?? INSTALL_COMMAND;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // No clipboard (an insecure context, a refused permission): select
      // the command instead, so Ctrl+C does the rest.
      const range = document.createRange();
      if (code.current) {
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
    translate({id: 'home.terminal.line5', message: '→ crea l’amministratore: https://<ip>:8443/setup/…'}),
  ];

  return (
    <div className={styles.terminal}>
      <div className={styles.bar}>
        <span className={`hud ${styles.tab}`}>server</span>
        <span className={`hud ${styles.tab} ${styles.quiet}`}>bash</span>
        {isBrowser && (
          <button type="button" className={`hud ${styles.copy}`} onClick={copy}>
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
      <div className={styles.body}>
        <p className={styles.command}>
          <span className={styles.prompt} aria-hidden="true">
            ${' '}
          </span>
          <code ref={code}>{INSTALL_COMMAND}</code>
          <span className={styles.caret} aria-hidden="true" />
        </p>
        {output.map((line, i) => (
          <p
            key={i}
            className={i === output.length - 1 ? `${styles.line} ${styles.last}` : styles.line}
            style={{animationDelay: `${0.4 + i * 0.8}s`}}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
