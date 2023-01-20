import React, { useCallback, useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { createGlobalState } from 'react-use';

import Button from '#/src/components/Button';
import { CRUD_ROLES, ENTITY, ICONS } from '#/src/constants';
import { useCurrentUserHasRole } from '#/src/hooks/useCurrentUserHasRole';
import { useIsOphVirkailija } from '#/src/hooks/useIsOphVirkailija';
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
import { StateChangeResultModal } from '#/src/pages/HomePage/StateChangeResultModal';
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

export const useHakukohdeTila = () => {
  const [hakukohdeTila, setHakukohdeTila] = useTilaState();
  return {
    tila: hakukohdeTila,
    setHakukohdeTila: tila => setHakukohdeTila(tila),
  };
};

const HakukohdeActionBar = () => {
  const { selection, removeSelection } = useEntitySelection(HAKUKOHDE);

  const { openModal } = useStateChangeConfirmationModal();
  const { setHakukohdeTila } = useHakukohdeTila();

  const changeTila = useCallback(
    tila => {
      if (tila !== null && !_fp.isEmpty(selection)) {
        setHakukohdeTila(tila);
        return openModal();
      }
    },
    [selection, openModal, setHakukohdeTila]
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

export const createGetHakukohdeLinkUrl = organisaatioOid => oid =>
  `/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`;

const HakukohteetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();

  const isOphVirkailija = useIsOphVirkailija();

  const canEditHakukohde = useCurrentUserHasRole(
    ENTITY.HAKUKOHDE,
    CRUD_ROLES.UPDATE,
    organisaatioOid
  );

  const showTilaActionBar = isOphVirkailija || canEditHakukohde;

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
        onStateChangeSelection={changeHakukohteetTilaMutation.mutate}
        entities={selection}
        headerText={t('etusivu.hakukohde.vahvistaTilanmuutosOtsikko')}
        createColumns={createColumnsForConfirmationModal}
      />
      <StateChangeResultModal
        entityType={HAKUKOHDE}
        headerText={t('etusivu.hakukohde.tilamuutosTuloksetOtsikko')}
        mutationResult={changeHakukohteetTilaMutation}
        getLinkUrl={createGetHakukohdeLinkUrl(organisaatioOid)}
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
          ActionBar={showTilaActionBar ? HakukohdeActionBar : undefined}
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
