import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldInput } from '#/src/components/formFields';
import { getTestIdProps } from '#/src/utils';

type TunnisteFieldProps = {
  name: string;
};

export const TunnisteField = ({ name }: TunnisteFieldProps) => {
  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('tunniste')}>
      <Field
        name={`${name}.tunniste`}
        component={FormFieldInput}
        label={t('yleiset.tunniste')}
      />
    </div>
  );
};
