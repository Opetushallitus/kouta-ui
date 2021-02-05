import React, { useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldEditor, FormFieldSelect } from '#/src/components/formFields';
import Spacing from '#/src/components/Spacing';
import { Typography } from '#/src/components/virkailija';
import { useFieldValue } from '#/src/hooks/form';
import useKoodistoOptions from '#/src/hooks/useKoodistoOptions';
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
    <Spacing
      marginBottom={index !== osiot.length - 1 ? 2 : 0}
      key={value}
      {...getTestIdProps(`osioKuvaus.${value}`)}
    >
      <Field
        disabled={disabled}
        name={`${name}.osioKuvaukset.${value}.${language}`}
        component={FormFieldEditor}
        label={label}
      />
    </Spacing>
  ));
};

export const LisatiedotSection = ({ disabled, language, name }) => {
  const { t } = useTranslation();

  const { options: osiotOptions } = useKoodistoOptions({
    koodisto: 'koulutuksenlisatiedot',
  });

  return (
    <>
      <Typography variant="secondary" as="div" marginBottom={2}>
        {t('koulutuslomake.lisatiedotInfo')}
      </Typography>
      <Spacing marginBottom={2}>
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
      </Spacing>
      <OsiotFields
        disabled={disabled}
        name={name}
        language={language}
        osiotOptions={osiotOptions}
      />
    </>
  );
};
