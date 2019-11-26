import React from 'react';
import { Link } from 'react-router-dom';

import Typography from '../Typography';
import getHaunHakukohteet from '../../utils/kouta/getHaunHakukohteet';
import useApiAsync from '../useApiAsync';
import { getFirstLanguageValue } from '../../utils';
import useTranslation from '../useTranslation';
import Anchor from '../Anchor';

const getHakukohteet = async ({
  httpClient,
  apiUrls,
  oid,
  organisaatioOid,
}) => {
  return oid
    ? getHaunHakukohteet({ httpClient, apiUrls, oid, organisaatioOid })
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

  const hakukohdeLinks = hakukohteet
    ? hakukohteet.map(({ nimi, oid }) => (
        <Anchor as={Link} to={`/organisaatio/${organisaatioOid}/hakukohde/${oid}/muokkaus`}>
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
        t('hakulomake.haullaEiHakukohteita')
      ) : (
        <>
          {t('hakulomake.hakuunOnLiitettyHakukohteet')}: {hakukohdeLinksList}
        </>
      )}
    </Typography>
  );
};

export default HakukohteetSection;
