import { PositionVersions } from 'config';
import { BigNumber } from 'ethers';
import { Token } from './tokens';

export type SwapInterval = {
  id: string;
  interval: BigNumber;
  description: string;
};

export interface NFTData {
  description: string;
  image: string;
  name: string;
}

export type Permission = 'INCREASE' | 'REDUCE' | 'WITHDRAW' | 'TERMINATE';
export type PositionStatus = 'ACTIVE' | 'COMPLETED' | 'TERMINATED';
export interface PositionPermission {
  id: string;
  operator: string;
  permissions: Permission[];
}

export type PositionActions =
  | 'MODIFIED_RATE'
  | 'MODIFIED_DURATION'
  | 'MODIFIED_RATE_AND_DURATION'
  | 'WITHDREW'
  | 'SWAPPED'
  | 'CREATED'
  | 'TERMINATED'
  | 'TRANSFERED'
  | 'PERMISSIONS_MODIFIED';

export interface Position {
  from: Token;
  to: Token;
  user: string;
  swapInterval: BigNumber; // daily/weekly/etc
  swapped: BigNumber; // total de swappeado
  remainingLiquidity: BigNumber;
  remainingSwaps: BigNumber;
  totalDeposited: BigNumber;
  withdrawn: BigNumber; // cuanto saque
  totalSwaps: BigNumber; // cuanto puse originalmente
  rate: BigNumber;
  toWithdraw: BigNumber;
  totalExecutedSwaps: BigNumber;
  depositedRateUnderlying: Nullable<BigNumber>;
  totalSwappedUnderlyingAccum: Nullable<BigNumber>;
  toWithdrawUnderlyingAccum: Nullable<BigNumber>;
  id: string;
  positionId: string;
  status: string;
  startedAt: number;
  pendingTransaction: string;
  version: PositionVersions;
  chainId: number;
  pairLastSwappedAt: number;
  pairNextSwapAvailableAt: string;
  yieldFrom?: string;
  yieldTo?: string;
  toWithdrawUnderlying: Nullable<BigNumber>;
  remainingLiquidityUnderlying: Nullable<BigNumber>;
}

export interface FullPosition {
  from: Token;
  to: Token;
  user: string;
  totalDeposited: string;
  totalSwaps: string; // cuanto puse originalmente
  id: string;
  positionId: string;
  status: string;
  startedAt: number;
  totalExecutedSwaps: string;
  pendingTransaction: string;
  version: PositionVersions;
  pair: {
    id: string;
    tokenA: Token;
    tokenB: Token;
  };
  createdAtTimestamp: string;
  totalSwapped: string;
  totalWithdrawn: string;
  terminatedAtTimestamp: string;
  chainId: number;
  permissions: PositionPermission[];
  swapInterval: {
    id: string;
    interval: string;
    description: string;
  };
  rate: string;
  remainingSwaps: string;
  swapped: string;
  withdrawn: string;
  remainingLiquidity: string;
  toWithdraw: string;
  depositedRateUnderlying: Nullable<string>;
  totalSwappedUnderlyingAccum: Nullable<string>;
  toWithdrawUnderlyingAccum: Nullable<string>;
  history: ActionState[];
}

export interface ActionState {
  id: string;
  action: PositionActions;
  rate: string;
  oldRate: string;
  from: string;
  to: string;
  remainingSwaps: string;
  oldRemainingSwaps: string;
  swapped: string;
  withdrawn: string;
  permissions: PositionPermission[];
  swappedUnderlying: string;
  oldRateUnderlying: string;
  withdrawnUnderlying: string;
  rateUnderlying: string;
  depositedRateUnderlying: string;
  pairSwap: {
    ratioUnderlyingAToB: string;
    ratioUnderlyingBToA: string;
    ratioUnderlyingAToBWithFee: string;
    ratioUnderlyingBToAWithFee: string;
  };
  createdAtBlock: string;
  createdAtTimestamp: string;
  transaction: {
    id: string;
    hash: string;
    timestamp: string;
    gasPrice?: string;
    l1GasPrice?: string;
    overhead?: string;
  };
}

export interface PositionKeyBy {
  [key: string]: Position;
}

export type Positions = Position[];
