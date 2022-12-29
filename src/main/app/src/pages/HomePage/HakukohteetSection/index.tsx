import React, { useCallback, useMemo } from 'react';

import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import Button from '#/src/components/Button';
import { ENTITY, ICONS } from '#/src/constants';
import useModal from '#/src/hooks/useModal';
import { hakukohdeService } from '#/src/machines/filterMachines';
import { EntityListActionBar } from '#/src/pages/HomePage/EntityListActionBar';
import { createHakukohdeListColumns } from '#/src/pages/HomePage/HakukohteetSection/createHakukohdeListColumns';
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
  const { selection, removeSelection } = useEntitySelection(HAKUKOHDE);

  const changeTila = useCallback(
    tila => {
      //TODO seivataan tallennuksen yhteydessä.
      if (tila !== null && !_fp.isEmpty(selection)) {
        console.log('testi tila');
        console.log(tila);
        console.log('testi selection');
        _fp.forEach(hakukohde => {
          console.log(hakukohde);
          // hakukohde.tila = tila?.value;
        }, selection);
      }
    },
    [selection]
  );
  return (
    <EntityListActionBar
      entityType={HAKUKOHDE}
      selection={selection}
      removeSelection={removeSelection}
      changeTila={changeTila}
      copyEntities={undefined}
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

  // const isYhteishaku = isYhteishakuHakutapa(haku?.hakutapaKoodiUri);

  const columns = useMemo(
    () =>
      createHakukohdeListColumns(
        t,
        organisaatioOid
      )(SERVICE_BY_ENTITY[HAKUKOHDE]),
    [t, organisaatioOid]
  );

  // const actionBar = isYhteishaku ? HakukohdeActionBar : undefined;

  const filterState = useFilterState(HAKUKOHDE, hakukohdeService);

  // const columns = useTableColumns(t, organisaatioOid);
  return (
    <>
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
    </>
  );
};

export default HakukohteetSection;
