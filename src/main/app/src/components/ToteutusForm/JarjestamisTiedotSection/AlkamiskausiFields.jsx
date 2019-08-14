import React from 'react';
import { Field } from 'redux-form';

import Spacing from '../../Spacing';
import useKoodistoOptions from '../../useKoodistoOptions';
import YearSelect from '../../YearSelect';
import { noop, getTestIdProps } from '../../../utils';
import useTranslation from '../../useTranslation';
import { FormFieldRadioGroup, createFormFieldComponent } from '../../FormFields';

const YearField = createFormFieldComponent(
  YearSelect,
  ({ input, ...props }) => ({
    ...input,
    onBlur: noop,
    ...props,
  }),
);

const AlkamiskausiFields = ({ name }) => {
  const { t } = useTranslation();
  const { options } = useKoodistoOptions({ koodisto: 'kausi' });

  return (
    <>
      <Spacing marginBottom={2}>
        <Field
          name={`${name}.kausi`}
          component={FormFieldRadioGroup}
          label={t('yleiset.kausi')}
          options={options}
        />
      </Spacing>
      <Spacing>
        <div {...getTestIdProps('vuosi')}>
          <Field
            name={`${name}.vuosi`}
            component={YearField}
            label={t('yleiset.vuosi')}
          />
        </div>
      </Spacing>
    </>
  );
};

export default AlkamiskausiFields;
