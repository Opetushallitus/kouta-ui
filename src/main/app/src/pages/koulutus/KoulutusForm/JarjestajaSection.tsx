import React, { useCallback } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import Alert from '#/src/components/Alert';
import {
  createFormFieldComponent,
  FormFieldCheckbox,
} from '#/src/components/formFields';
import OrganisaatioHierarkiaTreeSelect from '#/src/components/OrganisaatioHierarkiaTreeSelect';
import Spacing from '#/src/components/Spacing';
import { Box } from '#/src/components/virkailija';
import {
  KOULUTUS_ROLE,
  OPH_PAAKAYTTAJA_ROLE,
  ORGANISAATIOTYYPPI,
  KOULUTUSTYYPPI,
} from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { getTestIdProps } from '#/src/utils';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

const JarjestajatField = createFormFieldComponent(
  OrganisaatioHierarkiaTreeSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  })
);

const OrganizationSection = ({
  name,
  organisaatioOid,
  koulutus,
  disableTarjoajaHierarkia,
}) => {
  const { t } = useTranslation();
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid, {
    filter: _.negate(organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE)),
  });

  const roleBuilder = useAuthorizedUserRoleBuilder();
  const tarjoajat = _.get(koulutus, 'tarjoajat') || [];
  const tarjoajatFromPohja = useFieldValue('pohja.tarjoajat');
  const kaytaPohjanJarjestajaa = useFieldValue(
    'tarjoajat.kaytaPohjanJarjestajaa'
  );

  const getIsDisabled = useCallback(
    organisaatio => {
      const kt = koulutus ? koulutus.koulutustyyppi : 'unknown';
      const requiredRole =
        kt === KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
          ? OPH_PAAKAYTTAJA_ROLE
          : KOULUTUS_ROLE;
      return !roleBuilder.hasUpdate(requiredRole, organisaatio).result();
    },
    [roleBuilder, koulutus]
  );

  return (
    <>
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
        <>
          {tarjoajatFromPohja ? (
            <Spacing marginBottom={2}>
              <Field
                name={`tarjoajat.kaytaPohjanJarjestajaa`}
                component={FormFieldCheckbox}
              >
                {t('koulutuslomake.kaytaPohjanJarjestajaa')}
              </Field>
            </Spacing>
          ) : null}
          {tarjoajatFromPohja && kaytaPohjanJarjestajaa ? null : (
            <div {...getTestIdProps('jarjestajatSelection')}>
              <Field
                name={`tarjoajat.tarjoajat`}
                hierarkia={hierarkia}
                getIsDisabled={getIsDisabled}
                component={JarjestajatField}
                label={t('koulutuslomake.valitseJarjestajat')}
              />
            </div>
          )}
        </>
      ) : null}
    </>
  );
};

export default OrganizationSection;
