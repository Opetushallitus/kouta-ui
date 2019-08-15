import React, { useCallback } from 'react';
import { Field } from 'redux-form';

import OrganisaatioHierarkiaTreeSelect from '../OrganisaatioHierarkiaTreeSelect';
import useTranslation from '../useTranslation';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import { createFormFieldComponent } from '../FormFields';
import { getTestIdProps } from '../../utils';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { KOULUTUS_ROLE } from '../../constants';

const JarjestajatField = createFormFieldComponent(
  OrganisaatioHierarkiaTreeSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  }),
);

const OrganizationSection = ({ organisaatioOid, name }) => {
  const { t } = useTranslation();
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const getIsDisabled = useCallback(
    organisaatio => {
      return !roleBuilder.hasUpdate(KOULUTUS_ROLE, organisaatio).result();
    },
    [roleBuilder],
  );

  return (
    <div {...getTestIdProps('jarjestajatSelection')}>
      <Field
        name={name}
        hierarkia={hierarkia}
        getIsDisabled={getIsDisabled}
        component={JarjestajatField}
        label={t('koulutuslomake.valitseJarjestajat')}
      />
    </div>
  );
};

export default OrganizationSection;
