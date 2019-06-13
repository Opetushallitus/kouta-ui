import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import ListCollapse from './ListCollapse';
import ListTable, {
  makeModifiedColumn,
  makeMuokkaajaColumn,
} from './ListTable';
import Button from '../Button';
import Pagination from '../Pagination';
import Flex from '../Flex';
import Spacing from '../Spacing';
import DropdownIcon from '../DropdownIcon';
import Spin from '../Spin';
import useApiAsync from '../useApiAsync';
import { getKoutaIndexKoulutukset } from '../../apiUtils';
import { getIndexParamsByFilters } from './utils';
import Filters from './Filters';
import Badge from '../Badge';
import useFilterState from './useFilterState';
import KoulutusTilaDropdown from './KoulutusTilaDropdown';
import ErrorAlert from '../ErrorAlert';

import { getFirstLanguageValue, getTestIdProps } from '../../utils';
import useTranslation from '../useTranslation';

import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownMenuItem,
} from '../Dropdown';

import Anchor from '../Anchor';

const getKoulutukset = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await getKoutaIndexKoulutukset({
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
        Tutkintoon johtava koulutus
      </DropdownMenuItem>
      <DropdownMenuItem
        as={Link}
        to={`/organisaatio/${organisaatioOid}/koulutus?johtaaTutkintoon=false`}
      >
        Tutkintoon johtamaton koulutus
      </DropdownMenuItem>
    </DropdownMenu>
  );

  return (
    <UncontrolledDropdown
      overlay={overlay}
      portalTarget={document.body}
      overflow
    >
      {({ ref, onToggle, visible }) => (
        <div ref={ref} onClick={onToggle}>
          <Button variant="outlined">
            {t('etusivu.luoUusiKoulutus')} <DropdownIcon open={visible} />
          </Button>
        </div>
      )}
    </UncontrolledDropdown>
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
        {getFirstLanguageValue(nimi, language)}
      </Anchor>
    ),
  },
  {
    title: t('yleiset.tila'),
    key: 'tila',
    sortable: true,
    render: ({ tila, oid }) => (
      <KoulutusTilaDropdown initialTila={tila} koulutusOid={oid} />
    ),
  },
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
    promiseFn: getKoulutukset,
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
    <ListCollapse
      icon="school"
      header={t('yleiset.koulutukset')}
      actions={canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null}
      defaultOpen
    >
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
        <Spin center />
      )}

      <Flex marginTop={3} justifyCenter>
        <Pagination value={page} onChange={setPage} pageCount={pageCount} />
      </Flex>
    </ListCollapse>
  );
};

export default KoulutuksetSection;
