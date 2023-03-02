import styled from 'styled-components';
import { Typography } from '@mui/material';
import FrequencyInput from 'common/frequency-easy-input';
import TokenInput from 'common/token-input';
import { STRING_SWAP_INTERVALS } from 'config';
import { BigNumber } from 'ethers';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Token, YieldOption } from 'types';
import { StyledContentContainer, StyledInputContainer } from 'common/swap-container/styles';

const ButtonWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 4px;
`;

type Props = {
  from: Token | null;
  frequencyType: BigNumber;
  frequencyValue: string;
  handleFrequencyChange: (newValue: string) => void;
  buttonToShow: React.ReactNode;
  rate: string;
  handleRateValueChange: (newValue: string) => void;
  rateUsdPrice: number;
  fromYield: YieldOption | null | undefined;
  fromCanHaveYield: boolean;
  yieldEnabled: boolean;
};

const Resume = ({
  rate,
  handleFrequencyChange,
  handleRateValueChange,
  from,
  rateUsdPrice,
  frequencyValue,
  frequencyType,
  fromCanHaveYield,
  fromYield,
  buttonToShow,
  yieldEnabled,
}: Props) => {
  const intl = useIntl();

  return (
    <StyledContentContainer>
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
          <FormattedMessage description="yield detail" defaultMessage=" + yield" />
        </Typography>
      )}
      <Typography variant="body1" component="span" style={{ display: 'block' }}>
        <FormattedMessage
          description="rate detail"
          defaultMessage="{frequency} for you for"
          values={{
            frequency: intl.formatMessage(
              STRING_SWAP_INTERVALS[frequencyType.toString() as keyof typeof STRING_SWAP_INTERVALS].every
            ),
          }}
        />
        <FrequencyInput id="frequency-value" value={frequencyValue} onChange={handleFrequencyChange} isMinimal />
        {intl.formatMessage(
          STRING_SWAP_INTERVALS[frequencyType.toString() as keyof typeof STRING_SWAP_INTERVALS].subject
        )}
      </Typography>
      <ButtonWrapper>{buttonToShow}</ButtonWrapper>
    </StyledContentContainer>
  );
};

export { Resume };
