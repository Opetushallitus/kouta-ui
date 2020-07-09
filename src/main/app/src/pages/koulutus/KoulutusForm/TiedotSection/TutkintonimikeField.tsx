import React from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import { getTestIdProps } from '#/src/utils';
import {
  createFormFieldComponent,
  selectMapProps,
} from '#/src/components/formFields';
import TutkintonimikeSelect from './TutkintonimikeSelect';

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
