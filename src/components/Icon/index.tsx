import React, {type ComponentProps, type ReactNode} from 'react';
import clsx from 'clsx';
import ArrowLeft from '@site/src/icons/arrow-left.svg';
import ArrowRight from '@site/src/icons/arrow-right.svg';
import Browser from '@site/src/icons/browser.svg';
import Check from '@site/src/icons/check.svg';
import ChevronDown from '@site/src/icons/chevron-down.svg';
import Edit from '@site/src/icons/edit.svg';
import Copy from '@site/src/icons/copy.svg';
import ExternalLink from '@site/src/icons/external-link.svg';
import GitHub from '@site/src/icons/github.svg';
import Language from '@site/src/icons/language.svg';
import Menu from '@site/src/icons/menu.svg';
import Moon from '@site/src/icons/moon.svg';
import Search from '@site/src/icons/search.svg';
import Sun from '@site/src/icons/sun.svg';
import X from '@site/src/icons/x.svg';

/**
 * The site's icons, inlined so they take the text colour. Every file in
 * src/icons is copied unchanged from the CloudGround Icons repository
 * (cloudground-it/cloudground-icons, MIT, see src/icons/LICENSE), except
 * github.svg: GitHub's own mark, used only on links to GitHub.
 */
const ICONS = {
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  browser: Browser,
  check: Check,
  'chevron-down': ChevronDown,
  copy: Copy,
  edit: Edit,
  'external-link': ExternalLink,
  github: GitHub,
  language: Language,
  menu: Menu,
  moon: Moon,
  search: Search,
  sun: Sun,
  x: X,
};

export type IconName = keyof typeof ICONS;

type Props = Omit<ComponentProps<'svg'>, 'ref'> & {name: IconName; size?: number};

/** One icon, `size` px square (16 by default), hidden from screen readers. */
export default function Icon({name, size = 16, className, ...props}: Props): ReactNode {
  const Svg = ICONS[name];
  return (
    <Svg
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...props}
      className={clsx('cg-icon', name === 'github' && 'cg-icon--github', className)}
    />
  );
}
