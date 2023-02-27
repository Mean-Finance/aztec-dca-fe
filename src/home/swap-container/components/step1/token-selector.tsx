import { Token } from 'types';
import { Grid, Typography } from '@mui/material';
import TokenButton from 'common/token-button';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { emptyTokenWithAddress } from 'utils/currency';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {
  StyledContentContainer,
  StyledTokensContainer,
  StyledTokenContainer,
  StyledToggleContainer,
  StyledToggleTokenButton,
} from './styles';

type Props = {
  startSelectingCoin: (token: Token) => void;
  toggleFromTo: () => void;
  from: Token | null;
  to: Token | null;
};
const TokenSelector = ({ startSelectingCoin, from, to, toggleFromTo }: Props) => (
  <Grid item xs={12}>
    <StyledContentContainer>
      <StyledTokensContainer>
        <StyledTokenContainer>
          <Typography variant="body1">
            <FormattedMessage description="sell" defaultMessage="Sell" />
          </Typography>
          <TokenButton token={from} onClick={() => startSelectingCoin(from || emptyTokenWithAddress('from'))} />
        </StyledTokenContainer>
        <StyledToggleContainer>
          <StyledToggleTokenButton onClick={() => toggleFromTo()}>
            <SwapHorizIcon />
          </StyledToggleTokenButton>
        </StyledToggleContainer>
        <StyledTokenContainer>
          <Typography variant="body1">
            <FormattedMessage description="receive" defaultMessage="Receive" />
          </Typography>
          <TokenButton token={to} onClick={() => startSelectingCoin(to || emptyTokenWithAddress('to'))} />
        </StyledTokenContainer>
      </StyledTokensContainer>
    </StyledContentContainer>
  </Grid>
);

export { TokenSelector };
