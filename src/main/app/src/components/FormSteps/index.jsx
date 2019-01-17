import React from 'react';
import styled from 'styled-components';

import FormStepsIcon from './FormStepsIcon';

const GroupContainer = styled.div`
  display: flex;
`;

const StepsIcon = styled(FormStepsIcon)`
  flex: 0;
  margin-right: ${({ theme }) => theme.spacing.unit * 3}px;

  &:last-child {
    margin-right: 0px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const stepOrder = [
  'koulutus',
  'toteutus',
  'haku',
  'hakukohde',
  'valintaperusteet',
];

const stepIsActive = (step, activeStep) => {
  return step === activeStep;
};

const stepIsDone = (step, activeStep) => {
  const activeStepIndex = stepOrder.indexOf(activeStep);
  const stepIndex = stepOrder.indexOf(step);

  return stepIndex < activeStepIndex;
};

const FormSteps = ({ activeStep = 'koulutus', ...props }) => (
  <Wrapper {...props}>
    <GroupContainer>
      <StepsIcon
        icon="school"
        active={stepIsActive('koulutus', activeStep)}
        done={stepIsDone('koulutus', activeStep)}
      >
        Koulutus
      </StepsIcon>
      <StepsIcon
        icon="settings"
        active={stepIsActive('toteutus', activeStep)}
        done={stepIsDone('toteutus', activeStep)}
      >
        Toteutus
      </StepsIcon>
    </GroupContainer>
    <GroupContainer>
      <StepsIcon
        icon="access_time"
        active={stepIsActive('haku', activeStep)}
        done={stepIsDone('haku', activeStep)}
      >
        Haku
      </StepsIcon>
      <StepsIcon
        icon="grain"
        active={stepIsActive('hakukohde', activeStep)}
        done={stepIsDone('hakukohde', activeStep)}
      >
        Hakukohde
      </StepsIcon>
    </GroupContainer>
    <GroupContainer>
      <StepsIcon
        icon="select_all"
        active={stepIsActive('valintaperusteet', activeStep)}
        done={stepIsDone('valintaperusteet', activeStep)}
      >
        Valintaperusteet
      </StepsIcon>
    </GroupContainer>
  </Wrapper>
);

export default FormSteps;
