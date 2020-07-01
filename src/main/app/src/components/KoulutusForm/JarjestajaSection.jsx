import React, { useCallback } from 'react';
import { Field } from 'redux-form';
import { get, negate } from 'lodash';
import { useTranslation } from 'react-i18next';

import { KOULUTUS_ROLE, ORGANISAATIOTYYPPI } from '#/src/constants';
import { getTestIdProps } from '#/src/utils';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatioService/organisaatioMatchesTyyppi';
import Alert from '#/src/components/Alert';
import Box from '#/src/components/Box';
import OrganisaatioHierarkiaTreeSelect from '#/src/components/OrganisaatioHierarkiaTreeSelect';
import useOrganisaatioHierarkia from '#/src/components/useOrganisaatioHierarkia';
import { createFormFieldComponent } from '#/src/components/formFields';
import useAuthorizedUserRoleBuilder from '#/src/components/useAuthorizedUserRoleBuilder';

const JarjestajatField = createFormFieldComponent(
  OrganisaatioHierarkiaTreeSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  })
);

const OrganizationSection = ({
  organisaatioOid,
  name,
  koulutus,
  disableTarjoajaHierarkia,
}) => {
  const { t } = useTranslation();
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid, {
    filter: negate(organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE)),
  });

  const roleBuilder = useAuthorizedUserRoleBuilder();
  const tarjoajat = get(koulutus, 'tarjoajat') || [];

  const getIsDisabled = useCallback(
    organisaatio =>
      !roleBuilder.hasUpdate(KOULUTUS_ROLE, organisaatio).result(),
    [roleBuilder]
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
