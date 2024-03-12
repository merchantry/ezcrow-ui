import React, { useCallback, useEffect, useMemo, useState } from 'react';

import styles from './UserTokenBalance.module.scss';
import { useDropdownData, useWeb3Signer, useNetwork } from 'components/ContextData/hooks';
import { priceFormat } from 'utils/helpers';
import { getERC20Contract, getEzcrowRampContract } from 'web3/utils/contracts';
import { useTableSearchParams, useWindowEvent } from 'utils/hooks';
import { ROUND_TO_TOKEN } from 'config/number';
import { multiplyByTenPow } from 'utils/bigint';
import { useOnAccountsChanged } from 'utils/ethereumProviderHooks';
import { WEB3_REQUEST_COMPLETED_EVENT } from 'web3/api';

function UserTokenBalance() {
  const signer = useWeb3Signer();
  const network = useNetwork();
  const { token } = useTableSearchParams();
  const { tokenDecimals } = useDropdownData();

  const [balance, setBalance] = useState<string | undefined>();
  const [isFetching, setIsFetching] = useState(false);

  const label = useMemo(() => {
    if (isFetching) return 'Loading balance...';
    if (balance !== undefined) return `Balance: ${balance}`;
    if (!signer) return 'Connect to see balance';
    return 'Loading balance...';
  }, [balance, isFetching, signer]);

  const updateBalance = useCallback(async () => {
    if (!signer || !token || !(token in tokenDecimals)) {
      setBalance(undefined);
      return;
    }

    const ezcrowRampContract = getEzcrowRampContract(network, signer);
    const tokenAddress = await ezcrowRampContract.getTokenAddress(token);
    const tokenContract = getERC20Contract(tokenAddress, signer);
    const tokenBalance = await tokenContract.balanceOf(signer.address);
    const decimals = BigInt(tokenDecimals[token]);
    const balanceAsNumber = Number(multiplyByTenPow(tokenBalance, -decimals));
    const formattedBalance = priceFormat(balanceAsNumber, undefined, ROUND_TO_TOKEN);

    setBalance(`${formattedBalance} ${token}`);
  }, [signer, token, tokenDecimals, network]);

  useEffect(() => {
    updateBalance();
  });

  useOnAccountsChanged(() => {
    setIsFetching(true);
    updateBalance();
    setIsFetching(false);
  });

  useWindowEvent(WEB3_REQUEST_COMPLETED_EVENT, () => {
    setIsFetching(true);
    updateBalance();
    setIsFetching(false);
  });

  return <div className={styles.container}>{label}</div>;
}

export default UserTokenBalance;
