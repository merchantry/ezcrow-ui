import UserProfileModal from 'components/UserProfileModal';
import triggerModal from './triggerModal';
import { useNetwork } from './web3Hooks';
import { useTableSearchParams } from './hooks';
import { useWeb3Signer } from 'components/ContextData/hooks';
import { getUserData, getUserDataWithOrder } from 'web3/requests/wudbHandler';
import { useCallback } from 'react';

export const useUserProfileModal = () => {
  const network = useNetwork();
  const signer = useWeb3Signer();
  const { token, currency } = useTableSearchParams();

  const getUserDataFromContract = useCallback(
    async (address: string, currency: string) => {
      if (!signer) throw new Error('No signer');
      return getUserData(address, currency, network, signer);
    },
    [network, signer],
  );

  const getUserDataWithOrderFromContract = useCallback(
    async (address: string, currency: string, token: string, orderId: number) => {
      if (!signer) throw new Error('No signer');
      return getUserDataWithOrder(address, token, currency, orderId, network, signer);
    },
    [network, signer],
  );

  const triggerUserProfileModal = async (address: string) =>
    getUserDataFromContract(address, currency).then(userData =>
      triggerModal(UserProfileModal, {
        address,
        userData,
      }),
    );

  const triggerUserProfileFromOrderModal = async (address: string, orderId: number) =>
    getUserDataWithOrderFromContract(address, currency, token, orderId).then(userData =>
      triggerModal(UserProfileModal, {
        address,
        userData,
      }),
    );

  return { triggerUserProfileModal, triggerUserProfileFromOrderModal };
};
