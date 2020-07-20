import React, { useCallback } from 'react';
import { Field } from 'redux-form';
import { get, negate } from 'lodash';
import { useTranslation } from 'react-i18next';

import { KOULUTUS_ROLE, ORGANISAATIOTYYPPI } from '#/src/constants';
import { getTestIdProps } from '#/src/utils';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';
import Alert from '#/src/components/Alert';
import Box from '#/src/components/Box';
import OrganisaatioHierarkiaTreeSelect from '#/src/components/OrganisaatioHierarkiaTreeSelect';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import {
  createFormFieldComponent,
  FormFieldCheckbox,
} from '#/src/components/formFields';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { useFieldValue } from '#/src/hooks/form';
import Spacing from '#/src/components/Spacing';

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
    filter: negate(organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE)),
  });

  const roleBuilder = useAuthorizedUserRoleBuilder();
  const tarjoajat = get(koulutus, 'tarjoajat') || [];
  const tarjoajatFromPohja = useFieldValue('pohja.tarjoajat');
  const kaytaPohjanJarjestajaa = useFieldValue(
    'tarjoajat.kaytaPohjanJarjestajaa'
  );

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
            <Field
              name={`tarjoajat.zarjoajat`}
              hierarkia={hierarkia}
              getIsDisabled={getIsDisabled}
              component={JarjestajatField}
              label={t('koulutuslomake.valitseJarjestajat')}
            />
          )}
        </>
      ) : null}
    </div>
  );
};

export default OrganizationSection;
