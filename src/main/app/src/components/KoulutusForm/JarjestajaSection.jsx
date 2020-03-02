import React, { useCallback } from 'react';
import { Field } from 'redux-form';
import { get } from 'lodash';

import OrganisaatioHierarkiaTreeSelect from '../OrganisaatioHierarkiaTreeSelect';
import useTranslation from '../useTranslation';
import useOrganisaatioHierarkia from '../useOrganisaatioHierarkia';
import { createFormFieldComponent } from '../formFields';
import { getTestIdProps } from '../../utils';
import useAuthorizedUserRoleBuilder from '../useAuthorizedUserRoleBuilder';
import { KOULUTUS_ROLE } from '../../constants';
import Alert from '../Alert';
import Box from '../Box';

const JarjestajatField = createFormFieldComponent(
  OrganisaatioHierarkiaTreeSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  }),
);

const OrganizationSection = ({ organisaatioOid, name, koulutus, disableTarjoajaHierarkia }) => {
  const { t } = useTranslation();
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid);
  const roleBuilder = useAuthorizedUserRoleBuilder();
  const tarjoajat = get(koulutus, 'tarjoajat') || [];

  const getIsDisabled = useCallback(
    organisaatio => {
      return !roleBuilder.hasUpdate(KOULUTUS_ROLE, organisaatio).result();
    },
    [roleBuilder],
  );

  return (
    <div {...getTestIdProps('jarjestajatSelection')}>
      {tarjoajat.length > 0 || disableTarjoajaHierarkia ? (
        <Box mb={2}>
          <Alert variant="info">
            {t('koulutuslomake.tarjoajienLukumaara', {
              lukumaara: tarjoajat.length,
            })}
          </Alert>
        </Box>
      ) : null}

      {!disableTarjoajaHierarkia ? (
        <Field
          name={name}
          hierarkia={hierarkia}
          getIsDisabled={getIsDisabled}
          component={JarjestajatField}
          label={t('koulutuslomake.valitseJarjestajat')}
        />
      ) : null}
    </div>
  );
};

export default OrganizationSection;
