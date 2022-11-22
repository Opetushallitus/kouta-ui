import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import Alert from '#/src/components/Alert';
import {
  createFormFieldComponent,
  FormFieldCheckbox,
} from '#/src/components/formFields';
import OrganisaatioHierarkiaTreeSelect from '#/src/components/OrganisaatioHierarkiaTreeSelect';
import { Box } from '#/src/components/virkailija';
import {
  KOULUTUS_ROLE,
  OPH_PAAKAYTTAJA_ROLE,
  KOULUTUSTYYPPI,
} from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import useOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus from '#/src/hooks/useOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus';
import { getTestIdProps } from '#/src/utils';

const JarjestajatField = createFormFieldComponent(
  OrganisaatioHierarkiaTreeSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  })
);

export const JarjestajaSectionForKkOpintojaksoAndOpintokokonaisuus = ({
  organisaatioOid,
  koulutus,
  disableTarjoajaHierarkia,
}) => {
  const { t } = useTranslation();

  const { organisaatiot } =
    useOppilaitoksetForKkOpintojaksoAndOpintokokonaisuus();

  const roleBuilder = useAuthorizedUserRoleBuilder();
  const tarjoajaOids = koulutus?.tarjoajat ?? [];

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
      {tarjoajaOids.length > 0 || disableTarjoajaHierarkia ? (
        <Box mb={2}>
          <Alert status="info">
            {t('koulutuslomake.tarjoajienLukumaara', {
              lukumaara: tarjoajaOids.length,
            })}
          </Alert>
        </Box>
      ) : null}

      {!disableTarjoajaHierarkia && (
        <>
          {tarjoajatFromPohja && (
            <Box mb={2}>
              <Field
                name={`tarjoajat.kaytaPohjanJarjestajaa`}
                component={FormFieldCheckbox}
              >
                {t('koulutuslomake.kaytaPohjanJarjestajaa')}
              </Field>
            </Box>
          )}
          {tarjoajatFromPohja && kaytaPohjanJarjestajaa ? null : (
            <div {...getTestIdProps('jarjestajatSelection')}>
              <Field
                name={`tarjoajat.tarjoajat`}
                hierarkia={organisaatiot}
                getIsDisabled={getIsDisabled}
                component={JarjestajatField}
                label={t(
                  'koulutuslomake.valitseOpintojaksonTaiKokonaisuudenJarjestajat'
                )}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};
