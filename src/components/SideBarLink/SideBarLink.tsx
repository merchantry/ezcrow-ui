import React, { useCallback } from 'react';
import styles from './SideBarLink.module.scss';
import { NavLink } from 'react-router-dom';
import { useFirstLocationPathname } from 'utils/hooks';
import { isFilterOption } from 'utils/helpers';

interface SideBarLinkProps {
  to: string;
  children: React.ReactNode;
}

function SideBarLink({ to, children }: SideBarLinkProps) {
  const firstPathname = useFirstLocationPathname();
  const onIndexPage = !firstPathname || isFilterOption(firstPathname);

  const classNameCallback = useCallback(
    (p: { isActive: boolean }) => {
      const isActive = p.isActive || (onIndexPage && to === '/');
      return [isActive ? styles.active : '', styles.sideBarLink].join(' ');
    },
    [onIndexPage, to],
  );

  return (
    <li className={styles.linkContainer}>
      <NavLink className={classNameCallback} to={to}>
        {children}
      </NavLink>
    </li>
  );
}

export default SideBarLink;
