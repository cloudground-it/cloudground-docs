import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import LineToken from '@theme/CodeBlock/Line/Token';
import type {Props} from '@theme/CodeBlock/Line';

type Token = Props['line'][number];

function fixLineBreak(line: Token[]) {
  const only = line.length === 1 && line[0]!.content === '\n' ? line[0] : undefined;
  return only ? [{...only, content: ''}] : line;
}

/**
 * One line: a gutter cell with its number, then the code. The line is marked
 * as a comment or as empty, so a `prompt` block can skip the prompt there.
 */
export default function CodeBlockLine({
  line: lineProp,
  classNames,
  showLineNumbers,
  getLineProps,
  getTokenProps,
}: Props): ReactNode {
  const line = fixLineBreak(lineProp);
  const first = line.find((token) => token.content.trim() !== '');
  const isEmpty = !first;
  const isComment = !!first && first.types.includes('comment');
  const lineProps = getLineProps({
    line,
    className: clsx(classNames, 'cg-line', isComment && 'cg-line--comment', isEmpty && 'cg-line--empty'),
  });
  const tokens = line.map((token, key) => {
    const tokenProps = getTokenProps({token});
    return (
      <LineToken key={key} {...tokenProps} line={line} token={token}>
        {tokenProps.children}
      </LineToken>
    );
  });
  return (
    <div {...lineProps}>
      {showLineNumbers && <span className="cg-ln" aria-hidden="true" />}
      <span className="cg-lc">{tokens}</span>
      <br />
    </div>
  );
}
