import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import {
  createFormFieldComponent,
  selectMapProps,
} from '#/src/components/formFields';
import { getTestIdProps } from '#/src/utils';

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
