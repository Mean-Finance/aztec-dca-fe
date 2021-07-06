import { BigNumber } from 'ethers';

const HOURS_IN_MONTH = BigNumber.from(732);
const DAYS_IN_WEEK = BigNumber.from(7);
const HOURS_IN_DAYS = BigNumber.from(24);
const MINUTES_IN_HOURS = BigNumber.from(60);
const SECONDS_IN_MINUTES = BigNumber.from(60);

export const FIVE_MINUTES_IN_SECONDS = SECONDS_IN_MINUTES.mul(BigNumber.from(5));
export const DAY_IN_SECONDS = HOURS_IN_DAYS.mul(MINUTES_IN_HOURS).mul(SECONDS_IN_MINUTES);
export const WEEK_IN_SECONDS = DAYS_IN_WEEK.mul(HOURS_IN_DAYS).mul(MINUTES_IN_HOURS).mul(SECONDS_IN_MINUTES);
export const MONTH_IN_SECONDS = HOURS_IN_MONTH.mul(MINUTES_IN_HOURS).mul(SECONDS_IN_MINUTES);

export const SWAP_INTERVALS = {
  day: DAY_IN_SECONDS,
  week: WEEK_IN_SECONDS,
  month: MONTH_IN_SECONDS,
};

export const STRING_SWAP_INTERVALS = {
  [FIVE_MINUTES_IN_SECONDS.toString()]: '5 minutes',
  [DAY_IN_SECONDS.toString()]: 'days',
  [WEEK_IN_SECONDS.toString()]: 'weeks',
  [MONTH_IN_SECONDS.toString()]: 'months',
};

export const sortTokens = (tokenA: string, tokenB: string) => {
  let token0 = tokenA;
  let token1 = tokenB;

  if (tokenA > tokenB) {
    token0 = tokenB;
    token1 = tokenA;
  }

  return [token0, token1];
};
