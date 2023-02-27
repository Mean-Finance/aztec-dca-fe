import React from 'react';
import { Token, YieldOption, YieldOptions } from 'types';
import { BigNumber } from 'ethers';
import { StyledGrid } from './styles';
import { TokenSelector } from './token-selector';
import { AmountInput } from './amount-input';
import { AvailableSwapInterval, FrecuencySelector } from './frecuency-selector';
import { YieldSelector } from './yield-selector';
import { Resume } from './resume';

interface SwapFirstStepProps {
  from: Token | null;
  fromValue: string;
  to: Token | null;
  show: boolean;
  frequencyType: BigNumber;
  frequencyValue: string;
  startSelectingCoin: (token: Token) => void;
  toggleFromTo: () => void;
  setFrequencyType: (newFrequencyType: BigNumber) => void;
  cantFund: boolean | null;
  handleFromValueChange: (newValue: string) => void;
  handleFrequencyChange: (newValue: string) => void;
  balance?: BigNumber;
  frequencies: AvailableSwapInterval[];
  buttonToShow: React.ReactNode;
  fromValueUsdPrice: number;
  rate: string;
  handleRateValueChange: (newValue: string) => void;
  rateUsdPrice: number;
  yieldEnabled: boolean;
  setYieldEnabled: (newValue: boolean) => void;
  yieldOptions: YieldOptions;
  isLoadingYieldOptions: boolean;
  fromYield: YieldOption | null | undefined;
  toYield: YieldOption | null | undefined;
  setFromYield: (newYield: null | YieldOption) => void;
  setToYield: (newYield: null | YieldOption) => void;
  fromCanHaveYield: boolean;
  usdPrice?: BigNumber;
  toCanHaveYield: boolean;
}

const SwapFirstStep = React.forwardRef<HTMLDivElement, SwapFirstStepProps>((props, ref) => {
  const {
    from,
    to,
    fromValue,
    toggleFromTo,
    setFrequencyType,
    frequencyType,
    frequencyValue,
    startSelectingCoin,
    cantFund,
    handleFromValueChange,
    balance,
    frequencies,
    handleFrequencyChange,
    buttonToShow,
    show,
    fromValueUsdPrice,
    rate,
    handleRateValueChange,
    rateUsdPrice,
    yieldEnabled,
    fromCanHaveYield,
    fromYield,
    usdPrice,
    isLoadingYieldOptions,
    setFromYield,
    setToYield,
    setYieldEnabled,
    toYield,
    yieldOptions,
    toCanHaveYield,
  } = props;

  return (
    <StyledGrid container rowSpacing={2} $show={show} ref={ref}>
      <TokenSelector from={from} startSelectingCoin={startSelectingCoin} to={to} toggleFromTo={toggleFromTo} />
      <AmountInput
        cantFund={cantFund}
        from={from}
        fromValue={fromValue}
        fromValueUsdPrice={fromValueUsdPrice}
        handleFromValueChange={handleFromValueChange}
        balance={balance}
      />
      <FrecuencySelector
        frequencies={frequencies}
        frequencyType={frequencyType}
        frequencyValue={frequencyValue}
        handleFrequencyChange={handleFrequencyChange}
        setFrequencyType={setFrequencyType}
      />
      {from && to ? (
        <YieldSelector
          frequencyType={frequencyType}
          from={from}
          fromCanHaveYield={fromCanHaveYield}
          fromYield={fromYield}
          isLoadingYieldOptions={isLoadingYieldOptions}
          rateUsdPrice={rateUsdPrice}
          setFromYield={setFromYield}
          setToYield={setToYield}
          setYieldEnabled={setYieldEnabled}
          to={to}
          yieldEnabled={yieldEnabled}
          yieldOptions={yieldOptions}
          toYield={toYield}
          usdPrice={usdPrice}
          toCanHaveYield={toCanHaveYield}
        />
      ) : null}
      <Resume
        buttonToShow={buttonToShow}
        from={from}
        frequencyType={frequencyType}
        frequencyValue={frequencyValue}
        handleFrequencyChange={handleFrequencyChange}
        rate={rate}
        handleRateValueChange={handleRateValueChange}
        rateUsdPrice={rateUsdPrice}
        fromYield={fromYield}
        fromCanHaveYield={fromCanHaveYield}
        yieldEnabled={yieldEnabled}
      />
    </StyledGrid>
  );
});

export default SwapFirstStep;
