import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import CodeBlock from '@theme-original/CodeBlock';
import type CodeBlockType from '@theme/CodeBlock';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof CodeBlockType>;

/**
 * Line numbers are on by default (`noLineNumbers` in the meta turns them off).
 * `prompt` in the meta draws a root prompt (#) before every line that is not a
 * comment, and leaves comments out of what Copy puts on the clipboard.
 */
export default function CodeBlockWrapper(props: Props): ReactNode {
  const meta = props.metastring ?? '';
  const explicit = props.showLineNumbers !== undefined || /\bshowLineNumbers\b/.test(meta);
  const showLineNumbers = explicit ? props.showLineNumbers : !/\bnoLineNumbers\b/.test(meta);
  const prompt = /(^|\s)prompt(\s|$)/.test(meta);
  return (
    <CodeBlock
      {...props}
      showLineNumbers={showLineNumbers}
      className={clsx(props.className, prompt && 'cg-prompt')}
    />
  );
}
