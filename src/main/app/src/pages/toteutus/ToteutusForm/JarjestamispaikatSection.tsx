import React, { useCallback } from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';

import OrganisaatioHierarkiaTreeSelect from '#/src/components/OrganisaatioHierarkiaTreeSelect';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { createFormFieldComponent } from '#/src/components/formFields';
import { getTestIdProps } from '#/src/utils';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { TOTEUTUS_ROLE } from '#/src/constants';

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
      />
    </div>
  );
};

export default JarjestamispaikatSection;
