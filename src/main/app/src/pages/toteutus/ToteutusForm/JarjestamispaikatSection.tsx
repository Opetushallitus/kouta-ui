import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { createFormFieldComponent } from '#/src/components/formFields';
import OrganisaatioHierarkiaTreeSelect from '#/src/components/OrganisaatioHierarkiaTreeSelect';
import { TOTEUTUS_ROLE } from '#/src/constants';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { getTestIdProps } from '#/src/utils';

const JarjestajatField = createFormFieldComponent(
  OrganisaatioHierarkiaTreeSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  })
);

const JarjestamispaikatSection = ({ organisaatioOid, name }) => {
  const { t } = useTranslation();
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const getIsDisabled = useCallback(
    organisaatio =>
      !roleBuilder.hasUpdate(TOTEUTUS_ROLE, organisaatio).result(),

    [roleBuilder]
  );

  return (
    <div {...getTestIdProps('jarjestamispaikatSelection')}>
      <Field
        name={name}
        label={t('toteutuslomake.valitseMissaJarjestetaan')}
        hierarkia={hierarkia}
        getIsDisabled={getIsDisabled}
        component={JarjestajatField}
        disableAutoSelect={true}
      />
    </div>
  );
};

export default JarjestamispaikatSection;
