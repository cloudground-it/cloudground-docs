import React, {type ReactNode} from 'react';
import NavbarNavLink from '@theme-original/NavbarItem/NavbarNavLink';
import type {Props} from '@theme/NavbarItem/NavbarNavLink';
import Icon from '@site/src/components/Icon';
import {REPO} from '@site/src/data/site';

// The navbar link to the repository (in the bar and in the drawer) leads with
// the GitHub mark; other links to GitHub stay plain, so the mark shows once.
export default function NavbarNavLinkWrapper(props: Props): ReactNode {
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
