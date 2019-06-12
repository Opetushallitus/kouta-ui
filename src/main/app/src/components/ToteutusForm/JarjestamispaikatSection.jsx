import React, { useCallback } from 'react';
import { Field } from 'redux-form';

import OrganisaatioHierarkiaTreeSelect from '../OrganisaatioHierarkiaTreeSelect';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import { createFormFieldComponent } from '../FormFields';
import { getTestIdProps } from '../../utils';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { TOTEUTUS_ROLE } from '../../constants';

const JarjestajatField = createFormFieldComponent(
  OrganisaatioHierarkiaTreeSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  }),
);

const JarjestamispaikatSection = ({ organisaatioOid, name }) => {
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const getIsDisabled = useCallback(
    organisaatio => {
      return !roleBuilder.hasWrite(TOTEUTUS_ROLE, organisaatio).result();
    },
    [roleBuilder],
  );

  return (
    <div {...getTestIdProps('jarjestamispaikatSelection')}>
      <Field
        name={name}
        hierarkia={hierarkia}
        getIsDisabled={getIsDisabled}
        component={JarjestajatField}
      />
    </div>
  );
};

export default JarjestamispaikatSection;
