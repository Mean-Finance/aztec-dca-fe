import { Typography } from '@mui/material';
import FrequencyTypeInput from 'common/frequency-type-input';
import { STRING_SWAP_INTERVALS } from 'config';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FrequencyInput from 'common/frequency-easy-input';
import { BigNumber } from 'ethers';
import styled from 'styled-components';
import { StyledContentContainer, StyledFrequencyContainer } from 'common/swap-container/styles';

const StyledFrequencyTypeContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StyledFrequencyValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

type AvailableSwapInterval = {
  label: {
    singular: string;
    adverb: string;
  };
  value: BigNumber;
};

type Props = {
  frequencies: AvailableSwapInterval[];
  frequencyType: BigNumber;
  frequencyValue: string;
  handleFrequencyChange: (newValue: string) => void;
  setFrequencyType: (newFrequencyType: BigNumber) => void;
};

const FrecuencySelector = ({
  frequencies,
  frequencyType,
  frequencyValue,
  handleFrequencyChange,
  setFrequencyType,
}: Props) => {
  const intl = useIntl();

  return (
    <StyledContentContainer>
      <StyledFrequencyContainer>
        <StyledFrequencyTypeContainer>
          <Typography variant="body1">
            <FormattedMessage description="executes" defaultMessage="Executes" />
          </Typography>
          <FrequencyTypeInput options={frequencies} selected={frequencyType} onChange={setFrequencyType} />
        </StyledFrequencyTypeContainer>
        <StyledFrequencyValueContainer>
          <Typography variant="body1">
            <FormattedMessage
              description="howManyFreq"
              defaultMessage="How many {type}?"
              values={{
                type: intl.formatMessage(
                  STRING_SWAP_INTERVALS[frequencyType.toString() as keyof typeof STRING_SWAP_INTERVALS].subject
                ),
              }}
            />
          </Typography>
          <FrequencyInput id="frequency-value" value={frequencyValue} onChange={handleFrequencyChange} />
        </StyledFrequencyValueContainer>
      </StyledFrequencyContainer>
    </StyledContentContainer>
  );
};

export { FrecuencySelector };
export type { AvailableSwapInterval };
