import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import {useAlternatePageUtils} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';

type Props = {mobile?: boolean; className?: string};

/**
 * "IT / EN": the current language is marked, the whole control links to the
 * same page in the other language.
 */
export default function LocaleSwitch({mobile, className}: Props): ReactNode {
  const {
    i18n: {currentLocale, locales},
  } = useDocusaurusContext();
  const alternate = useAlternatePageUtils();
  const {search, hash} = useLocation();
  const other = locales.find((l) => l !== currentLocale) ?? currentLocale;
  const to = `pathname://${alternate.createUrl({locale: other, fullyQualified: false})}${search}${hash}`;
  const label = translate({
    id: 'cg.localeSwitch.label',
    message: 'Read this page in English',
    description: 'ARIA label of the IT / EN switch, naming the other language',
  });
  return (
    <Link
      to={to}
      target="_self"
      autoAddBaseUrl={false}
      hrefLang={other}
      aria-label={label}
      className={clsx(
        mobile ? 'menu__link' : 'navbar__item navbar__link',
        'cg-locale',
        className,
      )}>
      {locales.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span className="cg-locale__sep"> / </span>}
          <span className={clsx(l === currentLocale && 'cg-locale--on')}>{l.toUpperCase()}</span>
        </React.Fragment>
      ))}
    </Link>
  );
}
