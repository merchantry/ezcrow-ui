import { UserData } from './types';

export const serializeUserData = (userData: UserData): UserData => ({
  profileNonce: Number(userData.profileNonce),
  user: userData.user,
  currency: userData.currency,
  telegramHandle: userData.telegramHandle,
  whitelisted: userData.whitelisted,
  privateData: {
    paymentMethod: userData.privateData.paymentMethod,
    paymentData: userData.privateData.paymentData,
  },
});
