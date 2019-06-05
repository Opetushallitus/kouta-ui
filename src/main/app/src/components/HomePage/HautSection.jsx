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
import Spin from '../Spin';
import useApiAsync from '../useApiAsync';
import { getKoutaIndexHaut } from '../../apiUtils';
import { getIndexParamsByFilters } from './utils';
import Filters from './Filters';
import Badge from '../Badge';
import useFilterState from './useFilterState';
import ErrorAlert from '../ErrorAlert';
import Anchor from '../Anchor';
import useTranslation from '../useTranslation';

import { getFirstLanguageValue, getTestIdProps } from '../../utils';

const getHaut = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await getKoutaIndexHaut({
    httpClient,
    apiUrls,
    ...params,
  });

  return { result, pageCount: Math.ceil(totalCount / 10) };
};

const Actions = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <Button as={Link} to={`/organisaatio/${organisaatioOid}/haku`}>
      {t('etusivu.luoUusiHaku')}
    </Button>
  );
};

const makeTableColumns = t => [
  {
    title: t('yleiset.nimi'),
    key: 'nimi',
    sortable: true,
    render: ({ nimi, oid, language }) => (
      <Anchor as={Link} to={`/haku/${oid}/muokkaus`}>
        {getFirstLanguageValue(nimi, language)}
      </Anchor>
    ),
  },
  makeTilaColumn(t),
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
  {
    title: 'Hakukohteet',
    key: 'hakukohteet',
    render: ({ hakukohteet = 0 }) => (
      <Badge color="primary">{hakukohteet}</Badge>
    ),
  },
];

const KoulutuksetSection = ({ organisaatioOid, canCreate }) => {
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
    data: { result: haut, pageCount = 0 } = {},
    error,
    reload,
  } = useApiAsync({
    promiseFn: getHaut,
    nimi: debouncedNimi,
    page,
    showArchived,
    organisaatioOid,
    orderBy,
    tila,
    watch,
  });

  const rows = useMemo(() => {
    return haut ? haut.map(haku => ({ ...haku, key: haku.oid })) : null;
  }, [haut]);

  const tableColumns = useMemo(() => makeTableColumns(t), [t]);

  return (
    <ListCollapse
      icon="access_time"
      header={t('yleiset.haut')}
      actions={canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null}
      defaultOpen
    >
      <Spacing marginBottom={2}>
        <Filters {...filtersProps} nimiPlaceholder={t('etusivu.haeHakuja')} />
      </Spacing>

      {rows ? (
        <ListTable
          rows={rows}
          columns={tableColumns}
          onSort={setOrderBy}
          sort={orderBy}
          {...getTestIdProps('hautTable')}
        />
      ) : error ? (
        <ErrorAlert onReload={reload} center />
      ) : (
        <Spin center />
      )}

      <Flex marginTop={2}>
        <Pagination value={page} onChange={setPage} pageCount={pageCount} />
      </Flex>
    </ListCollapse>
  );
};

export default KoulutuksetSection;
