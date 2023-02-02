/* eslint-disable no-await-in-loop */
import { BigNumber, Signer } from 'ethers';
import { SafeAppWeb3Modal } from '@gnosis.pm/safe-apps-web3modal';
import { v4 as uuidv4 } from 'uuid';

// MOCKS
import { PositionVersions } from 'config/constants';
import { SwapOption, SwapOptionWithTx, Token } from 'types';
import { TransactionRequest } from '@ethersproject/providers';
import { toToken } from 'utils/currency';
import { getProtocolToken } from 'mocks/tokens';
import { QuoteResponse } from '@mean-finance/sdk/dist/services/quotes/types';
import { GasKeys, SwapSortOptions } from 'config/constants/aggregator';
import GraphqlService from './graphql';
import ContractService from './contractService';
import WalletService from './walletService';
import ProviderService from './providerService';
import SdkService from './sdkService';

export default class AggregatorService {
  modal: SafeAppWeb3Modal;

  signer: Signer;

  contractService: ContractService;

  walletService: WalletService;

  sdkService: SdkService;

  apolloClient: Record<PositionVersions, Record<number, GraphqlService>>;

  providerService: ProviderService;

  constructor(
    walletService: WalletService,
    contractService: ContractService,
    sdkService: SdkService,
    DCASubgraph: Record<PositionVersions, Record<number, GraphqlService>>,
    providerService: ProviderService
  ) {
    this.contractService = contractService;
    this.walletService = walletService;
    this.sdkService = sdkService;
    this.apolloClient = DCASubgraph;
    this.providerService = providerService;
  }

  getSigner() {
    return this.signer;
  }

  async addGasLimit(tx: TransactionRequest): Promise<TransactionRequest> {
    const gasUsed = await this.providerService.estimateGas(tx);

    return {
      ...tx,
      gasLimit: gasUsed.mul(BigNumber.from(130)).div(BigNumber.from(100)), // 30% more
    };
  }

  async swap(route: SwapOptionWithTx) {
    const transactionToSend = await this.addGasLimit(route.tx);

    return this.providerService.sendTransaction(transactionToSend);
  }

  async getSwapOptions(
    from: Token,
    to: Token,
    sellAmount?: BigNumber,
    buyAmount?: BigNumber,
    sorting?: SwapSortOptions,
    transferTo?: string | null,
    slippage?: number,
    gasSpeed?: GasKeys,
    takerAddress?: string,
    chainId?: number,
    disabledDexes?: string[]
  ) {
    const currentNetwork = await this.walletService.getNetwork();

    const isOnNetwork = !chainId || currentNetwork.chainId === chainId;
    let shouldValidate = !buyAmount && isOnNetwork;

    const network = chainId || currentNetwork.chainId;

    if (takerAddress && sellAmount) {
      // const preAllowanceTarget = await this.sdkService.getAllowanceTarget();
      // const allowance = await this.walletService.getSpecificAllowance(from, preAllowanceTarget);

      // if (parseUnits(allowance.allowance, from.decimals).lt(sellAmount)) {
      //   shouldValidate = false;
      // }

      if (shouldValidate) {
        // If user does not have the balance do not validate tx
        const balance = await this.walletService.getBalance(from.address);

        if (balance.lt(sellAmount)) {
          shouldValidate = false;
        }
      }
    }

    const swapOptionsResponse = await this.sdkService.getSwapOptions(
      from.address,
      to.address,
      sellAmount,
      buyAmount,
      sorting,
      transferTo,
      slippage,
      gasSpeed,
      takerAddress,
      !shouldValidate,
      network,
      disabledDexes
    );

    const filteredOptions = swapOptionsResponse.filter((option) => !('failed' in option)) as QuoteResponse[];

    const protocolToken = getProtocolToken(network);

    const sellToken = from.address === protocolToken.address ? protocolToken : toToken(from);
    const buyToken = to.address === protocolToken.address ? protocolToken : toToken(to);

    return filteredOptions.map<SwapOption>(
      ({
        sellAmount: {
          amount: sellAmountAmount,
          amountInUnits: sellAmountAmountInUnits,
          amountInUSD: sellAmountAmountInUsd,
        },
        buyAmount: {
          amount: buyAmountAmount,
          amountInUnits: buyAmountAmountInUnits,
          amountInUSD: buyAmountAmountInUsd,
        },
        maxSellAmount: {
          amount: maxSellAmountAmount,
          amountInUnits: maxSellAmountAmountInUnits,
          amountInUSD: maxSellAmountAmountInUsd,
        },
        minBuyAmount: {
          amount: minBuyAmountAmount,
          amountInUnits: minBuyAmountAmountInUnits,
          amountInUSD: minBuyAmountAmountInUsd,
        },
        gas: { estimatedGas, estimatedCost, estimatedCostInUnits, estimatedCostInUSD, gasTokenSymbol },
        source: { allowanceTarget, logoURI, name, id },
        type,
        tx,
      }) => ({
        id: uuidv4(),
        sellToken,
        buyToken,
        sellAmount: {
          amount: BigNumber.from(sellAmountAmount),
          amountInUnits: Number(sellAmountAmountInUnits),
          amountInUSD: sellAmountAmountInUsd || 0,
        },
        buyAmount: {
          amount: BigNumber.from(buyAmountAmount),
          amountInUnits: Number(buyAmountAmountInUnits),
          amountInUSD: buyAmountAmountInUsd || 0,
        },
        maxSellAmount: {
          amount: BigNumber.from(maxSellAmountAmount),
          amountInUnits: Number(maxSellAmountAmountInUnits),
          amountInUSD: maxSellAmountAmountInUsd || 0,
        },
        minBuyAmount: {
          amount: BigNumber.from(minBuyAmountAmount),
          amountInUnits: Number(minBuyAmountAmountInUnits),
          amountInUSD: minBuyAmountAmountInUsd || 0,
        },
        gas: {
          estimatedGas: BigNumber.from(estimatedGas),
          estimatedCost: BigNumber.from(estimatedCost),
          estimatedCostInUnits,
          estimatedCostInUSD: estimatedCostInUSD || 0,
          gasTokenSymbol,
        },
        swapper: {
          allowanceTarget,
          name,
          logoURI,
          id,
        },
        type,
        tx,
      })
    );
  }

  async getSwapOption(
    quote: SwapOption,
    takerAddress: string,
    transferTo?: string | null,
    slippage?: number,
    gasSpeed?: GasKeys,
    chainId?: number
  ) {
    const currentNetwork = await this.walletService.getNetwork();

    const isBuyOrder = quote.type === 'buy';

    const isOnNetwork = !chainId || currentNetwork.chainId === chainId;
    let shouldValidate = !isBuyOrder && isOnNetwork;

    const network = chainId || currentNetwork.chainId;

    if (takerAddress && !isBuyOrder) {
      // const preAllowanceTarget = await this.sdkService.getAllowanceTarget();
      // const allowance = await this.walletService.getSpecificAllowance(from, preAllowanceTarget);

      // if (parseUnits(allowance.allowance, from.decimals).lt(sellAmount)) {
      //   shouldValidate = false;
      // }

      if (shouldValidate) {
        // If user does not have the balance do not validate tx
        const balance = await this.walletService.getBalance(quote.sellToken.address);

        if (balance.lt(quote.sellAmount.amount)) {
          shouldValidate = false;
        }
      }
    }

    const swapOptionResponse = await this.sdkService.getSwapOption(
      quote,
      takerAddress,
      network,
      transferTo,
      slippage,
      gasSpeed,
      !shouldValidate
    );

    const { sellToken, buyToken } = quote;

    const {
      sellAmount: {
        amount: sellAmountAmount,
        amountInUnits: sellAmountAmountInUnits,
        amountInUSD: sellAmountAmountInUsd,
      },
      buyAmount: { amount: buyAmountAmount, amountInUnits: buyAmountAmountInUnits, amountInUSD: buyAmountAmountInUsd },
      maxSellAmount: {
        amount: maxSellAmountAmount,
        amountInUnits: maxSellAmountAmountInUnits,
        amountInUSD: maxSellAmountAmountInUsd,
      },
      minBuyAmount: {
        amount: minBuyAmountAmount,
        amountInUnits: minBuyAmountAmountInUnits,
        amountInUSD: minBuyAmountAmountInUsd,
      },
      gas: { estimatedGas, estimatedCost, estimatedCostInUnits, estimatedCostInUSD, gasTokenSymbol },
      source: { allowanceTarget, logoURI, name, id },
      type,
      tx,
    } = swapOptionResponse;

    return {
      id: uuidv4(),
      sellToken,
      buyToken,
      sellAmount: {
        amount: BigNumber.from(sellAmountAmount),
        amountInUnits: Number(sellAmountAmountInUnits),
        amountInUSD: sellAmountAmountInUsd || 0,
      },
      buyAmount: {
        amount: BigNumber.from(buyAmountAmount),
        amountInUnits: Number(buyAmountAmountInUnits),
        amountInUSD: buyAmountAmountInUsd || 0,
      },
      maxSellAmount: {
        amount: BigNumber.from(maxSellAmountAmount),
        amountInUnits: Number(maxSellAmountAmountInUnits),
        amountInUSD: maxSellAmountAmountInUsd || 0,
      },
      minBuyAmount: {
        amount: BigNumber.from(minBuyAmountAmount),
        amountInUnits: Number(minBuyAmountAmountInUnits),
        amountInUSD: minBuyAmountAmountInUsd || 0,
      },
      gas: {
        estimatedGas: BigNumber.from(estimatedGas),
        estimatedCost: BigNumber.from(estimatedCost),
        estimatedCostInUnits,
        estimatedCostInUSD: estimatedCostInUSD || 0,
        gasTokenSymbol,
      },
      swapper: {
        allowanceTarget,
        name,
        logoURI,
        id,
      },
      type,
      tx,
    };
  }
}

/* eslint-enable no-await-in-loop */