import React, { useMemo } from 'react';
import { Field, formValues } from 'redux-form';
import get from 'lodash/get';

import Spacing from '../Spacing';
import useTranslation from '../useTranslation';
import useKoodistoOptions from '../useKoodistoOptions';
import { getTestIdProps } from '../../utils';
import { FormFieldTextarea, FormFieldSelect } from '../FormFields';

const OsiotFieldsBase = ({ osiot, language, osiotOptions }) => {
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
        name={`osioKuvaukset.${value}.${language}`}
        component={FormFieldTextarea}
        label={label}
      />
    </Spacing>
  ));
};

const OsiotFields = formValues({ osiot: 'osiot' })(OsiotFieldsBase);

const LisatiedotSection = ({ language }) => {
  const { t } = useTranslation();
  const { options: osiotOptions } = useKoodistoOptions({
    koodisto: 'koulutuksenjarjestamisenlisaosiot',
  });

  return (
    <>
      <Spacing marginBottom={2}>
        <div {...getTestIdProps('osiotSelect')}>
          <Field
            name="osiot"
            component={FormFieldSelect}
            options={osiotOptions}
            label={t('yleiset.valitseLisattavaOsio')}
            isMulti
          />
        </div>
      </Spacing>
      <OsiotFields language={language} osiotOptions={osiotOptions} />
    </>
  );
};

export default LisatiedotSection;
