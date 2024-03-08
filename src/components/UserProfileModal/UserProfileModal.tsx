import React, { useMemo } from 'react';

import styles from './UserProfileModal.module.scss';
import { ModalProps } from 'utils/interfaces';
import ConfirmationModal from 'components/ConfirmationModal';
import Chip from 'components/Chip';
import { UserData } from 'utils/types';

export interface UserProfileModalProps extends ModalProps<boolean> {
  address: string;
  userData: UserData;
  whitelisted: boolean;
}

function ProfileRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p>
      <strong>{label}</strong>: {children}
    </p>
  );
}

function WhitelistedBadge({ whitelisted }: { whitelisted: boolean }) {
  const { color, label, tooltip } = useMemo(
    () =>
      whitelisted
        ? {
            color: 'success' as const,
            label: 'Whitelisted',
            tooltip: 'This user is approved to create listings',
          }
        : {
            color: 'error' as const,
            label: 'Not Whitelisted',
            tooltip: 'This user is not approved to create listings',
          },
    [whitelisted],
  );

  return (
    <div className={styles.whBadgeContainer}>
      <Chip color={color} label={label} tooltip={tooltip} tooltipPlacement="right" />
    </div>
  );
}

function UserProfileModal({
  address,
  userData,
  whitelisted,
  ...modalProps
}: UserProfileModalProps) {
  return (
    <ConfirmationModal title="User Profile" confirmText="OK" noCancelBtn {...modalProps}>
      <div>
        <ProfileRow label="Address">{address}</ProfileRow>
        <ProfileRow label="Currency">{userData.currency}</ProfileRow>
        <div>
          <ProfileRow label="Telegram Handle">{userData.telegramHandle}</ProfileRow>
          <ProfileRow label="Payment Methods">{userData.paymentMethods.join(', ')}</ProfileRow>
          <WhitelistedBadge whitelisted={whitelisted} />
        </div>
      </div>
    </ConfirmationModal>
  );
}

export default UserProfileModal;
