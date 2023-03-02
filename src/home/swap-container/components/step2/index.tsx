import React from 'react';
import styled from 'styled-components';
import Grid from '@mui/material/Grid';
import isUndefined from 'lodash/isUndefined';
import { DateTime } from 'luxon';
import { AvailablePair, Token, YieldOption, YieldOptions } from 'types';
import Typography from '@mui/material/Typography';
import { FormattedMessage, useIntl } from 'react-intl';
import TokenInput from 'common/token-input';
import FrequencyInput from 'common/frequency-easy-input';
import { STRING_SWAP_INTERVALS, SWAP_INTERVALS_MAP } from 'config/constants';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from 'common/button';
import { BigNumber } from 'ethers';
import findIndex from 'lodash/findIndex';
import {
  StyledContentContainer,
  StyledGrid,
  StyledInputContainer,
  StyledSummaryContainer,
} from 'common/swap-container/styles';
import { YieldSelector } from './yield-selector';

const StyledNextSwapContainer = styled.div`
  display: flex;
  margin-top: 5px;
`;

interface SwapSecondStepProps {
  from: Token | null;
  to: Token | null;
  fromValue: string;
  handleFromValueChange: (newValue: string) => void;
  rate: string;
  handleRateValueChange: (newValue: string) => void;
  frequencyType: BigNumber;
  frequencyValue: string;
  fromCanHaveYield: boolean;
  toCanHaveYield: boolean;
  handleFrequencyChange: (newValue: string) => void;
  buttonToShow: React.ReactNode;
  show: boolean;
  onBack: () => void;
  fromValueUsdPrice: number;
  rateUsdPrice: number;
  usdPrice?: BigNumber;
  yieldEnabled: boolean;
  setYieldEnabled: (newValue: boolean) => void;
  yieldOptions: YieldOptions;
  isLoadingYieldOptions: boolean;
  fromYield: YieldOption | null | undefined;
  toYield: YieldOption | null | undefined;
  setFromYield: (newYield: null | YieldOption) => void;
  setToYield: (newYield: null | YieldOption) => void;
  existingPair?: AvailablePair;
}

const SwapSecondStep = React.forwardRef<HTMLDivElement, SwapSecondStepProps>((props, ref) => {
  const {
    from,
    to,
    fromValue,
    handleFromValueChange,
    rate,
    handleRateValueChange,
    frequencyType,
    frequencyValue,
    handleFrequencyChange,
    buttonToShow,
    show,
    onBack,
    fromValueUsdPrice,
    rateUsdPrice,
    yieldEnabled,
    setYieldEnabled,
    yieldOptions,
    isLoadingYieldOptions,
    fromYield,
    toYield,
    setFromYield,
    setToYield,
    fromCanHaveYield,
    usdPrice,
    existingPair,
    toCanHaveYield,
  } = props;

  const freqIndex = findIndex(SWAP_INTERVALS_MAP, { value: frequencyType });

  const nextSwapAvailableAt = existingPair?.nextSwapAvailableAt[freqIndex];

  const showNextSwapAvailableAt = !yieldEnabled || (yieldEnabled && !isUndefined(fromYield) && !isUndefined(toYield));

  const intl = useIntl();

  return (
    <StyledGrid $show={show} container rowSpacing={2} ref={ref}>
      <Grid item xs={12}>
        <Button variant="text" color="default" onClick={onBack}>
          <Typography variant="h6" component="div" style={{ display: 'flex', alignItems: 'center' }}>
            <ArrowBackIcon fontSize="inherit" />{' '}
            <FormattedMessage description="backToSwap" defaultMessage="Back to create position" />
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <StyledContentContainer>
          <StyledSummaryContainer>
            <Typography variant="body1" component="span">
              <FormattedMessage description="invest detail" defaultMessage="You'll invest" />
            </Typography>
            <StyledInputContainer>
              <TokenInput
                id="from-minimal-value"
                value={fromValue || '0'}
                onChange={handleFromValueChange}
                withBalance={false}
                token={from}
                isMinimal
                maxWidth="210px"
                usdValue={fromValueUsdPrice.toFixed(2)}
              />
            </StyledInputContainer>
          </StyledSummaryContainer>
          <StyledSummaryContainer>
            <Typography variant="body1" component="span">
              <FormattedMessage description="rate detail" defaultMessage="We'll swap" />
            </Typography>
            <StyledInputContainer>
              <TokenInput
                id="rate-value"
                value={rate}
                onChange={handleRateValueChange}
                withBalance={false}
                token={from}
                isMinimal
                usdValue={rateUsdPrice.toFixed(2)}
              />
            </StyledInputContainer>
            {yieldEnabled && fromCanHaveYield && fromYield !== null && (
              <Typography variant="body1" component="span">
                <FormattedMessage description="yield detail" defaultMessage="+ yield" />
              </Typography>
            )}
            <Typography variant="body1" component="span">
              <FormattedMessage
                description="rate detail"
                defaultMessage="{frequency} for you for"
                values={{
                  frequency: intl.formatMessage(
                    STRING_SWAP_INTERVALS[frequencyType.toString() as keyof typeof STRING_SWAP_INTERVALS].every
                  ),
                }}
              />
            </Typography>
            <StyledInputContainer>
              <FrequencyInput id="frequency-value" value={frequencyValue} onChange={handleFrequencyChange} isMinimal />
            </StyledInputContainer>
            {intl.formatMessage(
              STRING_SWAP_INTERVALS[frequencyType.toString() as keyof typeof STRING_SWAP_INTERVALS].subject
            )}
          </StyledSummaryContainer>
        </StyledContentContainer>
      </Grid>
      <Grid item xs={12}>
        {from && to ? (
          <Grid item xs={12}>
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
          </Grid>
        ) : null}
      </Grid>
      <Grid item xs={12}>
        <StyledContentContainer>
          {buttonToShow}
          {showNextSwapAvailableAt && !!nextSwapAvailableAt && (
            <StyledNextSwapContainer>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                <FormattedMessage
                  description="nextSwapCreate"
                  defaultMessage="Next swap for this position will be executed "
                />
                {DateTime.fromSeconds(nextSwapAvailableAt) > DateTime.now() && (
                  <FormattedMessage
                    description="nextSwapCreateTime"
                    defaultMessage="approximately {nextSwapAvailableAt}."
                    values={{
                      nextSwapAvailableAt: DateTime.fromSeconds(nextSwapAvailableAt).toRelative() || '',
                    }}
                  />
                )}
                {DateTime.fromSeconds(nextSwapAvailableAt) < DateTime.now() && (
                  <FormattedMessage
                    description="nextSwapCreateSoon"
                    defaultMessage="soon. Create a position now to be included in the next swap."
                  />
                )}
              </Typography>
            </StyledNextSwapContainer>
          )}
          {showNextSwapAvailableAt && !nextSwapAvailableAt && !existingPair && (
            <StyledNextSwapContainer>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                <FormattedMessage
                  description="nextSwapCreateNoPair"
                  defaultMessage="Next swap will be executed within the first hour after the position is created."
                />
              </Typography>
            </StyledNextSwapContainer>
          )}
          {showNextSwapAvailableAt && !nextSwapAvailableAt && !!existingPair && (
            <StyledNextSwapContainer>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                <FormattedMessage
                  description="nextSwapCreateNoPositions"
                  defaultMessage="Next swap will be executed within the first hour after the position is created."
                />
              </Typography>
            </StyledNextSwapContainer>
          )}
        </StyledContentContainer>
      </Grid>
    </StyledGrid>
  );
});

export default SwapSecondStep;
