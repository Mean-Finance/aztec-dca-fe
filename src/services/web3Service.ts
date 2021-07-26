import { ethers, Signer, BigNumber } from 'ethers';
import { Interface } from '@ethersproject/abi';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { formatEther, formatUnits, parseUnits } from '@ethersproject/units';
import Web3Modal, { getProviderInfo } from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Authereum from 'authereum';
import Torus from '@toruslabs/torus-embed';
import values from 'lodash/values';
import orderBy from 'lodash/orderBy';
import find from 'lodash/find';
import keyBy from 'lodash/keyBy';
import axios, { AxiosResponse } from 'axios';
import {
  GasNowResponse,
  CoinGeckoPriceResponse,
  Token,
  AvailablePairResponse,
  AvailablePairs,
  AvailablePair,
  PositionResponse,
  TransactionPositionTypeDataOptions,
  PoolResponse,
  Position,
  PositionRaw,
  PositionRawKeyBy,
  TransactionDetails,
  NewPositionTypeData,
  TerminatePositionTypeData,
  WithdrawTypeData,
  AddFundsTypeData,
  ModifySwapsPositionTypeData,
  NewPairTypeData,
  RemoveFundsTypeData,
  TokenList,
  ResetPositionTypeData,
  ModifyRateAndSwapsPositionTypeData,
} from 'types';
import { MaxUint256 } from '@ethersproject/constants';
import GET_AVAILABLE_PAIRS from 'graphql/getAvailablePairs.graphql';
import GET_TOKEN_LIST from 'graphql/getTokenList.graphql';
import GET_POSITIONS from 'graphql/getPositions.graphql';
import gqlFetchAll from 'utils/gqlFetchAll';
import gqlFetchAllById from 'utils/gqlFetchAllById';
import { sortTokens } from 'utils/parsing';

// ABIS
import ERC20ABI from 'abis/erc20.json';
import Factory from 'abis/factory.json';
import DCAPair from 'abis/DCAPair.json';

// MOCKS
import usedTokensMocks from 'mocks/usedTokens';
import { ETH } from 'mocks/tokens';
import { FULL_DEPOSIT_TYPE, RATE_TYPE, TRANSACTION_TYPES } from 'config/constants';

export const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS as string;

export default class Web3Service {
  client: ethers.providers.Web3Provider;
  modal: Web3Modal;
  signer: Signer;
  availablePairs: AvailablePairs;
  apolloClient: ApolloClient<NormalizedCacheObject>;
  uniClient: ApolloClient<NormalizedCacheObject>;
  account: string;
  setAccountCallback: React.Dispatch<React.SetStateAction<string>>;
  currentPositions: PositionRawKeyBy;
  pastPositions: PositionRawKeyBy;
  tokenList: TokenList;
  providerInfo: { id: string; logo: string; name: string };

  constructor(
    setAccountCallback?: React.Dispatch<React.SetStateAction<string>>,
    apolloClient?: ApolloClient<NormalizedCacheObject>,
    uniClient?: ApolloClient<NormalizedCacheObject>,
    client?: ethers.providers.Web3Provider,
    modal?: Web3Modal
  ) {
    if (apolloClient) {
      this.apolloClient = apolloClient;
    }

    if (uniClient) {
      this.uniClient = uniClient;
    }

    if (setAccountCallback) {
      this.setAccountCallback = setAccountCallback;
    }

    if (client) {
      this.client = client;
    }
    if (modal) {
      this.modal = modal;
    }
  }

  setClient(client: ethers.providers.Web3Provider) {
    this.client = client;
  }

  setSigner(signer: Signer) {
    this.signer = signer;
  }

  getClient() {
    return this.client;
  }

  getProviderInfo() {
    return this.providerInfo;
  }

  setModal(modal: Web3Modal) {
    this.modal = modal;
  }

  getModal() {
    return this.modal;
  }

  setAccount(account: string) {
    this.account = account;
    this.setAccountCallback(account);
  }

  async connect() {
    const provider = await this.modal?.connect();

    this.providerInfo = getProviderInfo(provider);
    // A Web3Provider wraps a standard Web3 provider, which is
    // what Metamask injects as window.ethereum into each page
    const ethersProvider = new ethers.providers.Web3Provider(provider);

    // The Metamask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = ethersProvider.getSigner();

    this.setClient(ethersProvider);
    this.setSigner(signer);

    const account = await this.signer.getAddress();

    if (window.ethereum) {
      // handle metamask account change
      window.ethereum.on('accountsChanged', (newAccounts: string[]) => {
        window.location.reload();
      });

      // extremely recommended by metamask
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    provider.on('network', (newNetwork: any, oldNetwork: any) => {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network

      if (oldNetwork) {
        window.location.reload();
      }
    });

    const currentPositionsResponse = await gqlFetchAll(
      this.apolloClient,
      GET_POSITIONS,
      {
        address: account.toLowerCase(),
        status: 'ACTIVE',
      },
      'positions',
      'network-only'
    );

    this.currentPositions = keyBy(
      currentPositionsResponse.data.positions.map((position: PositionResponse) => ({
        from: position.from.id,
        to: position.to.id,
        swapInterval: BigNumber.from(position.swapInterval.interval),
        swapped: BigNumber.from(position.totalSwapped),
        rate: BigNumber.from(position.current.rate),
        remainingLiquidity: BigNumber.from(position.current.remainingLiquidity),
        remainingSwaps: BigNumber.from(position.current.remainingSwaps),
        withdrawn: BigNumber.from(position.totalWithdrawn),
        totalSwaps: BigNumber.from(position.totalSwaps),
        dcaId: position.dcaId,
        id: position.id,
        status: position.status,
        startedAt: position.createdAtTimestamp,
        totalDeposits: BigNumber.from(position.totalDeposits),
        pendingTransaction: '',
      })),
      'id'
    );

    const pastPositionsResponse = await gqlFetchAll(
      this.apolloClient,
      GET_POSITIONS,
      {
        address: account.toLowerCase(),
        status: 'TERMINATED',
      },
      'positions',
      'network-only'
    );

    this.pastPositions = keyBy(
      pastPositionsResponse.data.positions.map((position: PositionResponse) => ({
        from: position.from.id,
        to: position.to.id,
        totalDeposits: BigNumber.from(position.totalDeposits),
        swapInterval: BigNumber.from(position.swapInterval.interval),
        swapped: BigNumber.from(position.totalSwapped),
        rate: BigNumber.from(position.current.rate),
        remainingLiquidity: BigNumber.from(position.current.remainingLiquidity),
        remainingSwaps: BigNumber.from(position.current.remainingSwaps),
        totalSwaps: BigNumber.from(position.totalSwaps),
        withdrawn: BigNumber.from(position.totalWithdrawn),
        dcaId: position.dcaId,
        id: position.id,
        status: position.status,
        startedAt: position.createdAtTimestamp,
        pedingTransaction: '',
      })),
      'id'
    );

    this.setAccount(account);
  }

  getNetwork() {
    return this.client.getNetwork();
  }

  getAccount() {
    return this.account;
  }

  getSigner() {
    return this.signer;
  }

  waitForTransaction(hash: string) {
    return this.client.waitForTransaction(hash);
  }

  async disconnect() {
    if (this.client && (this.client as any).disconnect) {
      await (this.client as any).disconnect();
    }

    if (this.client && (this.client as any).close) {
      await (this.client as any).close();
    }

    this.modal?.clearCachedProvider();

    this.setAccount('');

    this.setClient(new ethers.providers.Web3Provider({}));
  }

  async setUpModal() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: '5744aff1d49f4eee923c5f3e5af4cc1c', // required
        },
      },
      authereum: {
        package: Authereum, // required
      },
      torus: {
        package: Torus, // required
      },
    };

    const web3Modal = new Web3Modal({
      network: process.env.ETH_NETWORK, // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    this.setModal(web3Modal);

    if (web3Modal.cachedProvider) {
      await this.connect();
    }

    const availablePairsResponse = await gqlFetchAll(
      this.apolloClient,
      GET_AVAILABLE_PAIRS,
      {},
      'pairs',
      'network-only'
    );

    this.availablePairs = availablePairsResponse.data.pairs.map((pair: AvailablePairResponse) => ({
      token0: pair.tokenA.id,
      token1: pair.tokenB.id,
      lastExecuted: (pair.swaps && pair.swaps[0] && pair.swaps[0].executedAtTimestamp) || 0,
      id: pair.id,
      createdAt: pair.createdAtTimestamp,
    }));

    const tokenListResponse = await gqlFetchAllById(this.uniClient, GET_TOKEN_LIST, {}, 'pools');

    this.tokenList = tokenListResponse.data.pools.reduce((acc: TokenList, pool: PoolResponse) => {
      if (!acc[pool.token0.id]) {
        acc[pool.token0.id] = {
          decimals: BigNumber.from(pool.token0.decimals).toNumber(),
          address: pool.token0.id,
          name: pool.token0.name,
          symbol: pool.token0.symbol,
          pairableTokens: [],
        };
      }
      if (!acc[pool.token1.id]) {
        acc[pool.token1.id] = {
          decimals: BigNumber.from(pool.token1.decimals).toNumber(),
          address: pool.token1.id,
          name: pool.token1.name,
          symbol: pool.token1.symbol,
          pairableTokens: [],
        };
      }

      const availableTokensToken0 = [...acc[pool.token0.id].pairableTokens];
      const availableTokensToken1 = [...acc[pool.token1.id].pairableTokens];

      if (availableTokensToken0.indexOf(pool.token1.id) === -1) {
        availableTokensToken0.push(pool.token1.id);
      }
      if (availableTokensToken1.indexOf(pool.token0.id) === -1) {
        availableTokensToken1.push(pool.token0.id);
      }

      return {
        ...acc,
        [pool.token0.id]: {
          ...acc[pool.token0.id],
          pairableTokens: [...availableTokensToken0],
        },
        [pool.token1.id]: {
          ...acc[pool.token1.id],
          pairableTokens: [...availableTokensToken1],
        },
      };
    }, {});
  }

  getBalance(address?: string, decimals?: number) {
    if (!address) return Promise.resolve();

    if (address === ETH.address) return this.signer.getBalance();

    const ERC20Interface = new Interface(ERC20ABI) as any;

    const erc20 = new ethers.Contract(address, ERC20Interface, this.client);

    return erc20.balanceOf(this.getAccount());
  }

  getEstimatedPairCreation(token0?: string, token1?: string) {
    if (!token0 || !token1) return Promise.resolve();

    let tokenA = token0;
    let tokenB = token1;

    if (token0 > token1) {
      tokenA = token1;
      tokenB = token0;
    }

    const factory = new ethers.Contract(FACTORY_ADDRESS, Factory.abi, this.getSigner());

    return Promise.all([
      factory.estimateGas.createPair(tokenA, tokenB),
      axios.get<GasNowResponse>('https://www.gasnow.org/api/v3/gas/price'),
      axios.get<CoinGeckoPriceResponse>(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum&order=market_cap_desc&per_page=1&page=1&sparkline=false'
      ),
    ]).then((values: [BigNumber, AxiosResponse<GasNowResponse>, AxiosResponse<CoinGeckoPriceResponse>]) => {
      const [gasLimitRaw, gasPriceResponse, ethPriceResponse] = values;

      const gasLimit = BigNumber.from(gasLimitRaw);
      const gasPrice = BigNumber.from(gasPriceResponse.data.data.standard);
      const ethPrice = ethPriceResponse.data[0].current_price;

      const gas = gasLimit.mul(gasPrice);

      return {
        gas: formatUnits(gas, 'gwei'),
        gasUsd: parseFloat(formatEther(gas)) * ethPrice,
        gasEth: gas,
      };
    });
  }

  createPair(token0: string, token1: string) {
    if (!token0 || !token1) return Promise.resolve();

    let tokenA = token0;
    let tokenB = token1;

    if (token0 > token1) {
      tokenA = token1;
      tokenB = token0;
    }

    const factory = new ethers.Contract(FACTORY_ADDRESS, Factory.abi, this.getSigner());

    return factory.createPair(tokenA, tokenB);
  }

  getCurrentPositions() {
    return orderBy(values(this.currentPositions), 'startedAt', 'desc');
  }

  getPastPositions() {
    return orderBy(values(this.pastPositions), 'startedAt', 'desc');
  }

  getAvailablePairs() {
    return this.availablePairs;
  }

  getTokenList() {
    return this.tokenList;
  }

  getGasPrice() {
    return axios.get<GasNowResponse>('https://www.gasnow.org/api/v3/gas/price');
  }

  getUsedTokens() {
    return axios.get(
      `https://api.ethplorer.io/getAddressInfo/${this.getAccount()}?apiKey=${[process.env.ETHPLORER_KEY]}`
    );
  }

  getAllowance(token: Token, pairContract: AvailablePair) {
    if (token.address === ETH.address) return formatEther(MaxUint256);

    const ERC20Interface = new Interface(ERC20ABI) as any;

    const erc20 = new ethers.Contract(token.address, ERC20Interface, this.client);

    return erc20
      .allowance(this.getAccount(), pairContract.id)
      .then((allowance: string) => formatUnits(allowance, token.decimals));
  }

  approveToken(token: Token, pairContract: AvailablePair) {
    if (token.address === ETH.address) return Promise.resolve();

    const ERC20Interface = new Interface(ERC20ABI) as any;

    const erc20 = new ethers.Contract(token.address, ERC20Interface, this.getSigner());

    return erc20.approve(pairContract.id, MaxUint256);
  }

  deposit(
    from: Token,
    to: Token,
    fromValue: string,
    frequencyType: BigNumber,
    frequencyValue: string,
    existingPair: AvailablePair
  ) {
    let token = from;

    if (from > to) {
      token = to;
    }

    const weiValue = parseUnits(fromValue, token.decimals);

    const rate = weiValue.div(BigNumber.from(frequencyValue));
    const amountOfSwaps = BigNumber.from(frequencyValue);
    const swapInterval = frequencyType;

    const factory = new ethers.Contract(existingPair.id, DCAPair.abi, this.getSigner());

    return factory.deposit(token.address, rate, amountOfSwaps, swapInterval);
  }

  withdraw(position: Position, pair: AvailablePair) {
    const factory = new ethers.Contract(pair.id, DCAPair.abi, this.getSigner());

    return factory.withdrawSwapped(position.dcaId);
  }

  terminate(position: Position, pair: AvailablePair) {
    const factory = new ethers.Contract(pair.id, DCAPair.abi, this.getSigner());

    return factory.terminate(position.dcaId);
  }

  addFunds(position: Position, pair: AvailablePair, newDeposit: string) {
    const factory = new ethers.Contract(pair.id, DCAPair.abi, this.getSigner());

    const newRate = parseUnits(newDeposit, position.from.decimals)
      .add(position.remainingLiquidity)
      .div(BigNumber.from(position.remainingSwaps));

    return factory.modifyRateAndSwaps(position.dcaId, newRate, position.remainingSwaps);
  }

  resetPosition(position: Position, pair: AvailablePair, newDeposit: string, newSwaps: string) {
    const factory = new ethers.Contract(pair.id, DCAPair.abi, this.getSigner());

    const newRate = parseUnits(newDeposit, position.from.decimals)
      .add(position.remainingLiquidity)
      .div(BigNumber.from(newSwaps));

    return factory.modifyRateAndSwaps(position.dcaId, newRate, newSwaps);
  }

  modifySwaps(position: Position, pair: AvailablePair, newSwaps: string) {
    const factory = new ethers.Contract(pair.id, DCAPair.abi, this.getSigner());

    const newRate = position.remainingLiquidity.div(BigNumber.from(newSwaps));

    return factory.modifyRateAndSwaps(position.dcaId, newRate, newSwaps);
  }

  modifyRate(position: Position, pair: AvailablePair, newRate: string) {
    const factory = new ethers.Contract(pair.id, DCAPair.abi, this.getSigner());

    return factory.modifyRateAndSwaps(
      position.dcaId,
      parseUnits(newRate, position.from.decimals),
      position.remainingSwaps
    );
  }

  modifyRateAndSwaps(position: Position, pair: AvailablePair, newRate: string, newSwaps: string) {
    const factory = new ethers.Contract(pair.id, DCAPair.abi, this.getSigner());

    return factory.modifyRateAndSwaps(position.dcaId, parseUnits(newRate, position.from.decimals), newSwaps);
  }

  removeFunds(position: Position, pair: AvailablePair, ammountToRemove: string) {
    const factory = new ethers.Contract(pair.id, DCAPair.abi, this.getSigner());

    const newRate = parseUnits(ammountToRemove, position.from.decimals).eq(position.remainingLiquidity)
      ? position.rate
      : position.remainingLiquidity
          .sub(parseUnits(ammountToRemove, position.from.decimals))
          .div(BigNumber.from(position.remainingSwaps));

    return factory.modifyRateAndSwaps(
      position.dcaId,
      newRate,
      parseUnits(ammountToRemove, position.from.decimals).eq(position.remainingLiquidity) ? 0 : position.remainingSwaps
    );
  }

  getTransactionReceipt(txHash: string) {
    return this.client.getTransactionReceipt(txHash);
  }

  getBlockNumber() {
    return this.client.getBlockNumber();
  }

  onBlock(callback: (blockNumber: number) => void) {
    return this.client.on('block', callback);
  }

  removeOnBlock() {
    return this.client.off('block');
  }

  setPendingTransaction(transaction: TransactionDetails) {
    if (transaction.type === TRANSACTION_TYPES.NEW_PAIR || transaction.type === TRANSACTION_TYPES.APPROVE_TOKEN) return;

    const typeData = transaction.typeData as TransactionPositionTypeDataOptions;
    let id = typeData.id;
    if (transaction.type === TRANSACTION_TYPES.NEW_POSITION) {
      const newPositionTypeData = typeData as NewPositionTypeData;
      id = `pending-transaction-${transaction.hash}`;
      this.currentPositions[id] = {
        from: newPositionTypeData.from.address,
        to: newPositionTypeData.to.address,
        swapInterval: BigNumber.from(newPositionTypeData.frequencyType),
        swapped: BigNumber.from(0),
        rate: parseUnits(newPositionTypeData.fromValue, newPositionTypeData.from.decimals).div(
          BigNumber.from(newPositionTypeData.frequencyValue)
        ),
        remainingLiquidity: parseUnits(newPositionTypeData.fromValue, newPositionTypeData.from.decimals),
        remainingSwaps: BigNumber.from(newPositionTypeData.frequencyValue),
        totalSwaps: BigNumber.from(newPositionTypeData.frequencyValue),
        withdrawn: BigNumber.from(0),
        dcaId: newPositionTypeData.id as number,
        id: id,
        startedAt: newPositionTypeData.startedAt,
        totalDeposits: parseUnits(newPositionTypeData.fromValue, newPositionTypeData.from.decimals),
        pendingTransaction: '',
        status: 'ACTIVE',
      };
    }

    this.currentPositions[id].pendingTransaction = transaction.hash;
  }

  handleTransaction(transaction: TransactionDetails) {
    switch (transaction.type) {
      case TRANSACTION_TYPES.NEW_POSITION:
        const newPositionTypeData = transaction.typeData as NewPositionTypeData;
        const newId = `${newPositionTypeData.existingPair.id}-${newPositionTypeData.id}`;
        this.currentPositions[newId] = {
          ...this.currentPositions[`pending-transaction-${transaction.hash}`],
          pendingTransaction: '',
          id: newId,
        };
        delete this.currentPositions[`pending-transaction-${transaction.hash}`];
        break;
      case TRANSACTION_TYPES.TERMINATE_POSITION:
        const terminatePositionTypeData = transaction.typeData as TerminatePositionTypeData;
        this.pastPositions[terminatePositionTypeData.id] = {
          ...this.currentPositions[terminatePositionTypeData.id],
          pendingTransaction: '',
        };
        delete this.currentPositions[terminatePositionTypeData.id];
        break;
      case TRANSACTION_TYPES.WITHDRAW_POSITION:
        const withdrawPositionTypeData = transaction.typeData as WithdrawTypeData;
        this.currentPositions[withdrawPositionTypeData.id].pendingTransaction = '';
        this.currentPositions[withdrawPositionTypeData.id].withdrawn = this.currentPositions[
          withdrawPositionTypeData.id
        ].withdrawn.add(this.currentPositions[withdrawPositionTypeData.id].swapped);
        break;
      case TRANSACTION_TYPES.ADD_FUNDS_POSITION:
        const addFundsTypeData = transaction.typeData as AddFundsTypeData;
        this.currentPositions[addFundsTypeData.id].pendingTransaction = '';
        this.currentPositions[addFundsTypeData.id].remainingLiquidity = this.currentPositions[
          addFundsTypeData.id
        ].remainingLiquidity.add(parseUnits(addFundsTypeData.newFunds, addFundsTypeData.decimals));
        this.currentPositions[addFundsTypeData.id].rate = this.currentPositions[
          addFundsTypeData.id
        ].remainingLiquidity.div(this.currentPositions[addFundsTypeData.id].remainingSwaps);
        break;
      case TRANSACTION_TYPES.RESET_POSITION:
        const resetPositionTypeData = transaction.typeData as ResetPositionTypeData;
        this.currentPositions[resetPositionTypeData.id].pendingTransaction = '';
        this.currentPositions[resetPositionTypeData.id].remainingLiquidity = this.currentPositions[
          resetPositionTypeData.id
        ].remainingLiquidity.add(parseUnits(resetPositionTypeData.newFunds, resetPositionTypeData.decimals));
        this.currentPositions[resetPositionTypeData.id].remainingSwaps = this.currentPositions[
          resetPositionTypeData.id
        ].remainingSwaps.add(BigNumber.from(resetPositionTypeData.newSwaps));
        this.currentPositions[resetPositionTypeData.id].rate = this.currentPositions[
          resetPositionTypeData.id
        ].remainingLiquidity.div(this.currentPositions[resetPositionTypeData.id].remainingSwaps);
        break;
      case TRANSACTION_TYPES.REMOVE_FUNDS:
        const removeFundsTypeData = transaction.typeData as RemoveFundsTypeData;
        this.currentPositions[removeFundsTypeData.id].pendingTransaction = '';
        this.currentPositions[removeFundsTypeData.id].remainingLiquidity = this.currentPositions[
          removeFundsTypeData.id
        ].remainingLiquidity.sub(parseUnits(removeFundsTypeData.ammountToRemove, removeFundsTypeData.decimals));
        this.currentPositions[removeFundsTypeData.id].rate = this.currentPositions[
          removeFundsTypeData.id
        ].remainingLiquidity.div(this.currentPositions[removeFundsTypeData.id].remainingSwaps);
        break;
      case TRANSACTION_TYPES.MODIFY_SWAPS_POSITION:
        const modifySwapsPositionTypeData = transaction.typeData as ModifySwapsPositionTypeData;
        this.currentPositions[modifySwapsPositionTypeData.id].pendingTransaction = '';
        this.currentPositions[modifySwapsPositionTypeData.id].remainingSwaps = BigNumber.from(
          modifySwapsPositionTypeData.newSwaps
        );
        this.currentPositions[modifySwapsPositionTypeData.id].rate = this.currentPositions[
          modifySwapsPositionTypeData.id
        ].remainingLiquidity.div(this.currentPositions[modifySwapsPositionTypeData.id].remainingSwaps);
        break;
      case TRANSACTION_TYPES.MODIFY_RATE_AND_SWAPS_POSITION:
        const modifyRateAndSwapsPositionTypeData = transaction.typeData as ModifyRateAndSwapsPositionTypeData;
        this.currentPositions[modifyRateAndSwapsPositionTypeData.id].pendingTransaction = '';
        this.currentPositions[modifyRateAndSwapsPositionTypeData.id].rate = parseUnits(
          modifyRateAndSwapsPositionTypeData.newRate,
          modifyRateAndSwapsPositionTypeData.decimals
        );
        this.currentPositions[modifyRateAndSwapsPositionTypeData.id].remainingSwaps = BigNumber.from(
          modifyRateAndSwapsPositionTypeData.newSwaps
        );
        this.currentPositions[modifyRateAndSwapsPositionTypeData.id].remainingLiquidity = this.currentPositions[
          modifyRateAndSwapsPositionTypeData.id
        ].rate.mul(this.currentPositions[modifyRateAndSwapsPositionTypeData.id].remainingSwaps);
        break;
      case TRANSACTION_TYPES.NEW_PAIR:
        const newPairTypeData = transaction.typeData as NewPairTypeData;
        const [token0, token1] = sortTokens(newPairTypeData.token0, newPairTypeData.token1);
        this.availablePairs.push({
          token0,
          token1,
          id: newPairTypeData.id as string,
          lastExecutedAt: 0,
          createdAt: Math.floor(Date.now() / 1000),
        });
        break;
    }
  }

  parseLog(log: any, pairContract: AvailablePair) {
    const factory = new ethers.Contract(pairContract.id, DCAPair.abi, this.getSigner());

    return factory.interface.parseLog(log);
  }
}
