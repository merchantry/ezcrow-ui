import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useFormattedDropdownData, useWeb3Signer } from 'components/ContextData/hooks';
import BaseButton from 'components/BaseButton';
import triggerModal from 'utils/triggerModal';
import UserProfileEditModal from 'components/UserProfileEditModal';
import { useNetwork } from 'utils/web3Hooks';
import { useTableSearchParams } from 'utils/hooks';
import { UserData } from 'utils/types';
import { toKeyValueObject } from 'utils/arrays';
import {
  getAllValidPaymentMethods,
  getUserData,
  getUserPreparedData,
  updateUser,
} from 'web3/requests/wudbHandler';

function UserProfileButton() {
  const signer = useWeb3Signer();
  const network = useNetwork();
  const { currency } = useTableSearchParams();
  const { currencyOptionsMap } = useFormattedDropdownData();

  const [userData, setUserData] = useState<UserData>();
  const [userPreparedData, setUserPreparedData] = useState<UserData>();

  const label = useMemo(() => {
    if (!signer) return 'Connect to see profile';
    if (!userData || !userPreparedData) return 'Loading profile...';
    if (userData.profileNonce !== userPreparedData.profileNonce) return 'Profile in review';
    if (userData.profileNonce === 0) return 'Create new profile';
    return 'Open profile';
  }, [signer, userData, userPreparedData]);

  const onClick = async () => {
    if (!signer || !userData || !userPreparedData) return;

    const paymentMethods = await getAllValidPaymentMethods(network, signer);

    await triggerModal(UserProfileEditModal, {
      currencies: currencyOptionsMap,
      paymentMethods: toKeyValueObject(paymentMethods),
      currencyParam: currency,
      getUserData: getUserDataFromContract,
      getUserPreparedData: getUserPreparedDataFromContract,
    }).then(async data => {
      if (!data) return;

      const { currency, telegramHandle, paymentMethod, paymentData } = data;
      updateUser(currency, telegramHandle, paymentMethod, paymentData, network, signer).then(() => {
        updateData();
      });
    });
  };

  const getUserDataFromContract = useCallback(
    async (currency: string) => {
      if (!signer) throw new Error('No signer');
      return getUserData(signer.address, currency, network, signer);
    },
    [network, signer],
  );

  const getUserPreparedDataFromContract = useCallback(
    async (currency: string) => {
      if (!signer) throw new Error('No signer');
      return getUserPreparedData(currency, network, signer);
    },
    [network, signer],
  );

  const updateData = useCallback(async () => {
    if (!signer) return;

    setUserData(await getUserDataFromContract(currency));
    setUserPreparedData(await getUserPreparedDataFromContract(currency));
  }, [currency, getUserDataFromContract, getUserPreparedDataFromContract, signer]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  if (!signer) return <></>;

  return <BaseButton onClick={onClick}>{label}</BaseButton>;
}

export default UserProfileButton;
