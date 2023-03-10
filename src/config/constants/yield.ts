import { YieldOption } from 'types';
import { emptyTokenWithAddress } from 'utils/currency';
import { NETWORKS } from './addresses';

export const MINIMUM_USD_RATE_FOR_YIELD: Record<number, number> = {
  [NETWORKS.polygon.chainId]: 1,
  [NETWORKS.optimism.chainId]: 5,
  [NETWORKS.arbitrum.chainId]: 5,
  [NETWORKS.mainnet.chainId]: 15,
};

export const DEFAULT_MINIMUM_USD_RATE_FOR_YIELD = 5;

export const DISABLED_YIELDS = [
  '0x2bcf2a8c5f9f8b45ece5ba11d8539780fc15cb11', // POLYGON - CRV
  '0x1dd5629903441b2dd0d03f76ec7673add920e765', // POLYGON - jEUR
  '0x0669cec75e88f721efbe7d78d1783786a2f36bfe', // ARBITRUM - LINK
  '0x4b6e42407db855fb101b9d39e084e36c90a52652', // ARBITRUM - WETH
];

const BASE_YIELDS_PER_CHAIN: Record<number, Pick<YieldOption, 'id' | 'poolId' | 'name' | 'token' | 'tokenAddress'>[]> =
  Object.keys(NETWORKS).reduce((acc, key) => ({ ...acc, [NETWORKS[key].chainId]: [] }), {});

export const ALLOWED_YIELDS: Record<number, Pick<YieldOption, 'id' | 'poolId' | 'name' | 'token' | 'tokenAddress'>[]> =
  {
    ...BASE_YIELDS_PER_CHAIN,
    [NETWORKS.polygon.chainId]: [
      {
        id: '37b04faa-95bb-4ccb-9c4e-c70fa167342b', // aave-v3 USDC
        tokenAddress: '0xe3e5e1946d6e4d8a5e5f155b6e059a2ca7c43c58', // aave-v3 USDC
        poolId: '37b04faa-95bb-4ccb-9c4e-c70fa167342b', // aave-v3 USDC
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: '2b9bf1c6-a018-4e93-a32f-7cf6ccd311fc', // aave-v3 WETH
        tokenAddress: '0xa7a7ffe0520e90491e58c9c77f78d7cfc32d019e', // aave-v3 WETH
        poolId: '2b9bf1c6-a018-4e93-a32f-7cf6ccd311fc', // aave-v3 WETH
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: '58d18059-f1d1-45ed-acd3-f386e98cc506', // aave-v3 WBTC
        tokenAddress: '0x42474cdc4a9d9c06e91c745984dd319c1f107f9a', // aave-v3 WBTC
        poolId: '58d18059-f1d1-45ed-acd3-f386e98cc506', // aave-v3 WBTC
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: 'f67c3baa-613a-409e-940e-5366f474871b', // aave-v3 WMATIC
        tokenAddress: '0x021c618f299e0f55e8a684898b03b027eb51df5c', // aave-v3 WMATIC
        poolId: 'f67c3baa-613a-409e-940e-5366f474871b', // aave-v3 WMATIC
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: '3c14db00-4252-40aa-a430-9c756e8dce71', // aave-v3 GHST
        tokenAddress: '0x83c0936d916d036f99234fa35de12988abd66a7f', // aave-v3 GHST
        poolId: '3c14db00-4252-40aa-a430-9c756e8dce71', // aave-v3 GHST
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: 'c57bdc97-3100-41ff-845f-075363f6f5a4', // aave-v3 DAI
        tokenAddress: '0x6e6bbc7b9fe1a8e5b9f27cc5c6478f65f120fe52', // aave-v3 DAI
        poolId: 'c57bdc97-3100-41ff-845f-075363f6f5a4', // aave-v3 DAI
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: '7e7821a2-3d20-4ae7-9c3d-04cd57904555', // aave-v3 USDT
        tokenAddress: '0x018532fde0251473f3bc379e133cdb508c412eed', // aave-v3 USDT
        poolId: '7e7821a2-3d20-4ae7-9c3d-04cd57904555', // aave-v3 USDT
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: 'de9b0b53-a6fc-4ff3-a9a7-065dfc1f998b', // aave-v3 AAVE
        tokenAddress: '0xcc0da22f5e89a7401255682b2e2e74edd4c62fc4', // aave-v3 AAVE
        poolId: 'de9b0b53-a6fc-4ff3-a9a7-065dfc1f998b', // aave-v3 AAVE
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: '995a6317-1c32-48c2-a8c9-683263b8412e', // aave-v3 LINK
        tokenAddress: '0x5e474399c0d3da173a76ad6676f3c32c97babeaf', // aave-v3 LINK
        poolId: '995a6317-1c32-48c2-a8c9-683263b8412e', // aave-v3 LINK
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: 'c6ec5219-e39b-46f2-9ec2-5a61de562957', // aave-v3 jEUR
        tokenAddress: '0x1dd5629903441b2dd0d03f76ec7673add920e765', // aave-v3 jEUR
        poolId: 'c6ec5219-e39b-46f2-9ec2-5a61de562957', // aave-v3 jEUR
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: '6ee54ffc-6ede-45a8-b35f-60aca8cc4176', // aave-v3 agEUR
        tokenAddress: '0xc0b8d48064b9137858ccc2d6c07b7432aae2aa90', // aave-v3 agEUR
        poolId: '6ee54ffc-6ede-45a8-b35f-60aca8cc4176', // aave-v3 agEUR
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: 'e95cadc3-0ea7-4932-9b80-a8baba80eff4', // aave-v3 EURS
        tokenAddress: '0x53e41d76892c681ef0d10df5a0262a3791b771ab', // aave-v3 EURS
        poolId: 'e95cadc3-0ea7-4932-9b80-a8baba80eff4', // aave-v3 EURS
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: '0e863358-7fc0-4290-b05e-071b80eac40a', // aave-v3 CRV
        tokenAddress: '0x2bcf2a8c5f9f8b45ece5ba11d8539780fc15cb11', // aave-v3 CRV
        poolId: '0e863358-7fc0-4290-b05e-071b80eac40a', // aave-v3 CRV
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: 'a5e57d75-82ce-490a-b44e-d426dd3338f7', // aave-v3 SUSHI
        tokenAddress: '0xbf3df32b05efc5d5a084fbe4d2076fbc3ce88f00', // aave-v3 SUSHI
        poolId: 'a5e57d75-82ce-490a-b44e-d426dd3338f7', // aave-v3 SUSHI
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: 'bec16af1-350f-4b16-bf83-908f4f12df73', // aave-v3 BAL
        tokenAddress: '0x68f677e667dac3b29c646f44a154dec80db6e811', // aave-v3 BAL
        poolId: 'bec16af1-350f-4b16-bf83-908f4f12df73', // aave-v3 BAL
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      // {
      //   id: '59447a2f-7c4d-433a-a84b-ac6e53986680', // aave-v3 DPI
      //   // TODO: put real address
      //   tokenAddress: '0x724dc807b04555b71ed48a6896b6f41593b8c637', // aave-v3 DPI
      //   poolId: '59447a2f-7c4d-433a-a84b-ac6e53986680', // aave-v3 DPI
      //   name: 'Aave V3',
      //   token: emptyTokenWithAddress('AAVE'),
      // },
      {
        id: '1a8a5716-bb77-4baf-a2d9-ba3bebc6652a', // aave-v3 miMATIC
        tokenAddress: '0x25ad39beee8ddc8d6503ef84881426b65e52c640', // aave-v3 miMATIC
        poolId: '1a8a5716-bb77-4baf-a2d9-ba3bebc6652a', // aave-v3 miMATIC
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      // {
      //   id: '388e73cb-1ea5-4cd3-9426-fdb40762c930', // beefy GNS
      //   tokenAddress: '0xb57f7f48b88ab6041e7d0a7ec28e8b4671094b12', // beefy GNS
      //   poolId: '388e73cb-1ea5-4cd3-9426-fdb40762c930', // beefy GNS
      //   name: 'Beefy',
      //   token: emptyTokenWithAddress('BEEFY'),
      // },
      // {
      //   id: 'fe084859-2384-4daf-86ec-63f5f8dcdaaa', // beefy MVX TODO: MISSING IN DEFILLAMA
      //   tokenAddress: '0xaab6af05e12faae0a5d9597c79588846f0df15b8', // beefy MVX
      //   poolId: 'fe084859-2384-4daf-86ec-63f5f8dcdaaa', // beefy MVX
      //   name: 'Beefy',
      //   token: emptyTokenWithAddress('AAVE'),
      // },
    ],
    [NETWORKS.optimism.chainId]: [
      {
        id: '24762515-822a-46af-927c-77a1dc449bd0', // aave-v3 USDC
        tokenAddress: '0xfe7296c374d996d09e2ffe533eeb85d1896e1b14', // aave-v3 USDC
        poolId: '24762515-822a-46af-927c-77a1dc449bd0', // aave-v3 USDC
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: '3e332a41-3a15-41bc-8d5c-438c09609349', // aave-v3 WETH
        tokenAddress: '0xdfc636088b4f73f6bda2e9c31e7ffebf4e3646e9', // aave-v3 WETH
        poolId: '3e332a41-3a15-41bc-8d5c-438c09609349', // aave-v3 WETH
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: '363e5586-cfee-402c-9b0b-be70366052e8', // aave-v3 DAI
        tokenAddress: '0x4a29af8683ffc6259beccfd583134a0d13be535c', // aave-v3 DAI
        poolId: '363e5586-cfee-402c-9b0b-be70366052e8', // aave-v3 DAI
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: 'e053590b-54f1-40aa-ae0d-14e701ca734c', // aave-v3 WBTC
        tokenAddress: '0x4f8424ba880b109c31ce8c5eefc4b82b8897eec0', // aave-v3 WBTC
        poolId: 'e053590b-54f1-40aa-ae0d-14e701ca734c', // aave-v3 WBTC
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: 'bde08c85-41c5-4d80-9bb1-0835a4352efa', // aave-v3 USDT
        tokenAddress: '0x58ffcdac112d0c0f7b6ac38fb15d178b83663249', // aave-v3 USDT
        poolId: 'bde08c85-41c5-4d80-9bb1-0835a4352efa', // aave-v3 USDT
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: '7fc727a5-813c-405f-96d6-dd8b23f31e1b', // aave-v3 AAVE
        tokenAddress: '0xda9a381bcbd9173cc841109840feed4d8d7dcb3b', // aave-v3 AAVE
        poolId: '7fc727a5-813c-405f-96d6-dd8b23f31e1b', // aave-v3 AAVE
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: 'fa740a7c-430b-4521-8890-22b22e601be6', // aave-v3 sUSDC
        tokenAddress: '0x329c754e060c17542f34bf3287c70bfaad7d288a', // aave-v3 sUSDC
        poolId: 'fa740a7c-430b-4521-8890-22b22e601be6', // aave-v3 sUSDC
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: 'fe084859-2384-4daf-86ec-63f5f8dcdaaa', // aave-v3 LINK
        tokenAddress: '0x8127ce8a7055e2e99c94aee6e20ffc2bdb3770a8', // aave-v3 LINK
        poolId: 'fe084859-2384-4daf-86ec-63f5f8dcdaaa', // aave-v3 LINK
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      // {
      //   id: 'e5f45aa7-437e-4c35-8beb-9012bab859c5', // beefy WBTC
      //   tokenAddress: '0xf0cbbfad265a0e7c7e4fd2e1e6027a8dfa25676b', // beefy WBTC
      //   poolId: 'e5f45aa7-437e-4c35-8beb-9012bab859c5', // beefy WBTC
      //   name: 'Beefy',
      //   token: emptyTokenWithAddress('BEEFY'),
      // },
      // {
      //   id: '248c7b16-a0dc-46a6-a0c0-5d38017e2f86', // beefy DAI
      //   tokenAddress: '0x72b25ce2f946c95a2194f5ac3322443d0057bc94', // beefy DAI
      //   poolId: '248c7b16-a0dc-46a6-a0c0-5d38017e2f86', // beefy DAI
      //   name: 'Beefy',
      //   token: emptyTokenWithAddress('BEEFY'),
      // },
      // {
      //   id: '09a8f967-f675-4bd2-a3e8-98b43fe20382', // beefy USDC
      //   tokenAddress: '0x185d3a08140efaeb3c6bf173e751afb0bcb0d0c6', // beefy USDC
      //   poolId: '09a8f967-f675-4bd2-a3e8-98b43fe20382', // beefy USDC
      //   name: 'Beefy',
      //   token: emptyTokenWithAddress('BEEFY'),
      // },
    ],
    [NETWORKS.arbitrum.chainId]: [
      {
        id: '7aab7b0f-01c1-4467-bc0d-77826d870f19', // aave-v3 USDC
        tokenAddress: '0x2285b7dc4426c29ed488c65c72a9feaadb44c7ae', // aave-v3 USDC
        poolId: '7aab7b0f-01c1-4467-bc0d-77826d870f19', // aave-v3 USDC
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: '43644487-e26c-450c-8bcb-fb10c1e512e0', // aave-v3 LINK
        tokenAddress: '0x0669cec75e88f721efbe7d78d1783786a2f36bfe', // aave-v3 LINK
        poolId: '43644487-e26c-450c-8bcb-fb10c1e512e0', // aave-v3 LINK
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: 'e302de4d-952e-4e18-9749-0a9dc86e98bc', // aave-v3 WETH
        tokenAddress: '0x4b6e42407db855fb101b9d39e084e36c90a52652', // aave-v3 WETH
        poolId: 'e302de4d-952e-4e18-9749-0a9dc86e98bc', // aave-v3 WETH
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: 'a8e3d841-2788-4647-ad54-5a36fac451b1', // aave-v3 DAI
        tokenAddress: '0x30303a134e1850f1eda2e36dad15d052402131a7', // aave-v3 DAI
        poolId: 'a8e3d841-2788-4647-ad54-5a36fac451b1', // aave-v3 DAI
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: '7c5e69a4-2430-4fa2-b7cb-857f79d7d1bf', // aave-v3 WBTC
        tokenAddress: '0x9ca453e4585d1acde7bd13f7da2294cfaaec4376', // aave-v3 WBTC
        poolId: '7c5e69a4-2430-4fa2-b7cb-857f79d7d1bf', // aave-v3 WBTC
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      {
        id: '3a6cc030-738d-4e19-8a40-e63e9c4d5a6f', // aave-v3 USDT
        tokenAddress: '0x8fd68006d23df27fc36d3e3eda1fdcc4f0baa8c6', // aave-v3 USDT
        poolId: '3a6cc030-738d-4e19-8a40-e63e9c4d5a6f', // aave-v3 USDT
        name: 'Aave V3',
        token: emptyTokenWithAddress('AAVE'),
      },
      // {
      //   id: '388e73cb-1ea5-4cd3-9426-fdb40762c930', // beefy GNS
      //   tokenAddress: '0x1a55d9164417856ad31df3705bbc263c380e56b1', // beefy GNS
      //   poolId: '388e73cb-1ea5-4cd3-9426-fdb40762c930', // beefy GNS
      //   name: 'Beefy',
      //   token: emptyTokenWithAddress('BEEFY'),
      // },
      // {
      //   id: 'ba935cb2-a371-4f2b-9bd3-9881a995d68f', // beefy GMX
      //   tokenAddress: '0x78e30dfd5ef67fd414002ec6b4136a7a687c3c03', // beefy GMX
      //   poolId: 'ba935cb2-a371-4f2b-9bd3-9881a995d68f', // beefy GMX
      //   name: 'Beefy',
      //   token: emptyTokenWithAddress('BEEFY'),
      // },
    ],
    [NETWORKS.mainnet.chainId]: [
      {
        id: '61b7623c-9ac2-4a73-a748-8db0b1c8c5bc', // euler USDC
        tokenAddress: '0xcd0e5871c97c663d43c62b5049c123bb45bfe2cc', // euler USDC
        poolId: '61b7623c-9ac2-4a73-a748-8db0b1c8c5bc', // euler USDC
        name: 'Euler',
        token: emptyTokenWithAddress('EULER'),
      },
      {
        id: '618ddb92-fe0d-41e6-bdbe-e00d2a721055', // euler WETH
        tokenAddress: '0xd4de9d2fc1607d1df63e1c95ecbfa8d7946f5457', // euler WETH
        poolId: '618ddb92-fe0d-41e6-bdbe-e00d2a721055', // euler WETH
        name: 'Euler',
        token: emptyTokenWithAddress('EULER'),
      },
      {
        id: 'c256de58-4176-49f9-99af-f48226573bb5', // euler DAI
        tokenAddress: '0xc4113b7605d691e073c162809060b6c5ae402f1e', // euler DAI
        poolId: 'c256de58-4176-49f9-99af-f48226573bb5', // euler DAI
        name: 'Euler',
        token: emptyTokenWithAddress('EULER'),
      },
      {
        id: '62be2bfe-80c8-484c-836b-a5fe97634e92', // euler WBTC
        tokenAddress: '0x48e345cb84895eab4db4c44ff9b619ca0be671d9', // euler WBTC
        poolId: '62be2bfe-80c8-484c-836b-a5fe97634e92', // euler WBTC
        name: 'Euler',
        token: emptyTokenWithAddress('EULER'),
      },
    ],
  };
