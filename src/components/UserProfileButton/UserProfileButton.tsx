import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useFormattedDropdownData, useNetwork, useWeb3Signer } from 'components/ContextData/hooks';
import BaseButton from 'components/BaseButton';
import triggerModal from 'utils/triggerModal';
import UserProfileEditModal from 'components/UserProfileEditModal';
import { useTableSearchParams } from 'utils/hooks';
import { UserData } from 'utils/types';
import {
  getAllValidPaymentMethods,
  getUserData,
  isWhitelisted,
  updateUser,
} from 'web3/requests/wudbHandler';

function UserProfileButton() {
  const signer = useWeb3Signer();
  const network = useNetwork();
  const { currency } = useTableSearchParams();
  const { currencyOptionsMap } = useFormattedDropdownData();

  const [userData, setUserData] = useState<UserData>();

  const label = useMemo(() => {
    if (!signer) return 'Connect to see profile';
    if (!userData) return 'Loading profile...';
    if (userData.user !== signer.address) return 'Create profile';
    return 'Open profile';
  }, [signer, userData]);

  const onClick = async () => {
    if (!signer || !userData) return;

    const paymentMethodOptions = await getAllValidPaymentMethods(network, signer);

    await triggerModal(UserProfileEditModal, {
      currencies: currencyOptionsMap,
      paymentMethodOptions,
      currencyParam: currency,
      getUserData: getUserDataFromContract,
    }).then(async data => {
      if (!data) return;

      const { currency, telegramHandle, paymentMethods } = data;
      updateUser(currency, telegramHandle, paymentMethods, network, signer).then(() => {
        updateData();
      });
    });
  };

  const getUserDataFromContract = useCallback(
    async (currency: string) => {
      if (!signer) throw new Error('No signer');
      return {
        ...(await getUserData(signer.address, currency, network, signer)),
        isWhitelisted: await isWhitelisted(signer.address, currency, network, signer),
      };
    },
    [network, signer],
  );

  const updateData = useCallback(async () => {
    if (!signer) return;

    setUserData(await getUserDataFromContract(currency));
  }, [currency, getUserDataFromContract, signer]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  if (!signer) return <></>;

  return <BaseButton onClick={onClick}>{label}</BaseButton>;
}

export default UserProfileButton;
