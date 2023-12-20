import React from 'react';

import styles from './UserAddressCellData.module.scss';
import Chip from 'components/Chip';
import { useUserWallet } from 'utils/hooks';

export interface UserAddressCellDataProps {
  userAddress: string;
}

function UserAddressCellData({ userAddress }: UserAddressCellDataProps) {
  const { address } = useUserWallet();

  return (
    <span className={styles.address}>
      {userAddress}
      {userAddress === address && (
        <Chip label="You" color="info" tooltip="You created this listing" tooltipPlacement="left" />
      )}
    </span>
  );
}

export default UserAddressCellData;
