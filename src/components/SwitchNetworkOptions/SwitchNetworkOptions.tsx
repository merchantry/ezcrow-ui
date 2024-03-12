import React, { memo } from 'react';

import styles from './SwitchNetworkOptions.module.scss';
import BaseButton from 'components/BaseButton';
import { ChainName } from 'web3/types';
import { NETWORK_OPTIONS } from 'web3/config';

interface SwitchNetworkOptionsProps {
  onMouseLeave?: () => void;
  onSwitchNetwork?: (network: ChainName) => void;
}

function SwitchNetworkOptions({ onMouseLeave, onSwitchNetwork }: SwitchNetworkOptionsProps) {
  return (
    <div className={styles.container}>
      <div onMouseLeave={onMouseLeave}>
        {Object.entries(NETWORK_OPTIONS).map(([network, label]) => (
          <BaseButton
            onClick={() => onSwitchNetwork && onSwitchNetwork(network as ChainName)}
            key={network}
          >
            {label}
          </BaseButton>
        ))}
      </div>
    </div>
  );
}

export default memo(SwitchNetworkOptions);
