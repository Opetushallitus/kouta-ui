import React from 'react';
import { Link } from 'react-router-dom';

import Typography from '../Typography';
import { getKoutaToteutusHakukohteet } from '../../apiUtils';
import useApiAsync from '../useApiAsync';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import Anchor from '../Anchor';

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

  const hakukohdeLinks = hakukohteet
    ? hakukohteet.map(({ nimi, oid }) => (
        <Anchor as={Link} to={`/hakukohde/${oid}/muokkaus`}>
          {getFirstLanguageValue(nimi) || '-'}
        </Anchor>
      ))
    : [];

  const hakukohdeLinksList = hakukohdeLinks.map((l, index) => (
    <>
      {l}
      {index < hakukohdeLinks.length - 1 ? ', ' : ''}
    </>
  ));

  return (
    <Typography>
      {hakukohdeLinks.length === 0 ? (
        t('toteutuslomake.toteutuksellaEiHakukohteita')
      ) : (
        <>
          {t('toteutuslomake.toteutukseenOnLiitettyHakukohteet')}:{' '}
          {hakukohdeLinksList}
        </>
      )}
    </Typography>
  );
};

export default HakukohteetSection;
