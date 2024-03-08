import UserProfileModal from 'components/UserProfileModal';
import triggerModal from './triggerModal';
import { useNetwork } from './web3Hooks';
import { useTableSearchParams } from './hooks';
import { useWeb3Signer } from 'components/ContextData/hooks';
import { getUserData, isWhitelisted } from 'web3/requests/wudbHandler';
import { useCallback } from 'react';

export const useUserProfileModal = () => {
  const network = useNetwork();
  const signer = useWeb3Signer();
  const { currency } = useTableSearchParams();

  const triggerUserProfileModal = useCallback(
    async (address: string) => {
      if (!signer) return;
      const userData = await getUserData(address, currency, network, signer);
      const whitelisted = await isWhitelisted(address, currency, network, signer);

      return triggerModal(UserProfileModal, {
        address,
        userData,
        whitelisted,
      });
    },
    [currency, network, signer],
  );

  return { triggerUserProfileModal };
};
