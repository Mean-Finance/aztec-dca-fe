import { BigNumber } from '@ethersproject/bignumber';
import find from 'lodash/find';
import React from 'react';
import { GetNextSwapInfo } from 'types';
import { DAY_IN_SECONDS, calculateStale as rawCalculateStale } from 'utils/parsing';
import useWeb3Service from './useWeb3Service';

export const NOTHING_TO_EXECUTE = 0;
export const HEALTHY = 1;
export const STALE = 2;

function useIsStale(
  pair: string
): [(lastSwapped: number | undefined, frequencyType: BigNumber, createdAt: number) => -1 | 0 | 1 | 2, boolean] {
  const web3service = useWeb3Service();
  const [nextSwapInformation, setNextSwapInformation] = React.useState<GetNextSwapInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function getNextSwapInformation() {
      try {
        const nextSwap = await web3service.getNextSwapInfo(pair);
        setNextSwapInformation(nextSwap);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    }

    getNextSwapInformation();
  }, []);

  const calculateStale = React.useCallback(
    (lastSwapped: number = 0, frequencyType: BigNumber, createdAt: number) =>
      rawCalculateStale(lastSwapped, frequencyType, createdAt, nextSwapInformation),
    [nextSwapInformation, isLoading, pair]
  );

  return [calculateStale, isLoading];
}

export default useIsStale;
