import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './UserProfileEditModal.module.scss';
import { EditableModalProps } from 'utils/interfaces';
import Modal from 'components/Modal';
import BaseSelect from 'components/BaseSelect';
import BaseInput from 'components/BaseInput';
import { UserData, UserEditData } from 'utils/types';
import Chip from 'components/Chip';
import BaseButton from 'components/BaseButton';
import LoadingAnimation from 'components/LoadingAnimation';

export interface UserProfileEditModalProps extends EditableModalProps<UserEditData> {
  currencies: Record<string, string>;
  paymentMethods: Record<string, string>;
  currencyParam?: string;
  getUserData: (currency: string) => Promise<UserData>;
  getUserPreparedData: (currency: string) => Promise<UserData>;
}

const CURRENCY_HELPER_TEXT =
  'The currency for which the profile will be displayed. You can have a different profile for each currency.';
const TELEGRAM_HELPER_TEXT = 'Your Telegram username';
const PAYMENT_METHOD_HELPER_TEXT = 'Select the payment method you want to use for fiat payments';
const PAYMENT_DATA_HELPER_TEXT = 'Your payment addres/ID for the selected payment method';

function UserProfileEditModal({
  currencies,
  paymentMethods,
  currencyParam,
  getUserData,
  getUserPreparedData,
  onSubmit,
  ...modalProps
}: UserProfileEditModalProps) {
  const [nonce, setNonce] = useState<number>(0);
  const [currency, setCurrency] = useState<string>(currencyParam || Object.keys(currencies)[0]);
  const [telegramHandle, setTelegramHandle] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentData, setPaymentData] = useState<string>('');
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);
  const [lastWhitelistedNonce, setLastWhitelistedNonce] = useState<number>(0);

  const [isFetching, setIsFetching] = useState(false);

  const applyUserData = (userData: UserData) => {
    setNonce(userData.profileNonce);
    setTelegramHandle(userData.telegramHandle);
    setPaymentMethod(userData.privateData.paymentMethod);
    setPaymentData(userData.privateData.paymentData);
  };

  const updateUserData = (currency: string) => {
    setIsFetching(true);
    getUserPreparedData(currency).then(userPreparedData => {
      applyUserData(userPreparedData);
      getUserData(currency).then(userData => {
        setLastWhitelistedNonce(userData.profileNonce);
        setIsWhitelisted(userData.whitelisted);
        setIsFetching(false);
      });
    });
  };

  const onChangeCurrency = (v: string) => {
    setCurrency(v);
    updateUserData(v);
  };

  const { chipTooltip, chipLabel } = useMemo(() => {
    if (nonce === 0)
      return {
        chipLabel: 'Create new profile',
      };

    if (nonce !== lastWhitelistedNonce)
      return {
        chipTooltip: isWhitelisted
          ? 'You are currently whitelisted, but this data is still in review'
          : 'Your profile data is still in review',
        chipLabel: 'Profile in review',
      };

    if (!isWhitelisted)
      return { chipTooltip: 'Your profile has been delisted', chipLabel: 'Not Whitelisted' };

    return { chipLabel: 'Whitelisted' };
  }, [isWhitelisted, lastWhitelistedNonce, nonce]);

  const onClickSubmit = useCallback(() => {
    onSubmit({ currency, telegramHandle, paymentMethod, paymentData });
  }, [currency, onSubmit, paymentData, paymentMethod, telegramHandle]);

  useEffect(() => {
    updateUserData(currency);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal title="Edit profile data" {...modalProps}>
      <Modal.Body className={styles.body}>
        <BaseSelect
          label="Currency"
          value={currency}
          onChange={onChangeCurrency}
          options={currencies}
          helperText={CURRENCY_HELPER_TEXT}
        />
        {isFetching ? (
          <LoadingAnimation />
        ) : (
          <>
            <div className={styles.flexContainer}>
              <BaseInput
                label="Telegram Handle"
                value={telegramHandle}
                onChange={setTelegramHandle}
                helperText={TELEGRAM_HELPER_TEXT}
              />
              <Chip label={chipLabel} tooltip={chipTooltip} />
            </div>
            <div className={styles.privateData}>
              <div>
                <h3>Private data</h3>
                <p>
                  These fields are only visible to you, the admins and users you have an active
                  order with
                </p>
              </div>
              <BaseSelect
                label="Payment Method"
                value={paymentMethod}
                onChange={setPaymentMethod}
                options={paymentMethods}
                helperText={PAYMENT_METHOD_HELPER_TEXT}
              />
              <BaseInput
                label="Payment data"
                value={paymentData}
                onChange={setPaymentData}
                helperText={PAYMENT_DATA_HELPER_TEXT}
              />
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className={styles.footer}>
        <BaseButton onClick={onClickSubmit}>Submit</BaseButton>
      </Modal.Footer>
    </Modal>
  );
}

export default UserProfileEditModal;
