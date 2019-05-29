import React from 'react';
import { Field } from 'redux-form';

import OrganisaatioHierarkiaTreeSelect from '../OrganisaatioHierarkiaTreeSelect';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import { createFormFieldComponent } from '../FormFields';
import { getTestIdProps } from '../../utils';
import useAuthorizedUser from '../useAuthorizedUser';

const JarjestajatField = createFormFieldComponent(
  OrganisaatioHierarkiaTreeSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  }),
);

const JarjestamispaikatSection = ({ organisaatioOid, name }) => {
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid);
  const user = useAuthorizedUser();

  return (
    <div {...getTestIdProps('jarjestamispaikatSelection')}>
      <Field
        name={name}
        hierarkia={hierarkia}
        user={user}
        component={JarjestajatField}
      />
    </div>
  );
};

export default JarjestamispaikatSection;
