import React from 'react';

import styles from './UserAddressCellData.module.scss';
import Chip from 'components/Chip';
import { shortenAddress } from 'utils/helpers';
import { useWeb3Signer } from 'components/ContextData/hooks';

export interface UserAddressCellDataProps {
  userAddress: string;
  onClick?: () => void;
}

function UserAddressCellData({ userAddress, onClick }: UserAddressCellDataProps) {
  const signer = useWeb3Signer();

  return (
    <span className={styles.address}>
      <a className={styles.addressLink} onClick={onClick}>
        {shortenAddress(userAddress)}
      </a>
      {userAddress === signer?.address && <Chip label="You" tooltipPlacement="left" />}
    </span>
  );
}

export default UserAddressCellData;
