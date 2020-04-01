import React, { useCallback } from 'react';
import { Field } from 'redux-form';
import { get, includes, some } from 'lodash';

import { TOTEUTUS_ROLE } from '#/src/constants';
import { getTestIdProps } from '#/src/utils';
import parseParentOids from '#/src/utils/organisaatioService/parseParentOids';
import { createFormFieldComponent } from '#/src/components/formFields';
import OrganisaatioHierarkiaTreeSelect from '#/src/components/OrganisaatioHierarkiaTreeSelect';
import useOrganisaatioHierarkia from '#/src/components/useOrganisaatioHierarkia';
import useAuthorizedUserRoleBuilder from '#/src/components/useAuthorizedUserRoleBuilder';

const JarjestajatField = createFormFieldComponent(
  OrganisaatioHierarkiaTreeSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  }),
);

const JarjestamispaikatSection = ({ organisaatioOid, name, koulutus }) => {
  const koulutusTarjoajat = get(koulutus, 'tarjoajat');

  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid, {
    // Show only organisaatio-branches selected in the related koulutus
    filter: organisaatio =>
      some(koulutusTarjoajat, tarjoaja =>
        includes(parseParentOids(organisaatio.parentOidPath), tarjoaja),
      ),
  });

  const roleBuilder = useAuthorizedUserRoleBuilder();

  const getIsDisabled = useCallback(
    organisaatio =>
      !roleBuilder.hasUpdate(TOTEUTUS_ROLE, organisaatio).result(),
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
