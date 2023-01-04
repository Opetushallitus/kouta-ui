import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import { ENTITY, ICONS } from '#/src/constants';
import useModal from '#/src/hooks/useModal';
import { hakukohdeService } from '#/src/machines/filterMachines';
import { EntityListActionBar } from '#/src/pages/HomePage/EntityListActionBar';
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

const HakukohdeActionBar = () => {
  const { selection, removeSelection } = useEntitySelection(HAKUKOHDE);

  const { openModal } = useStateChangeConfirmationModal();

  // const changeTila = useCallback(
  //   tila => {
  //     //TODO seivataan tallennuksen yhteydessä.
  //     if (tila !== null && !_fp.isEmpty(selection)) {
  //       console.log('testi tila');
  //       console.log(tila);
  //       console.log('testi selection');
  //       useStateChangeConfirmationModal(tila);
  //       // _fp.forEach(hakukohde => {
  //       //   console.log(hakukohde);
  //       //   // hakukohde.tila = tila?.value;
  //       // }, selection);
  //     }
  //   }
  // );
  return (
    <EntityListActionBar
      entityType={HAKUKOHDE}
      selection={selection}
      removeSelection={removeSelection}
      copyEntities={undefined}
      changeTila={openModal}
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

  // const isYhteishaku = isYhteishakuHakutapa(haku?.hakutapaKoodiUri);

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

  // const actionBar = isYhteishaku ? HakukohdeActionBar : undefined;

  const filterState = useFilterState(HAKUKOHDE, hakukohdeService);

  return (
    <StateChangeConfirmationWrapper entities={selection}>
      <StateChangeConfirmationModal
        onStateChangeSelection={undefined}
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
