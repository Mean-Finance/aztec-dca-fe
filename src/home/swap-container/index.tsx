import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { useParams } from 'react-router-dom';
import GraphWidget from 'common/graph-widget';
import find from 'lodash/find';
import WalletContext from 'common/wallet-context';
import { useQuery } from '@apollo/client';
import useTokenList from 'hooks/useTokenList';
import Swap from './components/swap';
import { DAY_IN_SECONDS } from 'utils/parsing';
import { WETH, DAI, UNI, ETH, USDC } from 'mocks/tokens';
import Hidden from '@material-ui/core/Hidden';

const SwapContainer = () => {
  const routeParams = useParams<{ from: string; to: string }>();
  const [from, setFrom] = React.useState((routeParams && routeParams.from) || USDC.address);
  const [to, setTo] = React.useState((routeParams && routeParams.to) || WETH.address);
  const [fromValue, setFromValue] = React.useState('');
  const [frequencyType, setFrequencyType] = React.useState(DAY_IN_SECONDS);
  const [frequencyValue, setFrequencyValue] = React.useState('5');
  const tokenList = useTokenList();

  const onSetFrom = (newFrom: string) => {
    // check for decimals
    if (tokenList[newFrom].decimals < tokenList[from].decimals) {
      const splitValue = fromValue.match(/^(\d*)\.?(\d*)$/);
      let newFromValue = fromValue;
      if (splitValue && splitValue[2] !== '') {
        newFromValue = `${splitValue[1]}.${splitValue[2].substring(0, tokenList[newFrom].decimals)}`;
      }

      setFromValue(newFromValue);
    }

    setFrom(newFrom);
    if (!tokenList[newFrom].pairableTokens.includes(to)) {
      setTo(tokenList[newFrom].pairableTokens[0]);
    }
  };
  const onSetTo = (to: string) => {
    setTo(to);
    if (!tokenList[to].pairableTokens.includes(from)) {
      const splitValue = fromValue.match(/^(\d*)\.?(\d*)$/);
      let newFromValue = fromValue;
      if (splitValue && splitValue[2] !== '') {
        newFromValue = `${splitValue[1]}.${splitValue[2].substring(
          0,
          tokenList[tokenList[to].pairableTokens[0]].decimals
        )}`;
      }
      setFrom(tokenList[to].pairableTokens[0]);
    }
  };

  const toggleFromTo = () => {
    if (from === ETH.address) {
      setTo(WETH.address);
    } else {
      setTo(from);
    }

    // check for decimals
    if (tokenList[to].decimals < tokenList[from].decimals) {
      const splitValue = fromValue.match(/^(\d*)\.?(\d*)$/);
      let newFromValue = fromValue;
      if (splitValue && splitValue[2] !== '') {
        newFromValue = `${splitValue[1]}.${splitValue[2].substring(0, tokenList[to].decimals)}`;
      }

      setFromValue(newFromValue);
    }
    setFrom(to);
  };

  return (
    <Grid container spacing={2} alignItems="center" justify="space-around">
      <WalletContext.Consumer>
        {({ graphPricesClient, web3Service }) => (
          <>
            <Grid item xs={12} md={5}>
              <Swap
                from={from}
                to={to}
                setFrom={onSetFrom}
                setTo={onSetTo}
                frequencyType={frequencyType}
                frequencyValue={frequencyValue}
                setFrequencyType={setFrequencyType}
                setFrequencyValue={setFrequencyValue}
                fromValue={fromValue}
                setFromValue={setFromValue}
                web3Service={web3Service}
                tokenList={tokenList}
                toggleFromTo={toggleFromTo}
              />
            </Grid>
            <Hidden mdDown>
              <Grid item xs={7} style={{ flexGrow: 1, alignSelf: 'stretch', display: 'flex' }}>
                <GraphWidget from={tokenList[from]} to={tokenList[to]} client={graphPricesClient} />
              </Grid>
            </Hidden>
          </>
        )}
      </WalletContext.Consumer>
    </Grid>
  );
};
export default SwapContainer;
