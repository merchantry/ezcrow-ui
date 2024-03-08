import { UserData } from './types';

export const serializeUserData = (userData: UserData): UserData => ({
  user: userData.user,
  currency: userData.currency,
  telegramHandle: userData.telegramHandle,
  paymentMethods: Array.from(userData.paymentMethods),
});
