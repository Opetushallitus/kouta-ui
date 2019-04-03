import React from 'react';

import Typography from '../Typography';
import { getKoutaKoulutusToteutukset } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';

const getToteutukset = async ({ httpClient, apiUrls, oid }) => {
  return oid ? getKoutaKoulutusToteutukset({ httpClient, apiUrls, oid }) : [];
};

const ToteutuksetSection = ({ koulutus }) => {
  const { t } = useTranslation();
  const koulutusOid = koulutus ? koulutus.oid : null;

  const { data: toteutukset } = useApiAsync({
    promiseFn: getToteutukset,
    oid: koulutusOid,
    watch: koulutusOid,
  });

  const toteutusNames = toteutukset
    ? toteutukset
        .map(({ nimi }) => getFirstLanguageValue(nimi))
        .filter(n => !!n)
    : [];

  return (
    <Typography>
      {toteutusNames.length === 0
        ? t('koulutuslomake.koulutuksellaEiToteutuksia')
        : `${t(
            'koulutuslomake.koulutukseenOnLiitettyToteutukset',
          )}: ${toteutusNames.join(', ')}`}
    </Typography>
  );
};

export default ToteutuksetSection;
