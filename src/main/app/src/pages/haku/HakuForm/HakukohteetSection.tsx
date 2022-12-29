import React, { useCallback, useMemo } from 'react';

import { useInterpret } from '@xstate/react';
import { useTranslation } from 'react-i18next';

import { ENTITY } from '#/src/constants';
import { hakukohdeMachine } from '#/src/machines/filterMachines';
import { createHakukohdeListColumns } from '#/src/pages/haku/HakuForm/createHakukohdeListColumns';
import { EntityListActionBar } from '#/src/pages/HomePage/EntityListActionBar';
import { EntitySearchList } from '#/src/pages/HomePage/EntitySearchList';
import {
  SERVICE_BY_ENTITY,
  useEntitySelection,
} from '#/src/pages/HomePage/useEntitySelection';
import { useFilterState } from '#/src/pages/HomePage/useFilterState';
import { searchFilteredHakukohteet } from '#/src/utils/hakukohde/searchHakukohteet';
import isYhteishakuHakutapa from '#/src/utils/isYhteishakuHakutapa';

const { HAKUKOHDE } = ENTITY;

const HakukohdeActionBar = () => {
  const { selection, removeSelection } = useEntitySelection(HAKUKOHDE);

  const changeTila = useCallback(
    tila => {
      //TODO vaihdetaanko heti vai tallennuksen yhteydessä?
      console.log('testi tila');
      console.log(tila);
      console.log('testi selection');
      console.log(selection);
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

export const HakukohteetSection = function ({ haku, organisaatioOid }) {
  const { t } = useTranslation();
  const isYhteishaku = isYhteishakuHakutapa(haku?.hakutapaKoodiUri);

  const columns = useMemo(
    () =>
      createHakukohdeListColumns(
        t,
        organisaatioOid
      )(SERVICE_BY_ENTITY[HAKUKOHDE]),
    [t, organisaatioOid]
  );

  const actionBar = isYhteishaku ? HakukohdeActionBar : undefined;

  let filterParams = { hakuOid: haku?.oid };

  const hakukohdeService = useInterpret(hakukohdeMachine);

  const filterState = useFilterState(HAKUKOHDE, hakukohdeService);

  return (
    <EntitySearchList
      ActionBar={actionBar}
      searchEntities={searchFilteredHakukohteet(filterParams)}
      organisaatioOid={organisaatioOid}
      entityType={HAKUKOHDE}
      columns={columns}
      nimiPlaceholder={t('etusivu.haeHakukohteita')}
      filterState={filterState}
      searchPage="haku.hakukohteet"
    />
  );
};
