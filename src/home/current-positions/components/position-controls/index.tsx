import * as React from 'react';
import find from 'lodash/find';
import Button from 'common/button';
import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import { NetworkStruct, Position, Token, YieldOptions } from 'types';
import { useHistory } from 'react-router-dom';
import { NETWORKS, OLD_VERSIONS } from 'config/constants';
import { BigNumber } from 'ethers';
import { buildEtherscanTransaction } from 'utils/etherscan';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Link from '@mui/material/Link';
import { getWrappedProtocolToken, PROTOCOL_TOKEN_ADDRESS } from 'mocks/tokens';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { withStyles } from '@mui/styles';
import { createStyles } from '@mui/material/styles';
import useWalletService from 'hooks/useWalletService';
import { useAppDispatch } from 'state/hooks';
import { setPosition } from 'state/position-details/actions';

const StyledCardFooterButton = styled(Button)``;

const StyledCallToActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 8px;
`;

const PositionControlsContainer = styled.div`
  display: flex;
  border-radius: 20px;
  background-color: rgba(216, 216, 216, 0.05);
`;

const StyledMenu = withStyles(() =>
  createStyles({
    paper: {
      border: '2px solid #A5AAB5',
      borderRadius: '8px',
    },
  })
)(Menu);

interface PositionProp extends Omit<Position, 'from' | 'to'> {
  from: Token;
  to: Token;
}

interface PositionControlsProps {
  position: PositionProp;
  onWithdraw: (position: Position, useProtocolToken?: boolean) => void;
  onTerminate: (position: Position) => void;
  onReusePosition: (position: Position) => void;
  onMigrate: (position: Position) => void;
  disabled: boolean;
  hasSignSupport: boolean;
  network: NetworkStruct;
  yieldOptions: YieldOptions;
}

const PositionControls = ({
  position,
  onWithdraw,
  onReusePosition,
  onTerminate,
  onMigrate,
  disabled,
  hasSignSupport,
  network,
  yieldOptions,
}: PositionControlsProps) => {
  const { remainingSwaps, pendingTransaction, toWithdraw, chainId } = position;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const positionNetwork = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const supportedNetwork = find(NETWORKS, { chainId })!;
    return supportedNetwork;
  }, [chainId]);

  const isOnNetwork = network.chainId === positionNetwork.chainId;
  const history = useHistory();
  const walletService = useWalletService();
  const dispatch = useAppDispatch();
  const isPending = !!pendingTransaction;
  const wrappedProtocolToken = getWrappedProtocolToken(positionNetwork.chainId);

  const onViewDetails = () => {
    dispatch(setPosition(null));
    history.push(`/${chainId}/positions/${position.version}/${position.positionId}`);
  };

  const onChangeNetwork = () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    walletService.changeNetwork(chainId);
  };

  if (isPending) {
    return (
      <StyledCallToActionContainer>
        <StyledCardFooterButton variant="contained" color="pending" fullWidth>
          <Link
            href={buildEtherscanTransaction(pendingTransaction, positionNetwork.chainId)}
            target="_blank"
            rel="noreferrer"
            underline="none"
            color="inherit"
          >
            <Typography variant="body2" component="span">
              <FormattedMessage description="pending transaction" defaultMessage="Pending transaction" />
            </Typography>
            <OpenInNewIcon style={{ fontSize: '1rem' }} />
          </Link>
        </StyledCardFooterButton>
      </StyledCallToActionContainer>
    );
  }

  const showMenu =
    !OLD_VERSIONS.includes(position.version) ||
    remainingSwaps.gt(BigNumber.from(0)) ||
    toWithdraw.gt(BigNumber.from(0));

  const showSwitchAction = !isOnNetwork && showMenu;

  const fromSupportsYield = find(yieldOptions, { enabledTokens: [position.from.address] });
  const toSupportsYield = find(yieldOptions, { enabledTokens: [position.to.address] });

  const shouldShowMigrate = hasSignSupport && remainingSwaps.gt(BigNumber.from(0));

  const shouldMigrateToYield = fromSupportsYield || toSupportsYield;

  return (
    <StyledCallToActionContainer>
      {showMenu && (
        <>
          <PositionControlsContainer>
            <IconButton onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          </PositionControlsContainer>
          <StyledMenu
            anchorEl={anchorEl}
            open={open && !isPending}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            {toWithdraw.gt(BigNumber.from(0)) && hasSignSupport && position.to.address === PROTOCOL_TOKEN_ADDRESS && (
              <MenuItem
                onClick={() => {
                  handleClose();
                  onViewDetails();
                }}
                disabled={disabled}
              >
                <Typography variant="body2">
                  <FormattedMessage
                    description="withdraw"
                    defaultMessage="Withdraw {wrappedProtocolToken}"
                    values={{
                      wrappedProtocolToken: wrappedProtocolToken.symbol,
                    }}
                  />
                </Typography>
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                handleClose();
                onViewDetails();
              }}
              disabled={disabled}
            >
              <Typography variant="body2">
                <FormattedMessage description="goToPosition" defaultMessage="Go to position" />
              </Typography>
            </MenuItem>
          </StyledMenu>
        </>
      )}
      {showSwitchAction && (
        <StyledCardFooterButton variant="contained" color="secondary" onClick={onChangeNetwork} fullWidth>
          <Typography variant="body2">
            <FormattedMessage
              description="incorrect network"
              defaultMessage="Switch to {network}"
              values={{ network: positionNetwork.name }}
            />
          </Typography>
        </StyledCardFooterButton>
      )}
      {!showSwitchAction && !showMenu && (
        <StyledCardFooterButton variant="outlined" color="default" onClick={onViewDetails} fullWidth>
          <Typography variant="body2">
            <FormattedMessage description="goToPosition" defaultMessage="Go to position" />
          </Typography>
        </StyledCardFooterButton>
      )}
      {!OLD_VERSIONS.includes(position.version) && isOnNetwork && (
        <>
          {!disabled && (
            <>
              {toWithdraw.gt(BigNumber.from(0)) && (
                <StyledCardFooterButton
                  variant="contained"
                  color="secondary"
                  onClick={() => onWithdraw(position, hasSignSupport && position.to.address === PROTOCOL_TOKEN_ADDRESS)}
                  fullWidth
                  disabled={disabled}
                >
                  <Typography variant="body2">
                    <FormattedMessage
                      description="withdraw simple"
                      defaultMessage="Withdraw {token}"
                      values={{ token: position.to.symbol }}
                    />
                  </Typography>
                </StyledCardFooterButton>
              )}
              {remainingSwaps.lte(BigNumber.from(0)) && toWithdraw.lte(BigNumber.from(0)) && (
                <StyledCardFooterButton
                  variant="contained"
                  color="secondary"
                  onClick={() => onReusePosition(position)}
                  disabled={disabled}
                  fullWidth
                >
                  <Typography variant="body2">
                    <FormattedMessage description="reusePosition" defaultMessage="Reuse position" />
                  </Typography>
                </StyledCardFooterButton>
              )}
            </>
          )}
        </>
      )}
      {OLD_VERSIONS.includes(position.version) && isOnNetwork && (
        <>
          {shouldShowMigrate && shouldMigrateToYield && (
            <StyledCardFooterButton
              variant="contained"
              color="migrate"
              onClick={() => onMigrate(position)}
              fullWidth
              disabled={disabled}
            >
              <Typography variant="body2">
                <FormattedMessage description="startEarningYield" defaultMessage="Start generating yield" />
              </Typography>
            </StyledCardFooterButton>
          )}
          {shouldShowMigrate && !shouldMigrateToYield && (
            <StyledCardFooterButton
              variant="contained"
              color="migrate"
              onClick={() => onMigrate(position)}
              fullWidth
              disabled={disabled}
            >
              <Typography variant="body2">
                <FormattedMessage description="startSubsidizing" defaultMessage="Start subsidizing" />
              </Typography>
            </StyledCardFooterButton>
          )}
          {toWithdraw.gt(BigNumber.from(0)) && remainingSwaps.lte(BigNumber.from(0)) && (
            <StyledCardFooterButton
              variant="contained"
              color="error"
              onClick={() => onTerminate(position)}
              fullWidth
              disabled={disabled}
            >
              <Typography variant="body2">
                <FormattedMessage description="terminate" defaultMessage="Terminate" />
              </Typography>
            </StyledCardFooterButton>
          )}
        </>
      )}
    </StyledCallToActionContainer>
  );
};
export default PositionControls;
