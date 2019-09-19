import React, { useMemo } from 'react';
import { Field } from 'redux-form';
import get from 'lodash/get';

import Spacing from '../Spacing';
import useTranslation from '../useTranslation';
import useKoodistoOptions from '../useKoodistoOptions';
import { getTestIdProps } from '../../utils';
import { FormFieldTextarea, FormFieldSelect } from '../formFields';
import Typography from '../Typography';
import useFieldValue from '../useFieldValue';

const OsiotFields = ({ language, osiotOptions, name }) => {
  const osiot = useFieldValue(`${name}.osiot`);
  const osiotArr = osiot || [];

  const osiotArrWithLabels = useMemo(() => {
    return osiotArr.map(({ value, label }) => ({
      value,
      label: label
        ? label
        : get(osiotOptions.find(({ value: v }) => v === value), 'label') ||
          null,
    }));
  }, [osiotArr, osiotOptions]);

  return osiotArrWithLabels.map(({ value, label }, index) => (
    <Spacing
      marginBottom={index !== osiot.length - 1 ? 2 : 0}
      key={value}
      {...getTestIdProps(`osioKuvaus.${value}`)}
    >
      <Field
        name={`${name}.osioKuvaukset.${value}.${language}`}
        component={FormFieldTextarea}
        label={label}
      />
    </Spacing>
  ));
};

const LisatiedotSection = ({ language, name }) => {
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
            name={`${name}.osiot`}
            component={FormFieldSelect}
            options={osiotOptions}
            label={t('yleiset.valitseLisattavaOsio')}
            isMulti
          />
        </div>
      </Spacing>
      <OsiotFields
        name={name}
        language={language}
        osiotOptions={osiotOptions}
      />
    </>
  );
};

export default LisatiedotSection;
