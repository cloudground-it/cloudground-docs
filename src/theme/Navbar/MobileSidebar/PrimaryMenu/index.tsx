import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useAlternatePageUtils, useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {translate} from '@docusaurus/Translate';
import NavbarItem, {type Props as NavbarItemConfig} from '@theme/NavbarItem';
import Icon from '@site/src/components/Icon';
import {RELEASE, RELEASE_URL} from '@site/src/data/site';

/** The two languages side by side; the current one is marked, not linked. */
function LocaleSwitch(): ReactNode {
  const {
    i18n: {currentLocale, locales, localeConfigs},
  } = useDocusaurusContext();
  const alternate = useAlternatePageUtils();
  return (
    <ul className="cg-drawer__locales" aria-label={translate({id: 'cg.drawer.language', message: 'Lingua'})}>
      {locales.map((locale) => {
        const config = localeConfigs[locale]!;
        const current = locale === currentLocale;
        return (
          <li key={locale}>
            {current ? (
              <span className="cg-drawer__locale cg-drawer__locale--current" aria-current="true" lang={config.htmlLang}>
                {config.label}
              </span>
            ) : (
              // A full load: the other language is another build.
              <a
                className="cg-drawer__locale"
                href={alternate.createUrl({locale, fullyQualified: false})}
                hrefLang={config.htmlLang}
                lang={config.htmlLang}>
                {config.label}
              </a>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The navbar's sections as large ruled rows, then a footer row with the
 * language and the release.
 */
export default function NavbarMobilePrimaryMenu(): ReactNode {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = (useThemeConfig().navbar.items as NavbarItemConfig[]).filter(
    (item) => item.type !== 'localeDropdown',
  );
  return (
    <div className="cg-drawer">
      <ul className="menu__list cg-drawer__rows">
        {items.map((item, i) => (
          <NavbarItem
            mobile
            {...item}
            className={clsx(item.className, 'cg-drawer__row')}
            onClick={() => mobileSidebar.toggle()}
            key={i}
          />
        ))}
      </ul>
      <div className="cg-drawer__foot">
        <Icon name="language" className="cg-drawer__footicon" />
        <LocaleSwitch />
        <a className="cg-drawer__version" href={RELEASE_URL}>
          {RELEASE}
        </a>
      </div>
    </div>
  );
}
