import React, {type ReactNode} from 'react';
import NavbarNavLink from '@theme-original/NavbarItem/NavbarNavLink';
import type {Props} from '@theme/NavbarItem/NavbarNavLink';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Icon from '@site/src/components/Icon';
import {FEATURES_PATH, REPO, featuresPath} from '@site/src/data/site';

// The navbar link to the repository (in the bar and in the drawer) leads with
// the GitHub mark; other links to GitHub stay plain, so the mark shows once.
// The features page has a path per language (src/data/site.ts): the config
// names the Italian one, and the English navbar gets its own.
export default function NavbarNavLinkWrapper(props: Props): ReactNode {
  const {i18n} = useDocusaurusContext();
  if (props.to === FEATURES_PATH.it) {
    return <NavbarNavLink {...props} to={featuresPath(i18n.currentLocale)} />;
  }
  if (!props.label || props.href !== REPO) {
    return <NavbarNavLink {...props} />;
  }
  return (
    <NavbarNavLink
      {...props}
      label={
        <>
          <Icon name="github" />
          <span>{props.label}</span>
        </>
      }
    />
  );
}
