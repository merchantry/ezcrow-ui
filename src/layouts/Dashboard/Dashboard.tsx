import React from 'react';
import styles from './Dashboard.module.scss';
import { ReactComponent as EzcrowLogo } from 'assets/ezcrow_logo_h.svg';
import { Link, Outlet } from 'react-router-dom';
import SideBarLink from 'components/SideBarLink';
import Web3Button from 'components/Web3Button';
import UserTokenBalance from 'components/UserTokenBalance';
import UserProfileButton from 'components/UserProfileButton';
import { useWeb3Data } from 'components/ContextData/hooks';
import ROUTES from 'config/routes';

function Dashboard() {
  const { signer, accountData } = useWeb3Data();

  return (
    <div className={styles.appContainer}>
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.logoContainer}>
            <Link to="/">
              <EzcrowLogo />
            </Link>
          </div>
          <nav>
            <ul>
              {Object.entries(ROUTES).map(([path, route]) => {
                if (route.disabled && route.disabled({ signer, accountData })) {
                  return null;
                }

                return (
                  <SideBarLink key={path} to={path}>
                    {route.title}
                  </SideBarLink>
                );
              })}
            </ul>
          </nav>
        </div>
        <div className={styles.mainContent}>
          <Outlet />
        </div>
        <div className={styles.userData}>
          <UserTokenBalance />
          <UserProfileButton />
          <Web3Button />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
