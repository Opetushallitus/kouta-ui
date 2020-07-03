import React from 'react';
import { Field } from 'redux-form';

import TutkintonimikeSelect from './TutkintonimikeSelect';
import { useTranslation } from 'react-i18next';
import { getTestIdProps } from '../../../utils';
import { createFormFieldComponent, selectMapProps } from '../../formFields';

const TutkintonimikeFieldComponent = createFormFieldComponent(
  TutkintonimikeSelect,
  selectMapProps
);

export const TutkintonimikeField = ({ disabled, name }) => {
  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('tutkintonimikeSelect')}>
      <Field
        disabled={disabled}
        name={`${name}.tutkintonimike`}
        component={TutkintonimikeFieldComponent}
        label={t('koulutuslomake.valitseTutkintonimike')}
      />
    </div>
  );
};

export default TutkintonimikeField;
