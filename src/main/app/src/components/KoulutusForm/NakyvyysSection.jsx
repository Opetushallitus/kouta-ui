import React from 'react';
import { Field } from 'redux-form';

import Checkbox from '../Checkbox';
import useTranslation from '../useTranslation';

const renderCheckboxField = ({ input: { onChange, value }, label }) => (
  <Checkbox onChange={onChange} checked={value}>
    {label}
  </Checkbox>
);

export const NakyvyysSection = () => {
  const { t } = useTranslation();

  return (
    <Field
      name="julkinen"
      component={renderCheckboxField}
      label={t('koulutuslomake.koulutusOnJulkinen')}
    />
  );
};

export default NakyvyysSection;
