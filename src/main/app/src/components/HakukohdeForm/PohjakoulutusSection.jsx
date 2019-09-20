import React from 'react';
import { Field } from 'redux-form';

import useKoodistoOptions from '../useKoodistoOptions';
import { getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import { FormFieldSelect } from '../formFields';

const PohjakoulutusSection = ({ name }) => {
  const { options } = useKoodistoOptions({
    koodisto: 'pohjakoulutusvaatimustoinenaste',
  });

  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('pohjakoulutusvaatimusSelect')}>
      <Field
        name={name}
        component={FormFieldSelect}
        options={options}
        label={t('hakukohdelomake.valitsePohjakoulutusvaatimus')}
        isMulti
      />
    </div>
  );
};

export default PohjakoulutusSection;
