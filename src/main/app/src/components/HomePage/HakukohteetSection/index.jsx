import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import Box from '../../Box';
import ListCollapse from '../ListCollapse';
import useTranslation from '../../useTranslation';
import useInView from '../../useInView';
import NavigationAnchor from '../NavigationAnchor';
import Button from '../../Button';
import useModal from '../../useModal';
import LiitoksetModal from './LiitoksetModal';
import Pagination from '../../Pagination';
import ListSpin from '../ListSpin';
import useApiAsync from '../../useApiAsync';
import { getIndexParamsByFilters } from '../utils';
import Filters from '../Filters';
import useFilterState from '../useFilterState';
import ErrorAlert from '../../ErrorAlert';
import Anchor from '../../Anchor';
import getHakukohteet from '../../../utils/koutaSearch/getHakukohteet';
import { getFirstLanguageValue, getTestIdProps } from '../../../utils';

import ListTable, {
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeTilaColumn,
} from '../ListTable';

const noopPromiseFn = () => Promise.resolve();

const getHakukohteetFn = async ({ httpClient, apiUrls, ...filters }) => {
  const params = getIndexParamsByFilters(filters);

  const { result, totalCount } = await getHakukohteet({
    httpClient,
    apiUrls,
    ...params,
  });

  return { result, pageCount: Math.ceil(totalCount / 10) };
};

const makeTableColumns = (t, organisaatioOid) => [
  {
    title: t('yleiset.nimi'),
    key: 'nimi',
    sortable: true,
    render: ({ nimi, oid, language }) => (
      <Anchor
        as={Link}
        to={`/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`}
      >
        {getFirstLanguageValue(nimi, language) || t('yleiset.nimeton')}
      </Anchor>
    ),
  },
  makeTilaColumn(t),
  makeModifiedColumn(t),
  makeMuokkaajaColumn(t),
];

const Actions = ({ organisaatioOid }) => {
  const { isOpen, close, open } = useModal();
  const { t } = useTranslation();

  return (
    <>
      <LiitoksetModal
        open={isOpen}
        organisaatioOid={organisaatioOid}
        onClose={close}
      />
      <Button onClick={open}>{t('etusivu.luoUusiHakukohde')}</Button>
    </>
  );
};

const HakukohteetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const [ref, inView] = useInView({
    threshold: 0.25,
    triggerOnce: true,
  });

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
    promiseFn: inView ? getHakukohteetFn : noopPromiseFn,
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

  const tableColumns = useMemo(() => makeTableColumns(t, organisaatioOid), [
    t,
    organisaatioOid,
  ]);

  return (
    <>
      <NavigationAnchor id="hakukohteet" />
      <ListCollapse
        icon="grain"
        header={t('yleiset.hakukohteet')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <div ref={ref} />

        <Box mb={3}>
          <Filters
            {...filtersProps}
            nimiPlaceholder={t('etusivu.haeHakukohteita')}
          />
        </Box>

        {rows ? (
          <ListTable
            rows={rows}
            columns={tableColumns}
            onSort={setOrderBy}
            sort={orderBy}
            {...getTestIdProps('hakukohteetTable')}
          />
        ) : error ? (
          <ErrorAlert onReload={reload} center />
        ) : (
          <ListSpin />
        )}

        <Box mt={3} display="flex" justifyContent="center">
          <Pagination value={page} onChange={setPage} pageCount={pageCount} />
        </Box>
      </ListCollapse>
    </>
  );
};

export default HakukohteetSection;
