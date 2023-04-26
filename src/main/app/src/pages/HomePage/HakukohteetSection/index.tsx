import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

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
  useStateChangeBatchOpsApi,
} from '#/src/pages/HomePage/StateChangeConfirmationModal';
import { StateChangeResultModal } from '#/src/pages/HomePage/StateChangeResultModal';
import {
  SERVICE_BY_ENTITY,
  useEntitySelection,
} from '#/src/pages/HomePage/useEntitySelection';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchHakukohteet } from '#/src/utils/hakukohde/searchHakukohteet';

import { EntitySearchList } from '../EntitySearchList';
import ListCollapse from '../ListCollapse';
import NavigationAnchor from '../NavigationAnchor';
import LiitoksetModal from './LiitoksetModal';

const { HAKUKOHDE } = ENTITY;

const HakukohdeActionBar = () => {
  const { selection } = useEntitySelection(HAKUKOHDE);
  const { start, tila } = useStateChangeBatchOpsApi();

  const changeTila = useCallback(
    tila => {
      start({ tila, entities: selection });
    },
    [selection, start]
  );

  return (
    <EntityListActionBar
      entityType={HAKUKOHDE}
      changeTila={changeTila}
      tila={tila}
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

export const createGetHakukohdeLinkUrl = organisaatioOid => oid =>
  `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`;

const HakukohteetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

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

  const tilaMutationResult = useChangeHakukohteetTilaMutation();

  const filterState = useFilterState(HAKUKOHDE, hakukohdeService);

  return (
    <StateChangeConfirmationWrapper
      mutateAsync={tilaMutationResult.mutateAsync}
      entityTranslationKeyPath={'etusivu.hakukohde'}
    >
      <StateChangeConfirmationModal
        createColumns={createColumnsForConfirmationModal}
        entityTranslationKeyPath={'etusivu.hakukohde'}
      />
      <StateChangeResultModal
        entityType={HAKUKOHDE}
        getLinkUrl={createGetHakukohdeLinkUrl(organisaatioOid)}
        entityTranslationKeyPath={'etusivu.hakukohde'}
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
