import { BigNumber } from 'ethers/lib/ethers';
import { TransactionActionType } from 'types';

export const MAX_UINT_32 = 4294967295;

export const MAX_BI = BigNumber.from('115792089237316195423570985008687907853269984665640564039457584007913129639935');

type PositionVersion1Type = '1';
type PositionVersion2Type = '2';
type PositionVersion3Type = '3';
type PositionVersion4Type = '4';
export const POSITION_VERSION_1: PositionVersion1Type = '1'; // BETA
export const POSITION_VERSION_2: PositionVersion2Type = '2'; // VULN
export const POSITION_VERSION_3: PositionVersion3Type = '3'; // POST-VULN
export const POSITION_VERSION_4: PositionVersion4Type = '4'; // Yield

export type PositionVersions =
  | PositionVersion1Type
  | PositionVersion2Type
  | PositionVersion3Type
  | PositionVersion4Type;

export const OLD_VERSIONS: PositionVersions[] = [POSITION_VERSION_1, POSITION_VERSION_2, POSITION_VERSION_3];

export const LATEST_VERSION: PositionVersions = POSITION_VERSION_4;

export const VERSIONS_ALLOWED_MODIFY: PositionVersions[] = [POSITION_VERSION_4];

// export const POSITIONS_VERSIONS: PositionVersions[] = [POSITION_VERSION_2, POSITION_VERSION_3, POSITION_VERSION_4];
export const POSITIONS_VERSIONS: PositionVersions[] = [
  POSITION_VERSION_1,
  POSITION_VERSION_2,
  POSITION_VERSION_3,
  POSITION_VERSION_4,
];

export const TOKEN_TYPE_BASE = 'BASE';
export const TOKEN_TYPE_WRAPPED = 'WRAPPED_PROTOCOL_TOKEN';
export const TOKEN_TYPE_YIELD_BEARING_SHARES = 'YIELD_BEARING_SHARE';

export const INDEX_TO_SPAN = [24, 42, 30];

export const INDEX_TO_PERIOD = ['1h', '4h', '1d'];

export const TRANSACTION_ACTION_APPROVE_TOKEN = 'APPROVE_TOKEN';
export const TRANSACTION_ACTION_APPROVE_TOKEN_SIGN = 'APPROVE_TOKEN_SIGN';
export const TRANSACTION_ACTION_WAIT_FOR_APPROVAL = 'WAIT_FOR_APPROVAL';
export const TRANSACTION_ACTION_WAIT_FOR_SIGN_APPROVAL = 'WAIT_FOR_SIGN_APPROVAL';
export const TRANSACTION_ACTION_WAIT_FOR_SIMULATION = 'WAIT_FOR_SIMULATION';
export const TRANSACTION_ACTION_SWAP = 'SWAP';

export const TRANSACTION_ACTION_TYPES: Record<TransactionActionType, TransactionActionType> = {
  [TRANSACTION_ACTION_APPROVE_TOKEN]: TRANSACTION_ACTION_APPROVE_TOKEN,
  [TRANSACTION_ACTION_APPROVE_TOKEN_SIGN]: TRANSACTION_ACTION_APPROVE_TOKEN_SIGN,
  [TRANSACTION_ACTION_WAIT_FOR_APPROVAL]: TRANSACTION_ACTION_WAIT_FOR_APPROVAL,
  [TRANSACTION_ACTION_SWAP]: TRANSACTION_ACTION_SWAP,
  [TRANSACTION_ACTION_WAIT_FOR_SIGN_APPROVAL]: TRANSACTION_ACTION_WAIT_FOR_SIGN_APPROVAL,
  [TRANSACTION_ACTION_WAIT_FOR_SIMULATION]: TRANSACTION_ACTION_WAIT_FOR_SIMULATION,
};

export const TOKEN_BLACKLIST = [
  '0x5fe2b58c013d7601147dcdd68c143a77499f5531', // POLY - GRT
  '0x50b728d8d964fd00c2d0aad81718b71311fef68a', // POLY - SNX
  '0x65559aa14915a70190438ef90104769e5e890a00', // OE - ENS
  '0x289ba1701c2f088cf0faf8b3705246331cb8a839', // ARBI - LPT. Disabled due to liquidity decrease
  '0x1dd5629903441b2dd0d03f76ec7673add920e765', // POLY - jEUR. Disabled due to aave not supporting anymore
  '0x5d47baba0d66083c52009271faf3f50dcc01023c', // OP - UNIDEX. Disabled due to liquidity moved to velodrome
  '0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000', // OP - WTF optimism
  // TODO: Remove this once we check beefy works correctly
  '0x1a55d9164417856ad31df3705bbc263c380e56b1', // ARBI - GNS Beefy wrapper
  '0x78e30dfd5ef67fd414002ec6b4136a7a687c3c03', // ARBI - GMX Beefy wrapper
  '0xf0cbbfad265a0e7c7e4fd2e1e6027a8dfa25676b', // OP - WBTC Beefy wrapper
  '0x72b25ce2f946c95a2194f5ac3322443d0057bc94', // OP - DAI Beefy wrapper
  '0x185d3a08140efaeb3c6bf173e751afb0bcb0d0c6', // OP - USDC Beefy wrapper
  '0xb57f7f48b88ab6041e7d0a7ec28e8b4671094b12', // POLY - GNS optimism Beefy wrapper
  '0xaab6af05e12faae0a5d9597c79588846f0df15b8', // POLY - MVX optimism Beefy wrapper
];
