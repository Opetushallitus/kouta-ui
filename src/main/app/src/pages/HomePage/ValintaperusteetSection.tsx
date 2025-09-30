import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  makeJulkinenColumn,
  makeKoulutustyyppiColumn,
  makeModifiedColumn,
  makeMuokkaajaColumn,
  makeNimiColumn,
  makeTilaColumn,
} from '#/src/components/ListTable';
import { Button } from '#/src/components/virkailija';
import { ENTITY, ICONS } from '#/src/constants';
import { valintaperusteService } from '#/src/machines/filterMachines';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchValintaperusteet } from '#/src/utils/valintaperuste/searchValintaperusteet';

import { EntitySearchList } from './EntitySearchList';
import ListCollapse from './ListCollapse';

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

  const filterState = useFilterState(VALINTAPERUSTE, valintaperusteService);

  return (
    <div id="valintaperusteet" data-test-id="valintaperusteetSection">
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
          searchPage="homepage.valintaperusteet"
        />
      </ListCollapse>
    </div>
  );
};

export default ValintaperusteetSection;
