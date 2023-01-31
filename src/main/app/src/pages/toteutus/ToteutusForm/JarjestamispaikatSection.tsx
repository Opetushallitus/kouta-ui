import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { createFormFieldComponent } from '#/src/components/formFields';
import OrganisaatioHierarkiaTreeSelect from '#/src/components/OrganisaatioHierarkiaTreeSelect';
import { Spin } from '#/src/components/virkailija';
import { TOTEUTUS_ROLE } from '#/src/constants';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { getTestIdProps } from '#/src/utils';

import { useTarjoajatHierarkia } from '../useTarjoajatHierarkia';

const JarjestajatField = createFormFieldComponent(
  OrganisaatioHierarkiaTreeSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  })
);

export const JarjestamispaikatSection = ({
  organisaatioOid,
  name,
  tarjoajat,
}) => {
  const { t } = useTranslation();
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const { hierarkia = [], isLoading } = useTarjoajatHierarkia(
    organisaatioOid,
    tarjoajat
  );

  const getIsDisabled = useCallback(
    organisaatio =>
      !roleBuilder.hasUpdate(TOTEUTUS_ROLE, organisaatio).result(),

    [roleBuilder]
  );

  return isLoading ? (
    <Spin />
  ) : (
    <div {...getTestIdProps('jarjestamispaikatSelection')}>
      <Field
        name={name}
        label={t('toteutuslomake.valitseMissaJarjestetaan')}
        hierarkia={hierarkia}
        getIsDisabled={getIsDisabled}
        component={JarjestajatField}
        disableAutoSelect={true}
        required
      />
    </div>
  );
};
