import React, { useCallback, useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import Alert from '#/src/components/Alert';
import {
  createFormFieldComponent,
  FormFieldCheckbox,
} from '#/src/components/formFields';
import ListTable, { makeNimiColumn } from '#/src/components/ListTable';
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
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import { useOrganisaatiot } from '#/src/hooks/useOrganisaatio';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { getTestIdProps } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

const JarjestajatField = createFormFieldComponent(
  OrganisaatioHierarkiaTreeSelect,
  ({ input, ...props }) => ({
    ...input,
    ...props,
  })
);

export const JarjestajaSection = ({
  organisaatioOid,
  koulutus,
  disableTarjoajaHierarkia,
}) => {
  const { t } = useTranslation();
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid, {
    filter: _fp.negate(
      organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.TOIMIPISTE)
    ),
  });

  const roleBuilder = useAuthorizedUserRoleBuilder();
  const tarjoajaOids = koulutus?.tarjoajat ?? [];
  const isOphVirkailija = useIsOphVirkailija();

  const { organisaatiot: tarjoajat } = useOrganisaatiot(tarjoajaOids);
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

  const columns = [
    makeNimiColumn(t, {
      title: '',
      getLinkUrl: org => {
        if (organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.OPPILAITOS)(org)) {
          return `/organisaatio/${org.oid}/oppilaitos`;
        }
      },
    }),
  ];

  const rows = useMemo(() => {
    return _fp.flow(
      _fp.filter(Boolean),
      _fp.map((entity: any = {}) => ({ ...entity, key: entity.oid })),
      _fp.sortBy(e => getFirstLanguageValue(e.nimi))
    )(tarjoajat);
  }, [tarjoajat]);

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

      {isOphVirkailija && (
        <Box mb={2}>
          <ListTable rows={rows} columns={columns} />
        </Box>
      )}
      {!disableTarjoajaHierarkia ? (
        <>
          {tarjoajatFromPohja ? (
            <Spacing mb={2}>
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
