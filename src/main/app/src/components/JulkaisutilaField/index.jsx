import React from 'react';
import { Field } from 'redux-form';
import { setLightness } from 'polished';
import styled from 'styled-components';

import Radio from '../Radio';
import { FormFieldRadioGroup } from '../formFields';
import useTranslation from '../useTranslation';
import { JULKAISUTILA } from '../../constants';
import Box from '../Box';
import Typography from '../Typography';

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
      <Box flexGrow="0">
        <Badge tila={tila}>{t(`julkaisutilat.${tila}`)}</Badge>
      </Box>
      <Box flexGrow="1" pl={2}>
        <Typography variant="secondary">{t(`julkaisutilojenSelitteet.${tila}`)}</Typography>
      </Box>
    </Box>
  );
};

const JulkaisutilaField = ({
  name,
  label: labelProp,
  showArkistoitu = true,
  showLabel = true,
}) => {
  const { t } = useTranslation();

  const label = showLabel
    ? labelProp || t('yleiset.valitseJulkaisutila')
    : null;

  return (
    <Field name={name} component={FormFieldRadioGroup} label={label}>
      <Radio value={JULKAISUTILA.JULKAISTU}>
        <Label tila={JULKAISUTILA.JULKAISTU} t={t} />
      </Radio>
      <Radio value={JULKAISUTILA.TALLENNETTU}>
        <Label tila={JULKAISUTILA.TALLENNETTU} t={t} />
      </Radio>
      {showArkistoitu && (
        <Radio value={JULKAISUTILA.ARKISTOITU}>
          <Label tila={JULKAISUTILA.ARKISTOITU} t={t} />
        </Radio>
      )}
    </Field>
  );
};

export default JulkaisutilaField;
