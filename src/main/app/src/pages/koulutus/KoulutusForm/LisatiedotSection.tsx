import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldEditor, FormFieldSelect } from '#/src/components/formFields';
import { LuokittelutermitField } from '#/src/components/LuokittelutermitField';
import { Box, Typography } from '#/src/components/virkailija';
import { KOULUTUSTYYPPI } from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import { useLisatiedotOptions } from '#/src/hooks/useKoodistoOptions';
import { Kielivalinta } from '#/src/types/domainTypes';
import { getTestIdProps } from '#/src/utils';

const OsiotFields = ({ disabled, language, osiotOptions, name }) => {
  const osiot = useFieldValue(`${name}.osiot`);

  const osiotArrWithLabels = useMemo(() => {
    return (osiot ?? []).map(({ value, label }) => ({
      value,
      label: label
        ? label
        : _fp.get(
            'label',
            osiotOptions.find(({ value: v }) => v === value)
          ) || null,
    }));
  }, [osiot, osiotOptions]);

  return osiotArrWithLabels.map(({ value, label }, index) => (
    <Box
      marginBottom={index === osiot.length - 1 ? 0 : 2}
      key={value}
      {...getTestIdProps(`osioKuvaus.${value}`)}
    >
      <Field
        disabled={disabled}
        name={`${name}.osioKuvaukset.${value}.${language}`}
        component={FormFieldEditor}
        label={label}
        required
      />
    </Box>
  ));
};

export const LisatiedotSection = ({
  disabled,
  language,
  name,
  koulutustyyppi,
}: {
  disabled: boolean;
  language: Kielivalinta;
  name: string;
  koulutustyyppi: KOULUTUSTYYPPI;
}) => {
  const { t } = useTranslation();

  const osiotOptions = useLisatiedotOptions();

  return (
    <>
      <Typography variant="secondary" as="div" marginBottom={2}>
        {t('koulutuslomake.lisatiedotInfo')}
      </Typography>
      <Box marginBottom={2}>
        <div {...getTestIdProps('osiotSelect')}>
          <Field
            disabled={disabled}
            name={`${name}.osiot`}
            component={FormFieldSelect}
            options={osiotOptions}
            label={t('yleiset.valitseLisattavaOsio')}
            isMulti
          />
        </div>
      </Box>
      <OsiotFields
        disabled={disabled}
        name={name}
        language={language}
        osiotOptions={osiotOptions}
      />
      {[KOULUTUSTYYPPI.TUTKINNON_OSA, KOULUTUSTYYPPI.OSAAMISALA].includes(
        koulutustyyppi
      ) && <LuokittelutermitField name={name} />}
    </>
  );
};
