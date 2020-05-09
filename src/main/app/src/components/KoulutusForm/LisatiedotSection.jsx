import React, { useMemo } from 'react';
import { Field } from 'redux-form';
import { get } from 'lodash';

import Spacing from '../Spacing';
import { useTranslation } from 'react-i18next';
import useKoodistoOptions from '../useKoodistoOptions';
import { getTestIdProps } from '../../utils';
import { FormFieldTextarea, FormFieldSelect } from '../formFields';
import Typography from '../Typography';
import { useFieldValue } from '#/src/hooks/form';

const OsiotFields = ({ disabled, language, osiotOptions, name }) => {
  const osiot = useFieldValue(`${name}.osiot`);
  const osiotArr = osiot || [];

  const osiotArrWithLabels = useMemo(() => {
    return osiotArr.map(({ value, label }) => ({
      value,
      label: label
        ? label
        : get(
            osiotOptions.find(({ value: v }) => v === value),
            'label'
          ) || null,
    }));
  }, [osiotArr, osiotOptions]);

  return osiotArrWithLabels.map(({ value, label }, index) => (
    <Spacing
      marginBottom={index !== osiot.length - 1 ? 2 : 0}
      key={value}
      {...getTestIdProps(`osioKuvaus.${value}`)}
    >
      <Field
        disabled={disabled}
        name={`${name}.osioKuvaukset.${value}.${language}`}
        component={FormFieldTextarea}
        label={label}
      />
    </Spacing>
  ));
};

const LisatiedotSection = ({ disabled, language, name }) => {
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

export default LisatiedotSection;
