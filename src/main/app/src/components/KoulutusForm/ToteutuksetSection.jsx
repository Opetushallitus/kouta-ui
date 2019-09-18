import React from 'react';
import { Link } from 'react-router-dom';

import Typography from '../Typography';
import { getKoutaKoulutusToteutukset } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import Anchor from '../Anchor';

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

  const toteutusLinks = toteutukset
    ? toteutukset.map(({ nimi, oid }) => (
        <Anchor as={Link} to={`/toteutus/${oid}/muokkaus`}>
          {getFirstLanguageValue(nimi) || '-'}
        </Anchor>
      ))
    : [];

  const toteutusLinksList = toteutusLinks.map((l, index) => (
    <>
      {l}
      {index < toteutusLinks.length - 1 ? ', ' : ''}
    </>
  ));

  return (
    <Typography>
      {toteutusLinks.length === 0 ? (
        t('koulutuslomake.koulutuksellaEiToteutuksia')
      ) : (
        <>
          {t('koulutuslomake.koulutukseenOnLiitettyToteutukset')}:{' '}
          {toteutusLinksList}
        </>
      )}
    </Typography>
  );
};

export default ToteutuksetSection;
