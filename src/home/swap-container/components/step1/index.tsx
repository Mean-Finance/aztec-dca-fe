import React from 'react';
import { Token, YieldOption } from 'types';
import { Grid } from '@mui/material';
import { BigNumber } from 'ethers';
import { StyledGrid } from '../../../../common/swap-container/styles';
import { TokenSelector } from './token-selector';
import { AmountInput } from './amount-input';
import { AvailableSwapInterval, FrecuencySelector } from './frecuency-selector';
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
  fromYield: YieldOption | null | undefined;
  fromCanHaveYield: boolean;
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
  } = props;

  return (
    <StyledGrid container rowSpacing={2} $show={show} ref={ref}>
      <Grid item xs={12}>
        <TokenSelector from={from} startSelectingCoin={startSelectingCoin} to={to} toggleFromTo={toggleFromTo} />
      </Grid>
      <Grid item xs={12}>
        <AmountInput
          cantFund={cantFund}
          from={from}
          fromValue={fromValue}
          fromValueUsdPrice={fromValueUsdPrice}
          handleFromValueChange={handleFromValueChange}
          balance={balance}
        />
      </Grid>
      <Grid item xs={12}>
        <FrecuencySelector
          frequencies={frequencies}
          frequencyType={frequencyType}
          frequencyValue={frequencyValue}
          handleFrequencyChange={handleFrequencyChange}
          setFrequencyType={setFrequencyType}
        />
      </Grid>

      <Grid item xs={12}>
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
      </Grid>
    </StyledGrid>
  );
});

export default SwapFirstStep;
