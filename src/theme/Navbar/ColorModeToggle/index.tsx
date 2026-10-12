import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useColorMode, useThemeConfig} from '@docusaurus/theme-common';
import useIsBrowser from '@docusaurus/useIsBrowser';
import {translate} from '@docusaurus/Translate';
import type {Props} from '@theme/Navbar/ColorModeToggle';
import Icon from '@site/src/components/Icon';

/**
 * Two states, light and dark. Until the visitor chooses, the page follows the
 * system (respectPrefersColorScheme: Docusaurus's inline script sets
 * data-theme before the first paint); the first click stores a choice, which
 * then wins. There is no "system" state to cycle through.
 *
 * The button shows the mode it switches to (a moon on light, a sun on dark),
 * drawn by CSS from html[data-theme] so it is right before React hydrates.
 * Screen readers hear a toggle: "Tema scuro", pressed or not.
 */
export default function NavbarColorModeToggle({className}: Props): ReactNode {
  const {disableSwitch} = useThemeConfig().colorMode;
  const {colorMode, setColorMode} = useColorMode();
  const isBrowser = useIsBrowser();
  if (disableSwitch) {
    return null;
  }
  const label = translate({id: 'cg.colorMode.dark', message: 'Tema scuro'});
  return (
    <button
      type="button"
      className={clsx('clean-btn cg-mode', className)}
      aria-label={label}
      title={label}
      aria-pressed={isBrowser ? colorMode === 'dark' : undefined}
      onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}>
      <Icon name="moon" size={20} className="cg-mode__moon" />
      <Icon name="sun" size={20} className="cg-mode__sun" />
    </button>
  );
}
