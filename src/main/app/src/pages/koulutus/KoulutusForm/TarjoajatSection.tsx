import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';

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
import Switch from '#/src/components/Switch';
import { Box, Input, InputIcon, Spin } from '#/src/components/virkailija';
import {
  KOULUTUS_ROLE,
  OPH_PAAKAYTTAJA_ROLE,
  ORGANISAATIOTYYPPI,
  KOULUTUSTYYPPI,
} from '#/src/constants';
import { useFieldValue, useIsDirty } from '#/src/hooks/form';
import useAuthorizedUserRoleBuilder from '#/src/hooks/useAuthorizedUserRoleBuilder';
import { useHasChanged } from '#/src/hooks/useHasChanged';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
import { useOppilaitoksetForAvoinKorkeakoulutus } from '#/src/hooks/useOppilaitoksetForAvoinKorkeakoulutus';
import { useOrganisaatiot } from '#/src/hooks/useOrganisaatio';
import useOrganisaatioHierarkia from '#/src/hooks/useOrganisaatioHierarkia';
import { getTestIdProps, notToimipisteOrg } from '#/src/utils';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import {
  flatFilterHierarkia,
  flattenHierarkia,
} from '#/src/utils/organisaatio/hierarkiaHelpers';
import organisaatioMatchesTyyppi from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';
import { searchOrgsFromHierarkiaWithName } from '#/src/utils/searchOrgsFromHierarkiaWithName';

const PAGE_SIZE = 15;
const countPageNumber = orgs => Math.ceil(orgs.length / PAGE_SIZE);

const getItemsToShow = (
  hierarkia: Array<any>,
  value: Array<string>,
  naytaVainValitut: boolean
) => {
  let selectedKoulutustoimijaOids: Array<string> = [];

  return hierarkia
    .filter(org => {
      const isSelected = value.includes(org.oid);

      if (
        isSelected &&
        organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.KOULUTUSTOIMIJA)(org)
      ) {
        selectedKoulutustoimijaOids.push(org.oid);
      }

      return naytaVainValitut
        ? isSelected
        : isSelected ||
            organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.OPPILAITOS)(org);
    })
    .filter(org => {
      if (_.isEmpty(selectedKoulutustoimijaOids)) {
        return true;
      } else {
        return selectedKoulutustoimijaOids.every(ktOid => {
          return org.oid === ktOid || !org.parentOidPath.includes(ktOid);
        });
      }
    });
};

const useResetAvoinTarjoajat = ({
  value,
  organisaatioOid,
  isAvoinKorkeakoulutus,
  onChange,
}) => {
  const isAvoinKorkeakoulutusChanged = useHasChanged(isAvoinKorkeakoulutus);
  const isDirty = useIsDirty();

  const { hierarkia: h } = useOrganisaatioHierarkia(organisaatioOid, {
    enabled: !isAvoinKorkeakoulutus,
  });

  const omatOppilaitokset = flatFilterHierarkia(
    h,
    organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.OPPILAITOS)
  );

  const { organisaatiot = [] } = useOppilaitoksetForAvoinKorkeakoulutus({
    enabled: !isAvoinKorkeakoulutus,
  });

  const avoinKkOppilaitosOids = useMemo(
    () =>
      isAvoinKorkeakoulutus
        ? []
        : organisaatiot
            .filter(
              org =>
                !omatOppilaitokset.some(
                  oppilaitos => oppilaitos.oid === org.oid
                )
            )
            .map(org => org.oid),
    [organisaatiot, omatOppilaitokset, isAvoinKorkeakoulutus]
  );

  const hiddenOppilaitosOids = useRef<Array<string>>([]);

  useEffect(() => {
    if (isDirty && isAvoinKorkeakoulutusChanged) {
      if (isAvoinKorkeakoulutus) {
        onChange(_.uniq([...value, ...hiddenOppilaitosOids.current]));
        hiddenOppilaitosOids.current = [];
      } else {
        const oidsToHide: Array<string> = [];

        avoinKkOppilaitosOids.forEach(oid => {
          if (value.includes(oid)) {
            oidsToHide.push(oid);
          }
        });

        // Jos isAvoinKorkeakoulutus vaihtuu falseksi, karsitaan pois tarjoajia
        onChange(_.difference(value, oidsToHide));
        hiddenOppilaitosOids.current = oidsToHide;
      }
    }
  }, [
    isAvoinKorkeakoulutus,
    isAvoinKorkeakoulutusChanged,
    isDirty,
    onChange,
    value,
    avoinKkOppilaitosOids,
  ]);
};

const TarjoajatWithPagination = ({
  organisaatioOid,
  hierarkia,
  value,
  onChange,
  language,
  isLoading,
  isAvoinKorkeakoulutus,
}) => {
  const { t } = useTranslation();
  const [currentPage, setPage] = useState(0);
  const [usedNimi, setNimi] = useState('');
  const [naytaVainValitut, setNaytaVainValitut] = useState(false);
  const filteredHierarkia = getItemsToShow(hierarkia, value, naytaVainValitut);
  let itemsToShow = filteredHierarkia;
  let pageCount = countPageNumber(itemsToShow);
  const currentPageFirstItemIndex = currentPage * PAGE_SIZE;

  if (!_.isEmpty(usedNimi)) {
    itemsToShow = searchOrgsFromHierarkiaWithName(
      filteredHierarkia,
      usedNimi,
      language
    );
    pageCount = countPageNumber(itemsToShow);
  }

  useEffect(() => {
    setPage(0);
  }, [usedNimi, isAvoinKorkeakoulutus, naytaVainValitut]);

  useResetAvoinTarjoajat({
    isAvoinKorkeakoulutus,
    organisaatioOid,
    value,
    onChange,
  });

  const itemsOnPage = [
    itemsToShow.slice(
      currentPageFirstItemIndex,
      currentPageFirstItemIndex + PAGE_SIZE
    ),
  ].flat();

  const pageOids = itemsOnPage.map(org => org.oid);

  const onOrgsChange = useCallback(
    selectedPageOids => {
      onChange([..._.without(value, ...pageOids), ...selectedPageOids]);
    },
    [value, pageOids, onChange]
  );

  return isLoading ? (
    <Spin center />
  ) : (
    <>
      <Box display="flex" alignItems="flex-start" flexDirection="column">
        <Box width={1} mb={2}>
          <Input
            placeholder={t('koulutuslomake.haeJarjestajanNimella')}
            value={usedNimi}
            onChange={e => {
              setNimi(e.target.value);
            }}
            suffix={<InputIcon type="search" />}
          />
        </Box>
        <Box mb={2}>
          <Switch
            checked={naytaVainValitut}
            onChange={e => setNaytaVainValitut(e.target.checked)}
          >
            {t('koulutuslomake.naytaVainValitut')}
          </Switch>
        </Box>
      </Box>
      <Box marginBottom={2}>
        <OrganisaatioHierarkiaTreeSelect
          hierarkia={itemsOnPage}
          onChange={onOrgsChange}
          value={value}
          disableAutoSelect={true}
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
  TarjoajatWithPagination,
  simpleMapProps
);

const TarjoajatLinkList = ({ koulutus }) => {
  const { t } = useTranslation();

  const { organisaatiot: tarjoajat } = useOrganisaatiot(
    koulutus?.tarjoajat ?? []
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

  return <ListTable rows={rows} columns={columns} />;
};

export const useSelectableKoulutusTarjoajat = ({ organisaatioOid }) => {
  const isAvoinKorkeakoulutus = useFieldValue(
    'information.isAvoinKorkeakoulutus'
  );

  const { organisaatiot = [], isLoading: isLoadingOppilaitokset } =
    useOppilaitoksetForAvoinKorkeakoulutus({ enabled: isAvoinKorkeakoulutus });

  const { hierarkia = [], isLoading: isLoadingHierarkia } =
    useOrganisaatioHierarkia(organisaatioOid, {
      filter: notToimipisteOrg,
    });

  const tarjoajat = useMemo(
    () =>
      _.flow(
        h => (isAvoinKorkeakoulutus ? [...h, ...organisaatiot] : h),
        h => flattenHierarkia(h),
        h => _.sortBy(h, e => getFirstLanguageValue(e.nimi)),
        h => _.sortedUniqBy(h, 'oid')
      )(hierarkia),
    [hierarkia, organisaatiot, isAvoinKorkeakoulutus]
  );

  return {
    tarjoajat,
    isLoading: isLoadingHierarkia || isLoadingOppilaitokset,
  };
};

const TarjoajatSelector = ({ organisaatioOid, koulutus }) => {
  const { t } = useTranslation();

  const isAvoinKorkeakoulutus = useFieldValue(
    'information.isAvoinKorkeakoulutus'
  );

  const { tarjoajat, isLoading } = useSelectableKoulutusTarjoajat({
    organisaatioOid,
  });

  const roleBuilder = useAuthorizedUserRoleBuilder();

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

  return isLoading ? (
    <Spin />
  ) : (
    <div {...getTestIdProps('tarjoajatSelection')}>
      <Field
        name="tarjoajat.tarjoajat"
        hierarkia={tarjoajat}
        getIsDisabled={getIsDisabled}
        component={TarjoajatFormField}
        isAvoinKorkeakoulutus={isAvoinKorkeakoulutus}
        label={t('koulutuslomake.valitseJarjestajat')}
        organisaatioOid={organisaatioOid}
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
              koulutus={koulutus}
              organisaatioOid={organisaatioOid}
            />
          )}
        </>
      )}
    </>
  );
};
