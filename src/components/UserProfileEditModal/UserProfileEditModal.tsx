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
import MultiSelect from 'components/MultiSelect';

export interface UserProfileEditModalProps extends EditableModalProps<UserEditData> {
  currencies: Record<string, string>;
  paymentMethodOptions: string[];
  currencyParam?: string;
  getUserData: (currency: string) => Promise<UserData & { isWhitelisted: boolean }>;
}

const CURRENCY_HELPER_TEXT =
  'The currency for which the profile will be displayed. You can have a different profile for each currency.';
const TELEGRAM_HELPER_TEXT = 'Your Telegram username';
const PAYMENT_METHODS_HELPER_TEXT = 'Select the payment methods you want to use for fiat payments';

function UserProfileEditModal({
  currencies,
  paymentMethodOptions,
  currencyParam,
  getUserData,
  onSubmit,
  ...modalProps
}: UserProfileEditModalProps) {
  const [currency, setCurrency] = useState<string>(currencyParam || Object.keys(currencies)[0]);
  const [telegramHandle, setTelegramHandle] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false);

  const [isFetching, setIsFetching] = useState(false);

  const updateUserData = (currency: string) => {
    setIsFetching(true);
    getUserData(currency).then(userData => {
      setTelegramHandle(userData.telegramHandle);
      setPaymentMethods(userData.paymentMethods);
      setIsWhitelisted(userData.isWhitelisted);
      setIsFetching(false);
    });
  };

  const onChangeCurrency = (v: string) => {
    setCurrency(v);
    updateUserData(v);
  };

  const onClickSubmit = useCallback(() => {
    onSubmit({ currency, telegramHandle, paymentMethods });
  }, [currency, onSubmit, paymentMethods, telegramHandle]);

  const chipLabel = useMemo(
    () => (isWhitelisted ? 'Whitelisted' : 'Not Whitelisted'),
    [isWhitelisted],
  );

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
              <Chip label={chipLabel} />
            </div>
            <MultiSelect
              value={paymentMethods}
              onChange={setPaymentMethods}
              label="Payment Methods"
              helperText={PAYMENT_METHODS_HELPER_TEXT}
              options={paymentMethodOptions}
            />
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
