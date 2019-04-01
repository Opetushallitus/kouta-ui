import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import JarjestajatSelect from './JarjestajatSelect';
import useTranslation from '../useTranslation';

const renderOrganizationSelectionField = ({ input, organisaatioOid }) => (
  <JarjestajatSelect {...input} organisaatioOid={organisaatioOid} />
);

const OrganizationSection = ({ organisaatioOid, ...props }) => {
  const { t } = useTranslation();

  return (
    <div {...props}>
      <Typography variant="h6" marginBottom={1}>
        {t('koulutuslomake.valitseJarjestajat')}
      </Typography>
      <Field
        name="organizations"
        organisaatioOid={organisaatioOid}
        component={renderOrganizationSelectionField}
      />
    </div>
  );
};

export default OrganizationSection;
