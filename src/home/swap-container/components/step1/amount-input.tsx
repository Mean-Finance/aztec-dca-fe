import TokenInput from 'common/token-input';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@mui/material';
import { Token } from 'types';
import { BigNumber } from 'ethers';
import { StyledContentContainer, StyledRateContainer } from '../../../../common/swap-container/styles';

type Props = {
  from: Token | null;
  fromValue: string;
  handleFromValueChange: (newValue: string) => void;
  cantFund: boolean | null;
  balance?: BigNumber;
  fromValueUsdPrice: number;
};

const AmountInput = ({ from, cantFund, fromValue, handleFromValueChange, balance, fromValueUsdPrice }: Props) => (
  <StyledContentContainer>
    <StyledRateContainer>
      <Typography variant="body1">
        <FormattedMessage
          description="howMuchToSell"
          defaultMessage="How much {from} do you want to invest?"
          values={{ from: from?.symbol || '' }}
        />
      </Typography>
      <TokenInput
        id="from-value"
        error={cantFund ? 'Amount cannot exceed balance' : ''}
        value={fromValue}
        onChange={handleFromValueChange}
        withBalance={!!balance}
        balance={balance}
        token={from}
        withMax
        withHalf
        fullWidth
        usdValue={fromValueUsdPrice.toFixed(2)}
      />
    </StyledRateContainer>
  </StyledContentContainer>
);

export { AmountInput };
