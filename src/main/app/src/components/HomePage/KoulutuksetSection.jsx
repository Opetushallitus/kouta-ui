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

import { getFirstLanguageValue } from '../../utils';

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
  const overlay = (
    <DropdownMenu>
      <DropdownMenuItem
        as={Link}
        to={`/organisaatio/${organisaatioOid}/koulutus?johtaaTutkintoon=true`}
      >
        Tutkintoon johtava koulutus
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
          <Button>
            Luo uusi koulutus{' '}
            <DropdownIcon open={visible} />
          </Button>
        </div>
      )}
    </UncontrolledDropdown>
  );
};

const Actions = ({ organisaatioOid }) => (
  <LuoKoulutusDropdown organisaatioOid={organisaatioOid} />
);

const tableColumns = [
  {
    title: 'Nimi',
    key: 'nimi',
    sortable: true,
    render: ({ nimi, oid }) => (
      <Anchor as={Link} to={`/koulutus/${oid}/muokkaus`}>
        {getFirstLanguageValue(nimi)}
      </Anchor>
    ),
  },
  {
    title: 'Tila',
    key: 'tila',
    sortable: true,
    render: ({ tila, oid }) => <KoulutusTilaDropdown initialTila={tila} koulutusOid={oid} />,
  },
  makeModifiedColumn(),
  makeMuokkaajaColumn(),
  {
    title: 'Kiinnitetyt toteutukset',
    key: 'toteutukset',
    render: ({ toteutukset = 0 }) => (
      <Badge color="primary">{toteutukset}</Badge>
    ),
  },
];

const KoulutuksetSection = ({ organisaatioOid }) => {
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

  const { data: { result: koulutukset, pageCount = 0 } = {} } = useApiAsync({
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

  return (
    <ListCollapse
      icon="school"
      header="Koulutukset"
      actions={<Actions organisaatioOid={organisaatioOid} />}
      defaultOpen
    >
      <Spacing marginBottom={2}>
        <Filters {...filtersProps} nimiPlaceholder="Hae koulutuksia" />
      </Spacing>

      {rows ? (
        <ListTable
          rows={rows}
          columns={tableColumns}
          onSort={setOrderBy}
          sort={orderBy}
        />
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
