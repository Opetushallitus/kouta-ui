import React from 'react';

import Typography from '../Typography';
import { getKoutaHakuHakukohteet } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';

const getHakukohteet = async ({
  httpClient,
  apiUrls,
  oid,
  organisaatioOid,
}) => {
  return oid
    ? getKoutaHakuHakukohteet({ httpClient, apiUrls, oid, organisaatioOid })
    : [];
};

const HakukohteetSection = ({ haku, organisaatioOid }) => {
  const hakuOid = haku ? haku.oid : null;
  const { t } = useTranslation();

  const { data: hakukohteet } = useApiAsync({
    promiseFn: getHakukohteet,
    oid: hakuOid,
    watch: hakuOid,
    organisaatioOid: organisaatioOid,
  });

  const hakukohdeNames = hakukohteet
    ? hakukohteet
        .map(({ nimi }) => getFirstLanguageValue(nimi))
        .filter(n => !!n)
    : [];

  return (
    <Typography>
      {hakukohdeNames.length === 0
        ? t('hakulomake.haullaEiHakukohteita')
        : `${t(
            'hakulomake.hakuunOnLiitettyHakukohteet',
          )}: ${hakukohdeNames.join(', ')}`}
    </Typography>
  );
};

export default HakukohteetSection;
