import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { ENTITY, ICONS } from '#/src/constants';
import FormStepIcon from '#/src/components/FormStepIcon';

const {
  KOULUTUS,
  TOTEUTUS,
  HAKU,
  HAKUKOHDE,
  VALINTAPERUSTE,
  SORA_KUVAUS,
} = ENTITY;

const GroupContainer = styled.div`
  display: flex;
`;

const StepsIcon = styled(FormStepIcon)`
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
  KOULUTUS,
  TOTEUTUS,
  HAKU,
  HAKUKOHDE,
  VALINTAPERUSTE,
  SORA_KUVAUS,
];

const stepIsActive = (step, activeStep) => {
  return step === activeStep;
};

const stepIsDone = (step, activeStep) => {
  const activeStepIndex = stepOrder.indexOf(activeStep);
  const stepIndex = stepOrder.indexOf(step);

  return stepIndex < activeStepIndex;
};

const FormSteps = ({ activeStep = KOULUTUS }) => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <GroupContainer>
        <StepsIcon
          icon={ICONS[KOULUTUS]}
          active={stepIsActive(KOULUTUS, activeStep)}
          done={stepIsDone(KOULUTUS, activeStep)}
        >
          {t('yleiset.koulutus')}
        </StepsIcon>
        <StepsIcon
          icon={ICONS[TOTEUTUS]}
          active={stepIsActive(TOTEUTUS, activeStep)}
          done={stepIsDone(TOTEUTUS, activeStep)}
        >
          {t('yleiset.toteutus')}
        </StepsIcon>
      </GroupContainer>
      <GroupContainer>
        <StepsIcon
          icon={ICONS[HAKU]}
          active={stepIsActive(HAKU, activeStep)}
          done={stepIsDone(HAKU, activeStep)}
        >
          {t('yleiset.haku')}
        </StepsIcon>
        <StepsIcon
          icon={ICONS[HAKUKOHDE]}
          active={stepIsActive(HAKUKOHDE, activeStep)}
          done={stepIsDone(HAKUKOHDE, activeStep)}
        >
          {t('yleiset.hakukohde')}
        </StepsIcon>
      </GroupContainer>
      <GroupContainer>
        <StepsIcon
          icon={ICONS[VALINTAPERUSTE]}
          active={stepIsActive(VALINTAPERUSTE, activeStep)}
          done={stepIsDone(VALINTAPERUSTE, activeStep)}
        >
          {t('yleiset.valintaperusteet')}
        </StepsIcon>
        <StepsIcon
          icon={ICONS[SORA_KUVAUS]}
          active={stepIsActive(SORA_KUVAUS, activeStep)}
          done={stepIsDone(SORA_KUVAUS, activeStep)}
        >
          {t('yleiset.soraKuvaus')}
        </StepsIcon>
      </GroupContainer>
    </Wrapper>
  );
};

export default FormSteps;
