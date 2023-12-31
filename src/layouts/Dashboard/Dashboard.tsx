import React from 'react';
import styles from './Dashboard.module.scss';
import { ReactComponent as EzcrowLogo } from 'assets/ezcrow_logo_h.svg';
import { Link, Outlet } from 'react-router-dom';
import SideBarLink from 'components/SideBarLink';

function Dashboard() {
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
              <SideBarLink to="/">All Listings</SideBarLink>
              <SideBarLink to="/my-listings">My Listings</SideBarLink>
              <SideBarLink to="/my-orders">My Orders</SideBarLink>
            </ul>
          </nav>
        </div>
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
