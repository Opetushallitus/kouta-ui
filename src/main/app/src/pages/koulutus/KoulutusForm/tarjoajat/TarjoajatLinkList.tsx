import React, { useMemo } from 'react';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import ListTable, { makeNimiColumn } from '#/src/components/ListTable';
import { ORGANISAATIOTYYPPI } from '#/src/constants';
import { useOrganisaatiot } from '#/src/hooks/useOrganisaatio';
import { getFirstLanguageValue } from '#/src/utils/languageUtils';
import { organisaatioMatchesTyyppi } from '#/src/utils/organisaatio/organisaatioMatchesTyyppi';

export const TarjoajatLinkList = ({ koulutus }) => {
  const { t } = useTranslation();

  const { organisaatiot: tarjoajat } = useOrganisaatiot(
    koulutus?.tarjoajat ?? []
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
    return _.flow(
      _.compact,
      ts => _.map(ts, (entity: any = {}) => ({ ...entity, key: entity.oid })),
      ts => _.sortBy(ts, e => getFirstLanguageValue(e.nimi))
    )(tarjoajat);
  }, [tarjoajat]);

  return <ListTable rows={rows} columns={columns} />;
};
