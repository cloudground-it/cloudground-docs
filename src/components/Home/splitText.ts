/**
 * Wraps every word (and, if asked, every character) of an element's text in
 * an inline-block span, in place, so GSAP can move them one by one. No lines,
 * no masks and no overflow: the text keeps wrapping as it does without the
 * spans, and nothing can be cut. The original text nodes are kept and put
 * back by revert(), so React still finds the nodes it rendered.
 */
export type Split = {words: HTMLElement[]; chars: HTMLElement[]; revert: () => void};

export default function splitText(el: HTMLElement, {chars = false} = {}): Split {
  const words: HTMLElement[] = [];
  const letters: HTMLElement[] = [];
  const done: {node: Text; added: Node[]}[] = [];
  const label = el.getAttribute('aria-label');

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode as Text);
  }
  if (chars) {
    // Read letter by letter otherwise.
    el.setAttribute('aria-label', (el.textContent ?? '').replace(/\s+/g, ' ').trim());
  }
  for (const node of nodes) {
    if (!node.data.trim() || !node.parentNode) {
      continue;
    }
    const frag = document.createDocumentFragment();
    const added: Node[] = [];
    for (const part of node.data.split(/(\s+)/)) {
      if (!part) {
        continue;
      }
      if (/^\s+$/.test(part)) {
        const space = document.createTextNode(part);
        frag.append(space);
        added.push(space);
        continue;
      }
      const word = document.createElement('span');
      word.className = 'cg-split-w';
      if (chars) {
        word.setAttribute('aria-hidden', 'true');
        word.style.whiteSpace = 'nowrap';
        for (const c of Array.from(part)) {
          const letter = document.createElement('span');
          letter.className = 'cg-split-c';
          letter.textContent = c;
          word.append(letter);
          letters.push(letter);
        }
      } else {
        word.textContent = part;
      }
      frag.append(word);
      added.push(word);
      words.push(word);
    }
    node.parentNode.insertBefore(frag, node);
    node.remove();
    done.push({node, added});
  }

  return {
    words,
    chars: letters,
    revert() {
      for (const {node, added} of done) {
        const first = added[0];
        first?.parentNode?.insertBefore(node, first);
        added.forEach((n) => n.parentNode?.removeChild(n));
      }
      done.length = 0;
      if (chars) {
        if (label === null) {
          el.removeAttribute('aria-label');
        } else {
          el.setAttribute('aria-label', label);
        }
      }
    },
  };
}
