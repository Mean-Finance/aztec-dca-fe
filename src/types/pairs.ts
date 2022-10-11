import { Oracles } from './contracts';
import { Token } from './tokens';

export interface SwapsToPerform {
  interval: number;
}
export interface GetNextSwapInfo {
  swapsToPerform: SwapsToPerform[];
}

export type SwapInfo = [boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean];

export type AvailablePair = {
  token0: Token;
  token1: Token;
  lastExecutedAt: number;
  lastCreatedAt: number;
  id: string;
  swapInfo: SwapInfo;
  oracle: Oracles;
};

export type AvailablePairs = AvailablePair[];

export interface PairSwapsIntervals {
  id: string;
  swapInterval: {
    id: string;
    interval: string;
    description: string;
  };
  swapPerformed: string;
}
export interface PairSwaps {
  id: string;
  executedAtTimestamp: string;
  executedAtBlock: string;
  ratioBToAWithFee: string;
  ratioAToBWithFee: string;
  transaction: {
    id: string;
    hash: string;
    index: string;
    gasSent: string;
    gasPrice: string;
    from: string;
    timestamp: string;
  };
  pairSwapsIntervals: PairSwapsIntervals[];
}

export interface GetPairSwapsData {
  id: string;
  createdAtTimestamp: string;
  tokenA: {
    address: string;
  };
  tokenB: {
    address: string;
  };
  swaps: PairSwaps[];
  activePositionsPerInterval: [number, number, number, number, number, number, number, number];
}
