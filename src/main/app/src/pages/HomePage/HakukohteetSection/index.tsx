import React, { useCallback, useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { createGlobalState } from 'react-use';

import Button from '#/src/components/Button';
import { ENTITY, ICONS } from '#/src/constants';
import useModal from '#/src/hooks/useModal';
import { hakukohdeService } from '#/src/machines/filterMachines';
import { EntityListActionBar } from '#/src/pages/HomePage/EntityListActionBar';
import { useChangeHakukohteetTilaMutation } from '#/src/pages/HomePage/HakukohteetSection/changeHakukohteetState';
import { createHakukohdeListColumns } from '#/src/pages/HomePage/HakukohteetSection/createHakukohdeListColumns';
import {
  StateChangeConfirmationModal,
  StateChangeConfirmationWrapper,
  useStateChangeConfirmationModal,
} from '#/src/pages/HomePage/StateChangeConfirmationModal';
import {
  SERVICE_BY_ENTITY,
  useEntitySelection,
  useEntitySelectionApi,
} from '#/src/pages/HomePage/useEntitySelection';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchHakukohteet } from '#/src/utils/hakukohde/searchHakukohteet';

import { EntitySearchList } from '../EntitySearchList';
import ListCollapse from '../ListCollapse';
import NavigationAnchor from '../NavigationAnchor';
import LiitoksetModal from './LiitoksetModal';

const { HAKUKOHDE } = ENTITY;

const useTilaState = createGlobalState(null);

export const useNewTila = () => {
  const [newTila, setNewTila] = useTilaState();
  return {
    tila: newTila,
    setNewTila: tila => setNewTila(tila),
  };
};

const HakukohdeActionBar = () => {
  const { selection, removeSelection } = useEntitySelection(HAKUKOHDE);

  const { openModal } = useStateChangeConfirmationModal();
  const { setNewTila } = useNewTila();

  const changeTila = useCallback(
    tila => {
      if (tila !== null && !_fp.isEmpty(selection)) {
        setNewTila(tila);
        return openModal();
      }
    },
    [selection, openModal, setNewTila]
  );
  return (
    <EntityListActionBar
      entityType={HAKUKOHDE}
      selection={selection}
      removeSelection={removeSelection}
      copyEntities={undefined}
      changeTila={changeTila}
    />
  );
};

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
      <Button onClick={open}>{t('yleiset.luoUusiHakukohde')}</Button>
    </>
  );
};

const HakukohteetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const { selection } = useEntitySelectionApi(SERVICE_BY_ENTITY[HAKUKOHDE]);

  const columns = useMemo(
    () =>
      createHakukohdeListColumns(
        t,
        organisaatioOid
      )(SERVICE_BY_ENTITY[HAKUKOHDE]),
    [t, organisaatioOid]
  );

  const createColumnsForConfirmationModal = useMemo(
    () => createHakukohdeListColumns(t, organisaatioOid),
    [t, organisaatioOid]
  );

  const changeHakukohteetTilaMutation = useChangeHakukohteetTilaMutation();

  const filterState = useFilterState(HAKUKOHDE, hakukohdeService);

  return (
    <StateChangeConfirmationWrapper entities={selection}>
      <StateChangeConfirmationModal
        onStateChangeSelection={changeHakukohteetTilaMutation}
        entities={selection}
        headerText={t('etusivu.hakukohde.vahvistaTilanmuutosOtsikko')}
        createColumns={createColumnsForConfirmationModal}
      />
      <NavigationAnchor id="hakukohteet" />
      <ListCollapse
        icon={ICONS[HAKUKOHDE]}
        header={t('yleiset.hakukohteet')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <EntitySearchList
          ActionBar={HakukohdeActionBar}
          searchEntities={searchHakukohteet}
          organisaatioOid={organisaatioOid}
          entityType={HAKUKOHDE}
          columns={columns}
          nimiPlaceholder={t('etusivu.haeHakukohteita')}
          filterState={filterState}
          searchPage="homepage.hakukohteet"
        />
      </ListCollapse>
    </StateChangeConfirmationWrapper>
  );
};

export default HakukohteetSection;
