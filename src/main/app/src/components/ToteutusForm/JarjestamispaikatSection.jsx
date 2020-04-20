import React, { useCallback } from 'react';
import { Field } from 'redux-form';
import { useTranslation } from 'react-i18next';
import OrganisaatioHierarkiaTreeSelect from '../OrganisaatioHierarkiaTreeSelect';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import { createFormFieldComponent } from '../formFields';
import { getTestIdProps } from '../../utils';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { TOTEUTUS_ROLE } from '#/src/constants';

const JarjestajatField = createFormFieldComponent(
  OrganisaatioHierarkiaTreeSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  }),
);

const JarjestamispaikatSection = ({ organisaatioOid, name }) => {
  const { t } = useTranslation();
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();

  const getIsDisabled = useCallback(
    organisaatio => {
      return !roleBuilder.hasUpdate(TOTEUTUS_ROLE, organisaatio).result();
    },
    [roleBuilder],
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
