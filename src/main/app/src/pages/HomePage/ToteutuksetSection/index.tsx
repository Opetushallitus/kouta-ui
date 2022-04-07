import React, { useCallback, useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import Badge from '#/src/components/Badge';
import Button from '#/src/components/Button';
import {
  makeKoulutustyyppiColumn,
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import { Checkbox, Box } from '#/src/components/virkailija';
import { ENTITY, ICONS } from '#/src/constants';
import useModal from '#/src/hooks/useModal';
import { useSelectedOrganisaatioOid } from '#/src/hooks/useSelectedOrganisaatio';
import { searchToteutukset } from '#/src/utils/toteutus/searchToteutukset';

import { EntityListActionBar } from '../EntityListActionBar';
import { EntitySearchList, useEntitySearch } from '../EntitySearchList';
import ListCollapse from '../ListCollapse';
import NavigationAnchor from '../NavigationAnchor';
import { useEntitySelection } from '../useEntitySelection';
import { useFilterState } from '../useFilterState';
import { KoulutusModal } from './KoulutusModal';

const { TOTEUTUS } = ENTITY;

const HeadingCheckbox = () => {
  const filterState = useFilterState(TOTEUTUS);

  const { selection, selectItems, deselectItems } =
    useEntitySelection(TOTEUTUS);

  const organisaatioOid = useSelectedOrganisaatioOid();

  const { data: pageData } = useEntitySearch({
    filterState,
    entityType: TOTEUTUS,
    searchEntities: searchToteutukset,
    organisaatioOid,
  });

  const pageItems = pageData?.result;

  const allPageItemsSelected = useMemo(
    () =>
      !_.isEmpty(pageItems) &&
      _.every(pageItems, ({ oid: pageOid }) =>
        selection.find(({ oid: selectionOid }) => pageOid === selectionOid)
      ),
    [selection, pageItems]
  );

  const onSelectionChange = useCallback(
    e => {
      if (e.currentTarget.checked) {
        selectItems(pageItems);
      } else {
        deselectItems(pageItems);
      }
    },
    [selectItems, deselectItems, pageItems]
  );

  return (
    <Checkbox onChange={onSelectionChange} checked={allPageItemsSelected} />
  );
};

const RowCheckbox = item => {
  const { selection, selectItems, deselectItems } =
    useEntitySelection(TOTEUTUS);

  const onSelectionChange = useCallback(
    e => {
      if (e.currentTarget.checked) {
        selectItems([item]);
      } else {
        deselectItems([item]);
      }
    },
    [selectItems, deselectItems, item]
  );

  return (
    <Checkbox
      checked={selection?.find(({ oid }) => item?.oid === oid)}
      onChange={onSelectionChange}
    />
  );
};

const useTableColumns = (t, organisaatioOid) =>
  useMemo(
    () => [
      {
        title: () => <HeadingCheckbox />,
        key: 'selected',
        Component: RowCheckbox,
      },
      makeNimiColumn(t, {
        getLinkUrl: ({ oid }) =>
          `/organisaatio/${organisaatioOid}/toteutus/${oid}/muokkaus`,
      }),
      makeKoulutustyyppiColumn(t),
      makeTilaColumn(t),
      makeModifiedColumn(t),
      makeMuokkaajaColumn(t),
      {
        title: t('etusivu.kiinnitetytHakukohteet'),
        key: 'hakukohteet',
        render: ({ hakukohdeCount = 0 }) => (
          <Box width="100%" textAlign="center">
            <Badge color="primary">{hakukohdeCount}</Badge>
          </Box>
        ),
      },
    ],
    [t, organisaatioOid]
  );

const Actions = ({ organisaatioOid }) => {
  const { isOpen, close, open } = useModal();
  const { t } = useTranslation();

  return (
    <>
      <KoulutusModal
        open={isOpen}
        organisaatioOid={organisaatioOid}
        onClose={close}
      />
      <Button onClick={open}>{t('yleiset.luoUusiToteutus')}</Button>
    </>
  );
};

const ToteutusActionBar = () => {
  const { selection, removeSelection } = useEntitySelection(TOTEUTUS);

  const onCopy = useCallback(() => {}, []);

  return (
    <EntityListActionBar
      selection={selection}
      removeSelection={removeSelection}
      copyEntities={onCopy}
    />
  );
};

const ToteutuksetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const columns = useTableColumns(t, organisaatioOid);

  return (
    <>
      <NavigationAnchor id="toteutukset" />
      <ListCollapse
        icon={ICONS[TOTEUTUS]}
        header={t('yleiset.toteutukset')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <EntitySearchList
          ActionBar={ToteutusActionBar}
          searchEntities={searchToteutukset}
          organisaatioOid={organisaatioOid}
          entityType={TOTEUTUS}
          columns={columns}
          nimiPlaceholder={t('etusivu.haeToteutuksia')}
        />
      </ListCollapse>
    </>
  );
};

export default ToteutuksetSection;
