import React from 'react';

import { useTranslation } from 'react-i18next';

import { FormFieldInput } from '#/src/components/formFields';
import { Field } from '#/src/components/formFields/Field';
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
