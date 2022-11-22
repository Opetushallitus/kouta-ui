import React from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { FormFieldSwitch } from '#/src/components/formFields';
import { getTestIdProps } from '#/src/utils';

type AvoinKorkeakoulutusFieldProps = {
  name: string;
};

export const AvoinKorkeakoulutusField = ({
  name,
}: AvoinKorkeakoulutusFieldProps) => {
  const { t } = useTranslation();

  return (
    <div {...getTestIdProps('avoinKorkeakoulutus')}>
      <Field name={`${name}.avoinKorkeakoulutus`} component={FormFieldSwitch}>
        {t('toteutuslomake.avoinKorkeakoulutus')}
      </Field>
    </div>
  );
};
