import React, { useCallback, useMemo, useState } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Field } from 'redux-form';

import Alert from '#/src/components/Alert';
import {
  createFormFieldComponent,
  FormFieldCheckbox,
  simpleMapProps,
} from '#/src/components/formFields';
import ListTable, { makeNimiColumn } from '#/src/components/ListTable';
import OrganisaatioHierarkiaTreeSelect from '#/src/components/OrganisaatioHierarkiaTreeSelect';
import Pagination from '#/src/components/Pagination';
import { Box, Input, InputIcon, Spin } from '#/src/components/virkailija';
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
import { getTestIdProps, notToimipisteOrg } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';
import { searchOrgsFromHierarkiaWithName } from '#/src/utils/searchOrgsFromHierarkiaWithName';

const NUM_OF_ITEMS_ON_PAGE = 10;
const countPageNumber = orgs => Math.ceil(orgs.length / NUM_OF_ITEMS_ON_PAGE);

const JarjestajatWithPagination = ({
  hierarkia,
  value,
  onChange,
  language,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [currentPage, setPage] = useState(0);
  const [usedNimi, setNimi] = useState('');
  let itemsToShow = hierarkia || [];
  let pageCount = countPageNumber(hierarkia);
  const currentPageFirstItemIndex = currentPage * NUM_OF_ITEMS_ON_PAGE;

  if (!_.isEmpty(usedNimi)) {
    const foundOrgs = searchOrgsFromHierarkiaWithName(
      hierarkia,
      usedNimi,
      language
    );
    pageCount = countPageNumber(foundOrgs);
    itemsToShow = foundOrgs;
  }

  const itemsOnPage = [
    itemsToShow.slice(
      currentPageFirstItemIndex,
      currentPageFirstItemIndex + NUM_OF_ITEMS_ON_PAGE
    ),
  ].flat();

  const oids = item => {
    if (item) {
      if (_.isEmpty(item.children)) {
        return [item.oid];
      }

      return [item.oid, ...item.children.map(oids).flat()];
    }

    return [];
  };

  const pageOids = itemsOnPage.map(oids).flat();

  return isLoading ? (
    <Spin center />
  ) : (
    <>
      <Box display="flex" alignItems="center">
        <Box width={1} marginBottom={2}>
          <Input
            placeholder={t('koulutuslomake.haeJarjestajanNimella')}
            value={usedNimi}
            onChange={e => {
              setNimi(e.target.value);
            }}
            suffix={<InputIcon type="search" />}
          />
        </Box>
      </Box>
      <Box marginBottom={2}>
        <OrganisaatioHierarkiaTreeSelect
          hierarkia={itemsOnPage}
          onChange={selectedPageOids => {
            onChange([
              ...value.filter(oid => !pageOids.includes(oid)),
              ...selectedPageOids,
            ]);
          }}
          value={value}
        />
      </Box>
      <Pagination
        value={currentPage}
        onChange={setPage}
        pageCount={pageCount}
      />
    </>
  );
};

const TarjoajatFormField = createFormFieldComponent(
  JarjestajatWithPagination,
  simpleMapProps
);

export const TarjoajatSection = ({
  organisaatioOid,
  koulutus,
  disableTarjoajaHierarkia,
}) => {
  const { t } = useTranslation();

  // TODO: Voisi noutaa näytettävät tarjoajat kouta-backendistä
  const { hierarkia = [] } = useOrganisaatioHierarkia(organisaatioOid, {
    filter: notToimipisteOrg,
  });

  const roleBuilder = useAuthorizedUserRoleBuilder();
  const koulutusTarjoajaOids = koulutus?.tarjoajat ?? [];
  const isOphVirkailija = useIsOphVirkailija();

  const { organisaatiot: tarjoajat } = useOrganisaatiot(koulutusTarjoajaOids);
  const tarjoajatFromPohja = useFieldValue('pohja.tarjoajat');
  const kaytaPohjanJarjestajaa = useFieldValue(
    'tarjoajat.kaytaPohjanJarjestajaa'
  );

  const getIsDisabled = useCallback(
    organisaatio => {
      const kt = koulutus?.koulutustyyppi ?? 'unknown';
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
    return _.flow(
      _.compact,
      ts => _.map(ts, (entity: any = {}) => ({ ...entity, key: entity.oid })),
      ts => _.sortBy(ts, e => getFirstLanguageValue(e.nimi))
    )(tarjoajat);
  }, [tarjoajat]);

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
          <ListTable rows={rows} columns={columns} />
        </Box>
      )}
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
            <div {...getTestIdProps('tarjoajatSelection')}>
              <Field
                name="tarjoajat.tarjoajat"
                hierarkia={hierarkia}
                getIsDisabled={getIsDisabled}
                component={TarjoajatFormField}
                label={t('koulutuslomake.valitseJarjestajat')}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};
