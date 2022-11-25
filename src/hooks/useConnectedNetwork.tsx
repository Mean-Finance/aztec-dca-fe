import React from 'react';
import isEqual from 'lodash/isEqual';
import { Network, NetworkStruct } from 'types';
import isUndefined from 'lodash/isUndefined';
import useCurrentNetwork from './useCurrentNetwork';
import usePrevious from './usePrevious';
import useWalletService from './useWalletService';

function useConnectedNetwork(): [NetworkStruct | Network | undefined, boolean, string | undefined] {
  const [{ result, isLoading, error }, setResults] = React.useState<{
    result: NetworkStruct | Network | undefined;
    isLoading: boolean;
    error: string | undefined;
  }>({ result: undefined, isLoading: false, error: undefined });
  const walletService = useWalletService();
  const currentNetwork = useCurrentNetwork();
  const account = usePrevious(walletService.getAccount());
  const currentAccount = walletService.getAccount();
  const prevResult = usePrevious(result, false);

  React.useEffect(() => {
    async function callPromise() {
      try {
        const promiseResult = await walletService.getNetwork(true);
        setResults({ result: promiseResult, isLoading: false, error: undefined });
      } catch (e) {
        setResults({ result: undefined, isLoading: false, error: e as string });
      }
    }

    if ((!isLoading && isUndefined(result) && !error) || !isEqual(account, currentAccount)) {
      setResults({ result: undefined, isLoading: true, error: undefined });

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      callPromise();
    }
  }, [isLoading, result, error, currentAccount, account, currentNetwork]);

  return [result || prevResult, isLoading, error];
}

export default useConnectedNetwork;