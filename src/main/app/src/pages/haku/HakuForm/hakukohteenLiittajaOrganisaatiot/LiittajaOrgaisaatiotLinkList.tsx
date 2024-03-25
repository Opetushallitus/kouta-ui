import { useMemo } from 'react';

import { compact, flow, map, sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

import ListTable, { makeNimiColumn } from '#/src/components/ListTable';
import { ORGANISAATIOTYYPPI } from '#/src/constants';
import { useOrganisaatiot } from '#/src/hooks/useOrganisaatio';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { organisaatioMatchesTyyppi } from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

export const LiittajaOrganisaatiotLinkList = ({ haku }) => {
  const { t } = useTranslation();

  const { organisaatiot: hakukohteenLiittajaOrganisaatiot } = useOrganisaatiot(
    haku?.hakukohteenLiittajaOrganisaatiot ?? []
  );

  const columns = [
    makeNimiColumn(t, {
      title: '',
      getLinkUrl: org => {
        if (organisaatioMatchesTyyppi(ORGANISAATIOTYYPPI.OPPILAITOS)(org)) {
          return `/organisaatio/${org.oid}/oppilaitos`;
        }
      },
    }),
  ];

  const rows = useMemo(() => {
    return flow(
      compact,
      ts => map(ts, (entity: any = {}) => ({ ...entity, key: entity.oid })),
      ts => sortBy(ts, e => getFirstLanguageValue(e.nimi))
    )(hakukohteenLiittajaOrganisaatiot);
  }, [hakukohteenLiittajaOrganisaatiot]);

  return <ListTable rows={rows} columns={columns} />;
};
