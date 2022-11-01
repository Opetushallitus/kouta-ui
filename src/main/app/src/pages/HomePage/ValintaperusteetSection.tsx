import React, { useContext, useMemo } from 'react';

import { useActor } from '@xstate/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Button from '#/src/components/Button';
import {
  makeJulkinenColumn,
  makeKoulutustyyppiColumn,
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import { ENTITY, ICONS } from '#/src/constants';
import { FilterStateContext } from '#/src/pages/HomePage/FilterStateProvider';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchValintaperusteet } from '#/src/utils/valintaperuste/searchValintaperusteet';

import { EntitySearchList } from './EntitySearchList';
import ListCollapse from './ListCollapse';
import NavigationAnchor from './NavigationAnchor';

const { VALINTAPERUSTE } = ENTITY;

const Actions = ({ organisaatioOid }) => {
  const { t } = useTranslation();

  return (
    <Button
      as={Link}
      to={`/organisaatio/${organisaatioOid}/valintaperusteet/kielivalinnat/`}
    >
      {t('yleiset.luoUusiValintaperuste')}
    </Button>
  );
};

const useTableColumns = (t, organisaatioOid) =>
  useMemo(
    () => [
      makeNimiColumn(t, {
        getLinkUrl: ({ id }) =>
          `/organisaatio/${organisaatioOid}/valintaperusteet/${id}/muokkaus`,
      }),
      makeKoulutustyyppiColumn(t),
      makeTilaColumn(t),
      makeModifiedColumn(t),
      makeMuokkaajaColumn(t),
      makeJulkinenColumn(t),
    ],
    [t, organisaatioOid]
  );

const ValintaperusteetSection = ({ organisaatioOid, canCreate = true }) => {
  const { t } = useTranslation();
  const columns = useTableColumns(t, organisaatioOid);

  const filterServices = useContext(FilterStateContext);
  const [state] = useActor(filterServices.filterService);
  const { send } = filterServices.filterService;

  const filterState = useFilterState(VALINTAPERUSTE, state, send);

  return (
    <>
      <NavigationAnchor id="valintaperusteet" />
      <ListCollapse
        icon={ICONS[VALINTAPERUSTE]}
        header={t('yleiset.valintaperusteet')}
        actions={
          canCreate ? <Actions organisaatioOid={organisaatioOid} /> : null
        }
        defaultOpen
      >
        <EntitySearchList
          searchEntities={searchValintaperusteet}
          organisaatioOid={organisaatioOid}
          entityType={VALINTAPERUSTE}
          columns={columns}
          nimiPlaceholder={t('etusivu.haeValintaperusteita')}
          filterState={filterState}
        />
      </ListCollapse>
    </>
  );
};

export default ValintaperusteetSection;
