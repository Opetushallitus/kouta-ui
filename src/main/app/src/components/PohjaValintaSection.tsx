import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  FormFieldSelect,
  FormFieldRadioGroup,
} from '#/src/components/formFields';
import { Box, FormControl, Typography } from '#/src/components/virkailija';
import { POHJAVALINTA } from '#/src/constants';
import { useApiQuery } from '#/src/hooks/useApiQuery';
import { useEntityOptions } from '#/src/hooks/useEntityOptionsHook';

const CopySelect = ({ input: { value }, options, selectName }) => {
  return value === POHJAVALINTA.KOPIO ? (
    <Box marginTop={2} marginBottom={2}>
      <Field name={selectName} component={FormFieldSelect} options={options} />
    </Box>
  ) : null;
};

export default function PohjaValintaSection({
  organisaatioOid,
  getCopyEntities,
  name,
  disabled,
  infoText,
  copyLabel,
  createLabel,
}) {
  const { t } = useTranslation();

  const { data = [] } = useApiQuery('getCopyEntities', getCopyEntities, {
    organisaatioOid,
    copyLabel, // Tätä ei tarvita API-kutsussa, mutta react-query käyttää tätä queryn avaimen osana. Näin sitä ei sotketa muihin getCopyEntites-queryihin.
  });

  const tapaName = `${name}.tapa`;
  const valintaName = `${name}.valinta`;

  const tapaOptions = [
    {
      label: createLabel,
      value: POHJAVALINTA.UUSI,
    },
    {
      label: copyLabel,
      value: POHJAVALINTA.KOPIO,
    },
  ];

  const copyOptions = useEntityOptions(data);

  return (
    <>
      {infoText && (
        <Typography variant="secondary" as="div" marginBottom={2}>
          {infoText}
        </Typography>
      )}
      <FormControl>
        <Field
          name={tapaName}
          component={FormFieldRadioGroup}
          options={tapaOptions}
          label={t('yleiset.valitseLomakkeenPohja')}
          disabled={disabled}
          required
        />

        <Field
          name={tapaName}
          options={copyOptions}
          selectName={valintaName}
          component={CopySelect}
          disabled={disabled}
        />
      </FormControl>
    </>
  );
}
