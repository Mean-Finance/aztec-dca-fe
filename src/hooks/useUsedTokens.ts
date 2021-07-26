import React from 'react';
import { Token, Web3Service, Web3ServicePromisableMethods, UsedToken } from 'types';
import isEqual from 'lodash/isEqual';
import usePrevious from 'hooks/usePrevious';
import WalletContext from 'common/wallet-context';
import { useHasPendingTransactions } from 'state/transactions/hooks';

function useUsedTokens() {
  const [isLoading, setIsLoading] = React.useState(false);
  const { web3Service } = React.useContext(WalletContext);
  const [result, setResult] = React.useState<any>([]);
  const [error, setError] = React.useState<any>(undefined);
  const account = usePrevious(web3Service.getAccount());

  React.useEffect(() => {
    async function callPromise() {
      try {
        const usedTokensData = await web3Service.getUsedTokens();
        const mappedTokens =
          (usedTokensData &&
            usedTokensData.data.tokens &&
            usedTokensData.data.tokens.map((token: UsedToken) => token.tokenInfo.address.toLowerCase())) ||
          [];
        setResult(mappedTokens);
        setError(undefined);
      } catch (e) {
        setError(e);
      }
      setIsLoading(false);
    }

    if ((!isLoading && !result && !error) || !isEqual(account, web3Service.getAccount())) {
      setIsLoading(true);
      setResult([]);
      setError(undefined);
      callPromise();
    }
  }, [isLoading, result, error, web3Service.getAccount()]);

  return [result, isLoading, error];
}

export default useUsedTokens;
