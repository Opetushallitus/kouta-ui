import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import get from 'lodash/get';

import ListCollapse from './ListCollapse';
import Table, { TableHead, TableBody, TableRow, TableCell } from '../Table';
import Button from '../Button';
import Pagination from '../Pagination';
import Flex, { FlexItem } from '../Flex';
import TilaLabel from './TilaLabel';
import Input from '../Input';
import Checkbox from '../Checkbox';
import Spacing from '../Spacing';
import Icon from '../Icon';
import Spin from '../Spin';
import useApiAsync from '../useApiAsync';
import useDebounceState from '../useDebounceState';
import { getKoutaIndexKoulutukset } from '../../apiUtils';

import {
  getFirstLanguageValue,
  formatDateInFinnishTimeZone,
  isNumber,
} from '../../utils';

import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownMenuItem,
} from '../Dropdown';

import Anchor from '../Anchor';

const getKoulutukset = async ({
  httpClient,
  apiUrls,
  nimi,
  page,
  showArchived,
  organisaatioOid,
  orderBy: orderByArg,
}) => {
  const [orderField, orderDirection] = (orderByArg || '').split(':');

  const { result, totalCount } = await getKoutaIndexKoulutukset({
    httpClient,
    apiUrls,
    organisaatioOid: [organisaatioOid],
    nimi,
    page: isNumber(page) ? page + 1 : 1,
    pageSize: 10,
    orderField,
    orderDirection,
    showArchived,
  });

  return { result, pageCount: Math.ceil(totalCount / 10) };
};

const ToimenpiteetIcon = styled(Icon).attrs({ type: 'more_horiz' })`
  opacity: 0.6;
  transition: opacity 0.25s;
  cursor: pointer;
  font-size: 2rem;

  ${({ active }) =>
    active &&
    css`
      opacity: 1;
    `}

  &:hover {
    opacity: 1;
  }
`;

const ToimenpiteetCell = styled(TableCell)`
  text-align: center;
`;

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
            <Icon type={visible ? 'arrow_drop_up' : 'arrow_drop_down'} />
          </Button>
        </div>
      )}
    </UncontrolledDropdown>
  );
};

const ToimenpiteetDropdown = ({ onRemove = () => {} }) => {
  const overlay = (
    <DropdownMenu>
      <DropdownMenuItem onClick={onRemove}>Poista</DropdownMenuItem>
    </DropdownMenu>
  );

  return (
    <UncontrolledDropdown
      overlay={overlay}
      portalTarget={document.body}
      overflow
    >
      {({ ref, onToggle, visible }) => (
        <div ref={ref} onClick={onToggle} style={{ display: 'inline-block' }}>
          <ToimenpiteetIcon active={visible} />
        </div>
      )}
    </UncontrolledDropdown>
  );
};

const Actions = ({ organisaatioOid }) => (
  <LuoKoulutusDropdown organisaatioOid={organisaatioOid} />
);

const Filters = ({
  nimi,
  onNimiChange,
  showArchived,
  onShowArchivedChange,
}) => (
  <Flex alignCenter>
    <FlexItem grow={1} paddingRight={2}>
      <Input
        placeholder="Hae koulutuksia"
        value={nimi}
        onChange={onNimiChange}
      />
    </FlexItem>
    <FlexItem grow={0}>
      <Checkbox checked={showArchived} onChange={onShowArchivedChange}>
        Näytä myös arkistoidut
      </Checkbox>
    </FlexItem>
  </Flex>
);

const makeOnSort = ({ name, onSort }) => dir => onSort(`${name}:${dir}`);

const getSortDirection = ({ sort, name }) => {
  if (!sort) {
    return 'desc';
  }

  const [sortName, dir] = sort.split(':');

  if (!dir) {
    return 'desc';
  }

  return sortName === name ? dir : 'desc';
};

const KoulutuksetTable = ({ koulutukset, onSort, sort }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell
          sortDirection={getSortDirection({ sort, name: 'nimi' })}
          onSort={makeOnSort({ name: 'nimi', onSort })}
        >
          Nimi
        </TableCell>
        <TableCell
          sortDirection={getSortDirection({ sort, name: 'tila' })}
          onSort={makeOnSort({ name: 'tila', onSort })}
        >
          Tila
        </TableCell>
        <TableCell
          sortDirection={getSortDirection({ sort, name: 'modified' })}
          onSort={makeOnSort({ name: 'modified', onSort })}
        >
          Muokattu viimeksi
        </TableCell>
        <TableCell
          sortDirection={getSortDirection({ sort, name: 'muokkaaja' })}
          onSort={makeOnSort({ name: 'muokkaaja', onSort })}
        >
          Muokkaajan nimi
        </TableCell>
        <TableCell>Kiinnitetyt toteutukset</TableCell>
        <TableCell />
      </TableRow>
    </TableHead>
    <TableBody>
      {koulutukset.map(({ nimi, tila, modified, muokkaaja, oid }) => (
        <TableRow key={oid}>
          <TableCell>
            <Anchor as={Link} to={`/koulutus/${oid}/muokkaus`}>
              {getFirstLanguageValue(nimi)}
            </Anchor>
          </TableCell>
          <TableCell>
            <TilaLabel tila={tila} />
          </TableCell>
          <TableCell>
            {modified
              ? formatDateInFinnishTimeZone(
                  new Date(modified),
                  'DD.MM.YYYY HH:mm',
                )
              : null}
          </TableCell>
          <TableCell>{get(muokkaaja, 'nimi') || null}</TableCell>
          <TableCell> </TableCell>
          <ToimenpiteetCell>
            <ToimenpiteetDropdown />
          </ToimenpiteetCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const KoulutuksetSection = ({ organisaatioOid }) => {
  const [nimiFilter, setNimiFilter, debouncedNimiFilter] = useDebounceState(
    '',
    500,
  );

  const [page, setPage] = useState(0);
  const [archivedFilter, setArchivedFilter] = useState(false);
  const [orderBy, setOrderBy] = useState(null);

  const onNimiFilterChange = useCallback(
    e => {
      setNimiFilter(e.target.value);
    },
    [setNimiFilter],
  );

  const onArchivedFilterChange = useCallback(
    e => {
      setArchivedFilter(e.target.checked);
    },
    [setArchivedFilter],
  );

  const watch = JSON.stringify([
    page,
    debouncedNimiFilter,
    organisaatioOid,
    archivedFilter,
    orderBy,
  ]);

  const { data: { result: koulutukset, pageCount = 0 } = {} } = useApiAsync({
    promiseFn: getKoulutukset,
    nimi: debouncedNimiFilter,
    page,
    showArchived: archivedFilter,
    organisaatioOid,
    orderBy,
    watch,
  });

  return (
    <ListCollapse
      icon="school"
      header="Koulutukset"
      actions={<Actions organisaatioOid={organisaatioOid} />}
      defaultOpen
    >
      <Spacing marginBottom={2}>
        <Filters
          onNimiChange={onNimiFilterChange}
          nimi={nimiFilter}
          showArchived={archivedFilter}
          onShowArchivedChange={onArchivedFilterChange}
        />
      </Spacing>

      {koulutukset ? (
        <KoulutuksetTable
          koulutukset={koulutukset}
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
