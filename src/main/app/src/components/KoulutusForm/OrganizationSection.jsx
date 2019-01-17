import React from 'react';
import { Field } from 'redux-form';

import Typography from '../Typography';
import JarjestajatSelect from './JarjestajatSelect';

const renderOrganizationSelectionField = ({ input, organisaatioOid }) => (
  <JarjestajatSelect {...input} organisaatioOid={organisaatioOid} />
);

const OrganizationSection = ({ organisaatioOid, ...props }) => {
  return (
    <div {...props}>
      <Typography variant="h6" marginBottom={1}>
        Valitse ne organisaatiot, jotka järjestävät koulutusta
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
