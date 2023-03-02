import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

const StyledGrid = styled(Grid)<{ $show: boolean }>`
  ${({ $show }) => !$show && 'position: absolute;width: auto;'};
  top: 16px;
  left: 16px;
  right: 16px;
  z-index: 90;
`;

const StyledContentContainer = styled.div`
  background-color: #292929;
  padding: 16px;
  border-radius: 8px;
`;

const StyledTokensContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const StyledTokenContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0;
  gap: 5px;
`;

const StyledToggleContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const StyledToggleTokenButton = styled(IconButton)`
  border: 4px solid #1b1821;
  background-color: #292929;
  :hover {
    background-color: #484848;
  }
`;

const StyledRateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledFrequencyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledSummaryContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  align-items: center;
`;

const StyledInputContainer = styled.div`
  margin: 6px 0px;
  display: inline-flex;
`;

const StyledYieldHelpContainer = styled(Typography)`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const StyledYieldHelpDescriptionContainer = styled.div`
  display: flex;
  padding: 10px;
  background-color: #212121;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
`;

export {
  IconButton,
  StyledContentContainer,
  StyledFrequencyContainer,
  StyledGrid,
  StyledInputContainer,
  StyledRateContainer,
  StyledSummaryContainer,
  StyledToggleContainer,
  StyledToggleTokenButton,
  StyledTokenContainer,
  StyledTokensContainer,
  StyledYieldHelpContainer,
  StyledYieldHelpDescriptionContainer,
};
