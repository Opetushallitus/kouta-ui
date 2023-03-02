import React from 'react';

import { setLightness } from 'polished';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';
import styled from 'styled-components';

import { FormFieldRadioGroup } from '#/src/components/formFields';
import { Box, Radio, Typography } from '#/src/components/virkailija';
import { ENTITY, JULKAISUTILA } from '#/src/constants';
import { useFormName } from '#/src/contexts/FormContext';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';

const tilaCss = ({ theme, tila }) => {
  const color = theme.colors[tila] || theme.colors.tallennettu;

  return {
    borderColor: color,
    backgroundColor: setLightness(0.95, color),
  };
};

const Badge = styled.div`
  min-width: 6rem;
  padding: 4px 8px;
  display: inline-block;
  border-radius: ${({ theme }) => theme.radii[1]}px;
  border: 2px solid;
  text-align: center;
  ${({ theme }) => theme.typography.body};
  font-size: 0.85rem;
  color: #313541;
  ${tilaCss};
`;

const Label = ({ tila, t }) => {
  return (
    <Box display="flex" alignItems="center">
      <Box flexGrow={0}>
        <Badge tila={tila}>{t(`julkaisutilat.${tila}`)}</Badge>
      </Box>
      <Box flexGrow={1} pl={2}>
        <Typography variant="secondary">
          {t(`julkaisutilojenSelitteet.${tila}`)}
        </Typography>
      </Box>
    </Box>
  );
};

const isAllowedTilaTransition = (
  currTila,
  checkedTila,
  isPaakayttaja,
  tilaTransferAllowedWithoutPaakayttaja,
  arkistoituToPoistettuAllowed
) => {
  /* tila (currTila) on undefined kun ollaan luomassa entiteettiä */
  switch (currTila) {
    case undefined:
      return [JULKAISUTILA.TALLENNETTU, JULKAISUTILA.JULKAISTU].includes(
        checkedTila
      );
    case checkedTila:
      return true;
    case JULKAISUTILA.TALLENNETTU:
      return [JULKAISUTILA.POISTETTU, JULKAISUTILA.JULKAISTU].includes(
        checkedTila
      );
    case JULKAISUTILA.JULKAISTU:
      return isPaakayttaja || tilaTransferAllowedWithoutPaakayttaja
        ? [JULKAISUTILA.TALLENNETTU, JULKAISUTILA.ARKISTOITU].includes(
            checkedTila
          )
        : [JULKAISUTILA.ARKISTOITU].includes(checkedTila);
    case JULKAISUTILA.ARKISTOITU:
      return (
        checkedTila === JULKAISUTILA.JULKAISTU ||
        (arkistoituToPoistettuAllowed && checkedTila === JULKAISUTILA.POISTETTU)
      );
    default:
      return false;
  }
};

export const JulkaisutilaField = ({
  entity,
  disabled,
  name,
  label: labelProp,
  showLabel = true,
  arkistoituToPoistettuAllowed = false,
}) => {
  const savedTila = entity?.tila;

  const { t } = useTranslation();
  const isPaakayttaja = useIsOphVirkailija();
  const formName = useFormName();
  const tilaTransferAllowedWithoutPaakayttaja =
    formName === ENTITY.OPPILAITOS || formName === ENTITY.OPPILAITOKSEN_OSA;

  const label = showLabel
    ? labelProp || t('yleiset.valitseJulkaisutila')
    : null;
  return (
    <Field
      disabled={disabled}
      name={name}
      component={FormFieldRadioGroup}
      label={label}
    >
      {[
        JULKAISUTILA.POISTETTU,
        JULKAISUTILA.TALLENNETTU,
        JULKAISUTILA.JULKAISTU,
        JULKAISUTILA.ARKISTOITU,
      ].map(
        tila =>
          isAllowedTilaTransition(
            savedTila,
            tila,
            isPaakayttaja,
            tilaTransferAllowedWithoutPaakayttaja,
            arkistoituToPoistettuAllowed
          ) && (
            <Radio key={tila} value={tila}>
              <Label tila={tila} t={t} />
            </Radio>
          )
      )}
    </Field>
  );
};
