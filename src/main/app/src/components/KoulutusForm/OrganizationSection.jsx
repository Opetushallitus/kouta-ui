import React from 'react';
import { Field } from 'redux-form';

import JarjestajatSelect from './JarjestajatSelect';
import useTranslation from '../useTranslation';
import { createFormFieldComponent } from '../FormFields';

const OrganizationField = createFormFieldComponent(
  JarjestajatSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  }),
);

const OrganizationSection = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <Field
      name="organizations"
      organisaatioOid={organisaatioOid}
      component={OrganizationField}
      label={t('koulutuslomake.valitseJarjestajat')}
    />
  );
};

export default OrganizationSection;
