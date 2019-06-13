import React from 'react';
import { Field } from 'redux-form';

import Spacing from '../Spacing';
import useKoodistoOptions from '../useKoodistoOptions';
import useTranslation from '../useTranslation';
import { FormFieldRadioGroup, FormFieldYearSelect } from '../FormFields';

const AlkamiskausiSection = ({ name }) => {
  const { t } = useTranslation();
  const { options } = useKoodistoOptions({ koodisto: 'kausi' });

  return (
    <>
      <Spacing marginBottom={2}>
        <Field
          name={`${name}.kausi`}
          component={FormFieldRadioGroup}
          options={options}
          label={t('yleiset.kausi')}
        />
      </Spacing>
      <Spacing>
        <Field
          name={`${name}.vuosi`}
          component={FormFieldYearSelect}
          label={t('yleiset.vuosi')}
        />
      </Spacing>
    </>
  );
};

export default AlkamiskausiSection;
