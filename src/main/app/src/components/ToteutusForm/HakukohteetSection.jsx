import React from 'react';

import Typography from '../Typography';
import { getKoutaToteutusHakukohteet } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';

const getHakukohteet = async ({ httpClient, apiUrls, oid }) => {
  return oid ? getKoutaToteutusHakukohteet({ httpClient, apiUrls, oid }) : [];
};

const HakukohteetSection = ({ toteutus }) => {
  const toteutusOid = toteutus ? toteutus.oid : null;
  const { t } = useTranslation();

  const { data: hakukohteet } = useApiAsync({
    promiseFn: getHakukohteet,
    oid: toteutusOid,
    watch: toteutusOid,
  });

  const hakukohdeNames = hakukohteet
    ? hakukohteet.map(({ nimi }) => getFirstLanguageValue(nimi)).filter(n => !!n)
    : [];

  return (
    <Typography>
      {hakukohdeNames.length === 0
        ? t('toteutuslomake.toteutuksellaEiHakukohteita')
        : `${t('toteutuslomake.toteutukseenOnLiitettyHakukohteet')}: ${hakukohdeNames.join(
            ', ',
          )}`}
    </Typography>
  );
};

export default HakukohteetSection;
