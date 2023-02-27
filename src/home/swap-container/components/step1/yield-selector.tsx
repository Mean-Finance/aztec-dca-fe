import { Grid, Typography, Collapse } from '@mui/material';
import YieldTokenSelector from 'common/yield-token-selector';
import { MINIMUM_USD_RATE_FOR_YIELD, DEFAULT_MINIMUM_USD_RATE_FOR_YIELD, STRING_SWAP_INTERVALS } from 'config';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Switch from '@mui/material/Switch';
import { Token, YieldOption, YieldOptions } from 'types';
import { formatCurrencyAmount, usdPriceToToken } from 'utils/currency';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import useCurrentNetwork from 'hooks/useCurrentNetwork';
import { BigNumber } from 'ethers';
import {
  StyledContentContainer,
  StyledYieldContainer,
  StyledYieldTitleContainer,
  StyledYieldTokensContainer,
  StyledYieldHelpContainer,
  StyledYieldHelpDescriptionContainer,
} from './styles';

type Props = {
  yieldEnabled: boolean;
  setYieldEnabled: (newValue: boolean) => void;
  yieldOptions: YieldOptions;
  isLoadingYieldOptions: boolean;
  fromYield: YieldOption | null | undefined;
  toYield: YieldOption | null | undefined;
  from: Token | null;
  to: Token | null;
  setFromYield: (newYield: null | YieldOption) => void;
  setToYield: (newYield: null | YieldOption) => void;
  fromCanHaveYield: boolean;
  toCanHaveYield: boolean;
  rateUsdPrice: number;
  usdPrice?: BigNumber;
  frequencyType: BigNumber;
};

const YieldSelector = ({
  fromYield,
  isLoadingYieldOptions,
  setYieldEnabled,
  from,
  toYield,
  yieldEnabled,
  yieldOptions,
  setFromYield,
  setToYield,
  fromCanHaveYield,
  to,
  toCanHaveYield,
  rateUsdPrice,
  usdPrice,
  frequencyType,
}: Props) => {
  const [isHelpExpanded, setHelpExpanded] = React.useState(false);
  const intl = useIntl();
  const currentNetwork = useCurrentNetwork();
  const minimumTokensNeeded = usdPriceToToken(
    from,
    MINIMUM_USD_RATE_FOR_YIELD[currentNetwork.chainId] || DEFAULT_MINIMUM_USD_RATE_FOR_YIELD,
    usdPrice
  );

  return (
    <Grid item xs={12}>
      <StyledContentContainer>
        <StyledYieldContainer>
          <StyledYieldTitleContainer>
            <Typography variant="body1">
              <FormattedMessage description="yieldTitle" defaultMessage="Generate yield" />
            </Typography>
            <Switch
              checked={yieldEnabled}
              onChange={() => setYieldEnabled(!yieldEnabled)}
              name="yieldEnabled"
              color="primary"
            />
          </StyledYieldTitleContainer>
          {yieldEnabled && (
            <StyledYieldTokensContainer>
              <YieldTokenSelector
                token={from}
                yieldOptions={yieldOptions}
                isLoading={isLoadingYieldOptions}
                setYieldOption={setFromYield}
                yieldSelected={fromYield}
              />
              <YieldTokenSelector
                token={to}
                yieldOptions={yieldOptions}
                isLoading={isLoadingYieldOptions}
                setYieldOption={setToYield}
                yieldSelected={toYield}
              />
            </StyledYieldTokensContainer>
          )}
          {!yieldEnabled && !fromCanHaveYield && !toCanHaveYield && (
            <Typography variant="body1" color="rgba(255, 255, 255, 0.5)">
              <FormattedMessage
                description="disabledByNoOption"
                // eslint-disable-next-line no-template-curly-in-string
                defaultMessage="None of the tokens you have selected support yield platforms."
              />
            </Typography>
          )}
          {!yieldEnabled &&
            from &&
            fromCanHaveYield &&
            !!rateUsdPrice &&
            rateUsdPrice <
              (MINIMUM_USD_RATE_FOR_YIELD[currentNetwork.chainId] || DEFAULT_MINIMUM_USD_RATE_FOR_YIELD) && (
              <Typography variant="body1" color="rgba(255, 255, 255, 0.5)">
                <FormattedMessage
                  description="disabledByUsdValue"
                  // eslint-disable-next-line no-template-curly-in-string
                  defaultMessage="You have to invest at least a rate of ${minimum} USD ({minToken} {symbol}) per {frequency} to enable this option."
                  values={{
                    minimum: MINIMUM_USD_RATE_FOR_YIELD[currentNetwork.chainId] || DEFAULT_MINIMUM_USD_RATE_FOR_YIELD,
                    minToken: formatCurrencyAmount(minimumTokensNeeded, from, 3, 3),
                    symbol: from.symbol,
                    frequency: intl.formatMessage(
                      STRING_SWAP_INTERVALS[frequencyType.toString() as keyof typeof STRING_SWAP_INTERVALS]
                        .singularSubject
                    ),
                  }}
                />
              </Typography>
            )}
          <StyledYieldHelpContainer variant="body1" onClick={() => setHelpExpanded(!isHelpExpanded)}>
            <HelpOutlineOutlinedIcon fontSize="inherit" color="primary" />
            <FormattedMessage description="howItWorks" defaultMessage="How it works" />
            {isHelpExpanded ? <ArrowDropUpIcon fontSize="inherit" /> : <ArrowDropDownIcon fontSize="inherit" />}
          </StyledYieldHelpContainer>
          <Collapse in={isHelpExpanded}>
            <StyledYieldHelpDescriptionContainer>
              <Typography variant="body2">
                <FormattedMessage
                  description="howItWorksDescription"
                  defaultMessage="Funds will be deposited into your selected platform to generate yield while they wait to be swapped or withdrawn. The safety of the funds will be up to the selected platform, so please do your own research to perform an educated risk/reward assessment."
                />
              </Typography>
            </StyledYieldHelpDescriptionContainer>
          </Collapse>
        </StyledYieldContainer>
      </StyledContentContainer>
    </Grid>
  );
};

export { YieldSelector };
