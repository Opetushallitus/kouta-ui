import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import ListCollapse from './ListCollapse';

import ListTable, {
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeTilaColumn,
} from './ListTable';

import Button from '../Button';
import Pagination from '../Pagination';
import Flex from '../Flex';
import Spacing from '../Spacing';
import DropdownIcon from '../DropdownIcon';
import ListSpin from './ListSpin';
import useApiAsync from '../useApiAsync';
import getKoulutukset from '../../utils/koutaIndex/getKoulutukset';
import { getIndexParamsByFilters } from './utils';
import Filters from './Filters';
import Badge from '../Badge';
import useFilterState from './useFilterState';
import ErrorAlert from '../ErrorAlert';
import { getFirstLanguageValue, getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';
import NavigationAnchor from './NavigationAnchor';

import Dropdown, { DropdownMenu, DropdownMenuItem } from '../Dropdown';

import Anchor from '../Anchor';
import useInView from '../useInView';

const noopPromiseFn = () => Promise.resolve();

const getKoulutuksetFn = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await getKoulutukset({
    httpClient,
    apiUrls,
    ...params,
  });

  return { result, pageCount: Math.ceil(totalCount / 10) };
};

const LuoKoulutusDropdown = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  const overlay = (
    <DropdownMenu>
      <DropdownMenuItem
        as={Link}
        to={`/organisaatio/${organisaatioOid}/koulutus?johtaaTutkintoon=true`}
      >
        {t('yleiset.tutkintoonJohtavaKoulutus')}
      </DropdownMenuItem>
      <DropdownMenuItem
        as={Link}
        to={`/organisaatio/${organisaatioOid}/koulutus?johtaaTutkintoon=false`}
      >
        {t('yleiset.tutkintoonJohtamatonKoulutus')}
      </DropdownMenuItem>
    </DropdownMenu>
  );

  return (
    <Dropdown overlay={overlay} portalTarget={document.body} overflow>
      {({ ref, onToggle, open }) => (
        <div ref={ref} onClick={onToggle}>
          <Button>
            {t('etusivu.luoUusiKoulutus')} <DropdownIcon open={open} />
          </Button>
        </div>
      )}
    </Dropdown>
  );
};

const Actions = ({ organisaatioOid }) => (
  <LuoKoulutusDropdown organisaatioOid={organisaatioOid} />
);

const makeTableColumns = t => [
  {
    title: t('yleiset.nimi'),
    key: 'nimi',
    sortable: true,
    render: ({ nimi, oid, language }) => (
      <Anchor as={Link} to={`/koulutus/${oid}/muokkaus`}>
        {getFirstLanguageValue(nimi, language) || t('yleiset.nimeton')}
      </Anchor>
    ),
  },
  makeTilaColumn(t),
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
  {
    title: 'Kiinnitetyt toteutukset',
    key: 'toteutukset',
    render: ({ toteutukset = 0 }) => (
      <Badge color="primary">{toteutukset}</Badge>
    ),
  },
];

const KoulutuksetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const [ref, inView] = useInView({ threshold: 0.25, triggerOnce: true });

  const {
    debouncedNimi,
    showArchived,
    page,
    setPage,
    orderBy,
    setOrderBy,
    tila,
    filtersProps,
  } = useFilterState();

  const watch = JSON.stringify([
    page,
    debouncedNimi,
    organisaatioOid,
    showArchived,
    orderBy,
    tila,
  ]);

  const {
    data: { result: koulutukset, pageCount = 0 } = {},
    error,
    reload,
  } = useApiAsync({
    promiseFn: inView ? getKoulutuksetFn : noopPromiseFn,
    nimi: debouncedNimi,
    page,
    showArchived,
    organisaatioOid,
    orderBy,
    tila,
    watch,
  });

  const rows = useMemo(() => {
    return koulutukset
      ? koulutukset.map(koulutus => ({ ...koulutus, key: koulutus.oid }))
      : null;
  }, [koulutukset]);

  const tableColumns = useMemo(() => makeTableColumns(t), [t]);

  return (
    <>
      <NavigationAnchor id="koulutukset" />
      <ListCollapse
        icon="school"
        header={t('yleiset.koulutukset')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <div ref={ref} />

        <Spacing marginBottom={3}>
          <Filters
            {...filtersProps}
            nimiPlaceholder={t('etusivu.haeKoulutuksia')}
          />
        </Spacing>

        {rows ? (
          <ListTable
            rows={rows}
            columns={tableColumns}
            onSort={setOrderBy}
            sort={orderBy}
            {...getTestIdProps('koulutuksetTable')}
          />
        ) : error ? (
          <ErrorAlert onReload={reload} center />
        ) : (
          <ListSpin />
        )}

        <Flex marginTop={3} justifyCenter>
          <Pagination value={page} onChange={setPage} pageCount={pageCount} />
        </Flex>
      </ListCollapse>
    </>
  );
};

export default KoulutuksetSection;
