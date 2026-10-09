import React, {useCallback, useEffect, useRef, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import {useCodeBlockContext} from '@docusaurus/theme-common/internal';
import Container from '@theme/CodeBlock/Container';
import Content from '@theme/CodeBlock/Content';
import type {Props} from '@theme/CodeBlock/Layout';

async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  const {default: copy} = await import('copy-text-to-clipboard');
  copy(text);
}

function CopyButton({text}: {text: string}): ReactNode {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | undefined>(undefined);
  const onClick = useCallback(() => {
    void copyToClipboard(text).then(() => {
      setCopied(true);
      window.clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => setCopied(false), 1600);
    });
  }, [text]);
  useEffect(() => () => window.clearTimeout(timeout.current), []);
  return (
    <button
      type="button"
      className="hud cg-copy"
      onClick={onClick}
      aria-label={translate({id: 'theme.CodeBlock.copyButtonAriaLabel', message: 'Copia il codice negli appunti'})}>
      <span aria-live="polite">
        {copied
          ? translate({id: 'theme.CodeBlock.copied', message: 'Copiato'})
          : translate({id: 'theme.CodeBlock.copy', message: 'Copia'})}
      </span>
    </button>
  );
}

/** Code on ink: a bar with the title (or language) and Copy, then the lines. */
export default function CodeBlockLayout({className}: Props): ReactNode {
  const {metadata} = useCodeBlockContext();
  const prompt = (metadata.className ?? '').split(/\s+/).includes('cg-prompt');
  const text = prompt
    ? metadata.code
        .split('\n')
        .filter((line) => !/^\s*#/.test(line))
        .join('\n')
    : metadata.code;
  const label = metadata.title ?? (metadata.language && metadata.language !== 'text' ? metadata.language : null);
  return (
    <Container as="div" className={clsx(className, metadata.className, 'cg-code')}>
      <div className="cg-code__bar">
        <span className="hud cg-code__label">{label}</span>
        <CopyButton text={text} />
      </div>
      <div className="cg-code__content">
        <Content />
      </div>
    </Container>
  );
}
