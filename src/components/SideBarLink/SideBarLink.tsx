import React, { useCallback, useMemo } from 'react';
import styles from './SideBarLink.module.scss';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useFilterOption, useFirstLocationPathname } from 'utils/hooks';
import { isFilterOption, toUrlSearchParams } from 'utils/helpers';

interface SideBarLinkProps {
  to: string;
  children: React.ReactNode;
}

function SideBarLink({ to, children }: SideBarLinkProps) {
  const firstPathname = useFirstLocationPathname();
  const onIndexPage = !firstPathname || isFilterOption(firstPathname);
  const filterOption = useFilterOption();
  const [searchParams] = useSearchParams();

  const modifiedTo = useMemo(() => {
    const toPath = to === '/' ? '' : to;
    const filterPath = filterOption ? `/${filterOption}` : '';
    const paramsToString = toUrlSearchParams({
      token: searchParams.get('token') || undefined,
      currency: searchParams.get('currency') || undefined,
    });

    return `${toPath}${filterPath}${paramsToString}`;
  }, [filterOption, searchParams, to]);

  const classNameCallback = useCallback(
    (p: { isActive: boolean }) => {
      const isActive = p.isActive || (onIndexPage && to === '/');
      return [isActive ? styles.active : '', styles.sideBarLink].join(' ');
    },
    [onIndexPage, to],
  );

  return (
    <li className={styles.linkContainer}>
      <NavLink className={classNameCallback} to={modifiedTo}>
        {children}
      </NavLink>
    </li>
  );
}

export default SideBarLink;
