import React from 'react';
import styled from 'styled-components';

import FormStepsIcon from './FormStepsIcon';
import useTranslation from '../useTranslation';

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
  'sora',
];

const stepIsActive = (step, activeStep) => {
  return step === activeStep;
};

const stepIsDone = (step, activeStep) => {
  const activeStepIndex = stepOrder.indexOf(activeStep);
  const stepIndex = stepOrder.indexOf(step);

  return stepIndex < activeStepIndex;
};

const FormSteps = ({ activeStep = 'koulutus', ...props }) => {
  const { t } = useTranslation();

  return (
    <Wrapper {...props}>
      <GroupContainer>
        <StepsIcon
          icon="school"
          active={stepIsActive('koulutus', activeStep)}
          done={stepIsDone('koulutus', activeStep)}
        >
          {t('yleiset.koulutus')}
        </StepsIcon>
        <StepsIcon
          icon="settings"
          active={stepIsActive('toteutus', activeStep)}
          done={stepIsDone('toteutus', activeStep)}
        >
          {t('yleiset.toteutus')}
        </StepsIcon>
      </GroupContainer>
      <GroupContainer>
        <StepsIcon
          icon="access_time"
          active={stepIsActive('haku', activeStep)}
          done={stepIsDone('haku', activeStep)}
        >
          {t('yleiset.haku')}
        </StepsIcon>
        <StepsIcon
          icon="grain"
          active={stepIsActive('hakukohde', activeStep)}
          done={stepIsDone('hakukohde', activeStep)}
        >
          {t('yleiset.hakukohde')}
        </StepsIcon>
      </GroupContainer>
      <GroupContainer>
        <StepsIcon
          icon="select_all"
          active={stepIsActive('valintaperusteet', activeStep)}
          done={stepIsDone('valintaperusteet', activeStep)}
        >
          {t('yleiset.valintaperusteet')}
        </StepsIcon>
        <StepsIcon
          icon="subject"
          active={stepIsActive('sora', activeStep)}
          done={stepIsDone('sora', activeStep)}
        >
          {t('yleiset.soraKuvaus')}
        </StepsIcon>
      </GroupContainer>
    </Wrapper>
  );
};

export default FormSteps;
