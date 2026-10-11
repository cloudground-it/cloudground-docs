import React, {type ReactNode} from 'react';
import NavbarNavLink from '@theme-original/NavbarItem/NavbarNavLink';
import type {Props} from '@theme/NavbarItem/NavbarNavLink';
import Icon from '@site/src/components/Icon';
import {isGitHub} from '@site/src/data/site';

// A navbar link to GitHub (in the bar and in the drawer) leads with the GitHub mark.
export default function NavbarNavLinkWrapper(props: Props): ReactNode {
  if (!props.label || !isGitHub(props.href)) {
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
