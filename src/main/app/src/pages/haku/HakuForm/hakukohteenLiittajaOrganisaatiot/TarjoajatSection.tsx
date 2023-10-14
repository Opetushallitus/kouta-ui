import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import { Alert } from '#/src/components/Alert';
import {
  createFormFieldComponent,
  FormFieldCheckbox,
  simpleMapProps,
} from '#/src/components/formFields';
import { Box, Spin } from '#/src/components/virkailija';
import {
  KOULUTUS_ROLE,
  OPH_PAAKAYTTAJA_ROLE,
  KOULUTUSTYYPPI,
  ENTITY,
} from '#/src/constants';
import { useFieldValue } from '#/src/hooks/form';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import { getTestIdProps } from '#/src/utils';

import { TarjoajatLinkList } from './TarjoajatLinkList';
import { TarjoajatWithPagination } from './TarjoajatWithPagination';
import { useSelectableKoulutusTarjoajat } from './useSelectableKoulutusTarjoajat';

const TarjoajatFormField = createFormFieldComponent(
  TarjoajatWithPagination,
  simpleMapProps
);

const TarjoajatSelector = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  const isAvoinKorkeakoulutus = useFieldValue(
    'information.isAvoinKorkeakoulutus'
  );
  const isJulkinen = useFieldValue('julkinen', ENTITY.KOULUTUS);
  const koulutustyyppi = useFieldValue<KOULUTUSTYYPPI>('koulutustyyppi');

  const { tarjoajat, isLoading } = useSelectableKoulutusTarjoajat({
    organisaatioOid,
  });

  const roleBuilder = useAuthorizedUserRoleBuilder();

  const getIsDisabled = useCallback(
    organisaatio => {
      const requiredRole =
        koulutustyyppi === KOULUTUSTYYPPI.AMMATILLINEN_KOULUTUS
          ? OPH_PAAKAYTTAJA_ROLE
          : KOULUTUS_ROLE;
      return !roleBuilder.hasUpdate(requiredRole, organisaatio).result();
    },
    [roleBuilder, koulutustyyppi]
  );

  return isLoading ? (
    <Spin />
  ) : (
    <div {...getTestIdProps('tarjoajatSelection')}>
      <Field
        name="tarjoajat.tarjoajat"
        tarjoajat={tarjoajat}
        getIsDisabled={getIsDisabled}
        component={TarjoajatFormField}
        isAvoinKorkeakoulutus={isAvoinKorkeakoulutus}
        label={t('hakulomake.valitseLiittajaOrganisaatiot')}
        organisaatioOid={organisaatioOid}
        required={
          [
            KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOJAKSO,
            KOULUTUSTYYPPI.KORKEAKOULUTUS_OPINTOKOKONAISUUS,
            KOULUTUSTYYPPI.ERIKOISTUMISKOULUTUS,
          ].includes(koulutustyyppi) && !isJulkinen
        }
      />
    </div>
  );
};

export const TarjoajatSection = ({
  organisaatioOid,
  koulutus,
  disableTarjoajaHierarkia,
}) => {
  const { t } = useTranslation();

  const koulutusTarjoajaOids = koulutus?.tarjoajat ?? [];
  const isOphVirkailija = useIsOphVirkailija();

  const tarjoajatFromPohja = useFieldValue('pohja.tarjoajat');
  const kaytaPohjanJarjestajaa = useFieldValue(
    'tarjoajat.kaytaPohjanJarjestajaa'
  );

  return (
    <>
      {koulutusTarjoajaOids.length > 0 ||
        (disableTarjoajaHierarkia && (
          <Box mb={2}>
            <Alert status="info">
              {t('koulutuslomake.tarjoajienLukumaara', {
                lukumaara: koulutusTarjoajaOids.length,
              })}
            </Alert>
          </Box>
        ))}
      {isOphVirkailija && (
        <Box mb={2}>
          <TarjoajatLinkList koulutus={koulutus} />
        </Box>
      )}
      {!disableTarjoajaHierarkia && (
        <>
          {tarjoajatFromPohja && (
            <Box mb={2}>
              <Field
                name="tarjoajat.kaytaPohjanJarjestajaa"
                component={FormFieldCheckbox}
              >
                {t('koulutuslomake.kaytaPohjanJarjestajaa')}
              </Field>
            </Box>
          )}
          {tarjoajatFromPohja && kaytaPohjanJarjestajaa ? null : (
            <TarjoajatSelector
              // koulutus={koulutus}
              organisaatioOid={organisaatioOid}
            />
          )}
        </>
      )}
    </>
  );
};
